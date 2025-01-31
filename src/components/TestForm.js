import React, { useState } from 'react';
import './TestForm.css';

// Expanded list of questions
const questions = [
    { id: 1, question: 'I often notice small sounds when others do not.', options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'] },
    { id: 2, question: 'I usually concentrate more on the whole picture, rather than the small details.', options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'] },
    { id: 3, question: 'I find it easy to do more than one thing at once.', options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'] },
    { id: 4, question: 'I frequently get so strongly absorbed in one thing that I lose sight of other things.', options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'] },
    { id: 5, question: 'I find it difficult to imagine what it would be like to be someone else.', options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'] },
    { id: 6, question: 'I find it easy to read between the lines when someone is talking to me.', options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'] },
    { id: 7, question: 'I enjoy social gatherings because I can keep up with everyone.', options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'] },
    { id: 8, question: 'I can sense when people are bored or frustrated during conversations.', options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'] },
    { id: 9, question: 'I am good at making small talk in social settings.', options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'] },
    { id: 10, question: 'I get anxious when faced with changes in routine or unexpected events.', options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'] },
    { id: 11, question: 'I prefer to focus on the small details rather than the big picture.', options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'] },
    { id: 12, question: 'I often struggle with keeping track of time during tasks.', options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'] },
    { id: 13, question: 'I tend to follow the same routine every day without much change.', options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'] },
    { id: 14, question: 'I find it difficult to make decisions quickly in social settings.', options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'] },
    { id: 15, question: 'I prefer solitary activities over group ones.', options: ['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'] }
];

const TestForm = ({ submitTest }) => {
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [testStarted, setTestStarted] = useState(false); // Track if the test has started

    const handleOptionChange = (e) => {
        const selectedValue = e.target.value;
        setAnswers({
            ...answers,
            [questions[currentQuestion].id]: selectedValue
        });
        setSelectedOption(selectedValue);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption('');
        } else {
            submitTest(answers);
        }
    };

    const handleStartTest = () => {
        setTestStarted(true); // Set test started to true
    };

    return (
        <div className="test-container">
            {!testStarted ? (
                <div className="start-button-container">
                    <h2>Dyslexia and Autism Self-Assessment</h2>
                    <p>Click the button below to start the test.</p>
                    <button className="start-button" onClick={handleStartTest}>
                        Start
                    </button>
                </div>
            ) : (
                <div className="question-box">
                    <div className="question-number">Question {currentQuestion + 1} of {questions.length}</div>
                    <div className="question-text">{questions[currentQuestion].question}</div>
                    <div className="options-container">
                        {questions[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                className="option-button"
                                onClick={handleOptionChange}
                                value={option}
                                style={{ backgroundColor: selectedOption === option ? '#0073e6' : '#e6f7ff', color: selectedOption === option ? 'white' : '#0073e6' }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
                    </div>
                    <button onClick={handleNext} disabled={!selectedOption}>{currentQuestion < questions.length - 1 ? 'Next' : 'Submit'}</button>
                </div>
            )}
        </div>
    );
};

export default TestForm;
