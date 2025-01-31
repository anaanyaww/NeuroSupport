import React, { useState, useRef, useEffect } from 'react';
import './VirtualFriend.css';
import { getBotResponse } from './ChatService';
import AvatarVideo from "./avatar-video.mp4";

const VirtualFriend = () => {
  const videoRef = useRef(null);
  const userCameraRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recognitionRef = useRef(null);
  const utteranceQueueRef = useRef([]);
  const isSpeakingRef = useRef(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [botReply, setBotReply] = useState('');
  const [micPermissionStatus, setMicPermissionStatus] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [apiError, setApiError] = useState(null);

  // Process speech queue
  const processUtteranceQueue = () => {
    if (utteranceQueueRef.current.length === 0 || isSpeakingRef.current) {
      return;
    }

    const nextUtterance = utteranceQueueRef.current[0];
    isSpeakingRef.current = true;
    setIsSpeaking(true);
    if (videoRef.current) videoRef.current.play();

    nextUtterance.onend = () => {
      utteranceQueueRef.current.shift();
      isSpeakingRef.current = false;
      setIsSpeaking(false);
      if (videoRef.current) videoRef.current.pause();
      processUtteranceQueue();
    };

    window.speechSynthesis.speak(nextUtterance);
  };

  // Enhanced speak function
  const speak = (text) => {
    try {
      window.speechSynthesis.cancel();
      utteranceQueueRef.current = [];

      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Samantha') ||
        voice.name.includes('Microsoft Zira') ||
        voice.name.includes('Microsoft Eva') ||
        voice.name.includes('Google US English') ||
        (voice.lang === 'en-US' && voice.name.includes('Female'))
      ) || voices.find(voice => voice.lang === 'en-US') || voices[0];

      sentences.forEach(sentence => {
        const utterance = new SpeechSynthesisUtterance(sentence.trim());
        utterance.voice = preferredVoice;
        utterance.pitch = 1.1;
        utterance.rate = 0.95;
        utterance.volume = 1.0;
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          isSpeakingRef.current = false;
          setIsSpeaking(false);
          if (videoRef.current) videoRef.current.pause();
        };

        utteranceQueueRef.current.push(utterance);
      });

      processUtteranceQueue();
    } catch (error) {
      console.error('Speech synthesis setup error:', error);
    }
  };

  // Request Microphone Permissions
  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermissionStatus('granted');
      initializeSpeechRecognition();
    } catch (err) {
      console.error('Microphone permission denied:', err);
      setMicPermissionStatus('denied');
    }
  };

  // Initialize Speech Recognition
  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('SpeechRecognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = async (event) => {
      try {
        const userMessage = event.results[event.results.length - 1][0].transcript;
        console.log('User:', userMessage);
        
        const newHistory = [...conversationHistory, { role: 'user', content: userMessage }];
        setConversationHistory(newHistory);

        const response = await getBotResponse(userMessage, newHistory);
        if (response) {
          setApiError(null);
          const updatedHistory = [...newHistory, { role: 'assistant', content: response }];
          setConversationHistory(updatedHistory);
          setBotReply(response);
          speak(response);
        }
      } catch (error) {
        console.error('Error processing speech result:', error);
        setApiError(error.message);
        speak("I apologize, but I'm experiencing technical difficulties. Would you like to try again?");
      }
    };

    recognition.onerror = (error) => {
      console.error('Speech recognition error:', error);
      if (error.error === 'not-allowed') {
        setMicPermissionStatus('denied');
      }
    };

    recognition.onend = () => {
      if (micPermissionStatus === 'granted') {
        try {
          recognition.start();
        } catch (error) {
          console.error('Failed to restart recognition:', error);
        }
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      console.error('Failed to start recognition:', error);
    }
  };

  // Initialize camera
  useEffect(() => {
    let mounted = true;

    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (mounted) {
          mediaStreamRef.current = stream;
          if (userCameraRef.current) {
            userCameraRef.current.srcObject = stream;
          }
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    initializeCamera();

    return () => {
      mounted = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Voice initialization
  useEffect(() => {
    const initVoices = () => {
      window.speechSynthesis.getVoices();
      requestMicPermission();
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      initVoices();
    } else {
      window.speechSynthesis.onvoiceschanged = initVoices;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const renderAPIError = () => {
    if (!apiError) return null;

    return (
      <div className="error-container">
        <div className="error-content">
          <h3>Connection Issue</h3>
          <p>There seems to be a problem connecting to the AI service.</p>
          <div className="error-details">
            <h4>Error Details</h4>
            <p>{apiError}</p>
          </div>
          <button 
            onClick={() => {
              setApiError(null);
              if (recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch (error) {
                  console.error('Failed to restart recognition:', error);
                }
              }
            }}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="virtual-friend-container">
      {renderAPIError()}
      
      {micPermissionStatus === 'denied' && (
        <div className="permission-warning">
          <p>Please grant microphone permissions to use speech recognition</p>
          <button onClick={requestMicPermission}>Request Permissions</button>
        </div>
      )}
      
      <div className="avatar-video">
        <video ref={videoRef} src={AvatarVideo} loop muted />
      </div>
      
      <div className="camera-feed">
        <video ref={userCameraRef} autoPlay playsInline muted />
      </div>
    </div>
  );
};

export default VirtualFriend;