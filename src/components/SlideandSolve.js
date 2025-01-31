import React, { useState, useEffect } from 'react';
import './SlideandSolve.css'; // Import the CSS file
import bgm from './background-music.mp3'; // Import your background music

const SlideandSolve = () => {
    const gridSize = 4; // 4x4 grid for 15 puzzle
    const [grid, setGrid] = useState([]);
    const [emptyIndex, setEmptyIndex] = useState(gridSize * gridSize - 1); // Start with last cell empty
    const [moves, setMoves] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false); // State to track game completion
    const [isMusicEnabled, setIsMusicEnabled] = useState(true); // State to manage music

    // Define color variables
    const buttonColor = '#34246D'; // Button background color (matches empty grid)
    const gridColor = '#8CD3BB'; // Grid color for numbers
    const correctPositionColor = '#F5934D'; // Correct position color

    useEffect(() => {
        initGame();
    }, []);

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    useEffect(() => {
        const audio = new Audio(bgm);
        audio.loop = true; // Loop the audio

        if (isMusicEnabled) {
            audio.play().catch((error) => {
                console.error("Error playing audio:", error);
            });
        } else {
            audio.pause();
        }

        return () => {
            audio.pause(); // Pause audio on component unmount
            audio.currentTime = 0; // Reset to the start
        };
    }, [isMusicEnabled]);

    const initGame = () => {
        let numbers;
        do {
            numbers = Array.from({ length: gridSize * gridSize - 1 }, (_, i) => i + 1);
            numbers.push(null); // Add null for the empty space
            shuffle(numbers);
        } while (!isSolvable(numbers)); // Repeat until a solvable configuration is found

        setGrid(numbers);
        setMoves(0);
        setTimer(0);
        setIsPlaying(true);
        setIsCompleted(false); // Reset completion state
        setEmptyIndex(numbers.indexOf(null));
    };

    // Function to count inversions
    const countInversions = (array) => {
        let inversions = 0;
        for (let i = 0; i < array.length; i++) {
            for (let j = i + 1; j < array.length; j++) {
                if (array[i] !== null && array[j] !== null && array[i] > array[j]) {
                    inversions++;
                }
            }
        }
        return inversions;
    };

    // Function to check if the puzzle is solvable
    const isSolvable = (numbers) => {
        const inversions = countInversions(numbers);
        const blankIndex = numbers.indexOf(null);
        const blankRow = Math.floor(blankIndex / gridSize); // 0-based row index

        // If gridSize is odd, we only need to check inversions
        if (gridSize % 2 !== 0) {
            return inversions % 2 === 0;
        } else {
            // If gridSize is even, check the row of the blank
            return (blankRow % 2 === 0) ? (inversions % 2 !== 0) : (inversions % 2 === 0);
        }
    };

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const moveTile = (index) => {
        if (
            (index === emptyIndex - 1 && index % gridSize !== gridSize - 1) || // Left
            (index === emptyIndex + 1 && emptyIndex % gridSize !== gridSize - 1) || // Right
            index === emptyIndex - gridSize || // Up
            index === emptyIndex + gridSize // Down
        ) {
            const newGrid = [...grid];
            [newGrid[index], newGrid[emptyIndex]] = [newGrid[emptyIndex], newGrid[index]];
            setGrid(newGrid);
            setEmptyIndex(index);
            setMoves(moves + 1);

            // Check if the game is completed
            if (checkCompletion(newGrid)) {
                setIsCompleted(true);
                setIsPlaying(false); // Stop the timer when completed
            }
        }
    };

    const checkCompletion = (grid) => {
        // Loop through each index of the grid
        for (let index = 0; index < grid.length; index++) {
            // The expected value at this index should be (index + 1) for numbers, or null for the last position
            const expectedValue = index === grid.length - 1 ? null : index + 1;
            if (grid[index] !== expectedValue) {
                return false; // If any tile is in the wrong position, return false
            }
        }
        return true; // All tiles are in the correct position
    };

    // Function to get the background color for each tile
    const getTileBackgroundColor = (number, index) => {
        // If the number is null (empty), return the button color
        if (number === null) return buttonColor;

        // Calculate the correct position for the number
        const correctPosition = (number - 1) % (gridSize * gridSize);

        // Return the correct position color if the tile is in the correct position, else return the grid color
        return index === correctPosition ? correctPositionColor : gridColor;
    };

    // Function to toggle music
    const toggleMusic = () => {
        setIsMusicEnabled((prev) => !prev); // Toggle music state
    };

    return (
        <div
            className="puzzle-game"
            style={{
                backgroundColor: '#5A4389',
                textAlign: 'center',
                padding: '5px',
                minHeight: '100vh', // Set minimum height to fill the viewport
                overflow: 'hidden', // Prevent scrolling
                position: 'relative', // Needed for absolute positioning of the modal
            }}
        >
            <h1 style={{ color: '#f0f0f0', fontFamily: 'Comic Sans MS', fontSize: '50px' }}>Slide & Solve</h1>
            {/* Controls above the grid */}
            <div className="controls" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}>
                    <div style={{ color: '#fff', fontSize: '18px', margin: '0 10px' }}>Time: {timer}s</div>
                    <div style={{ color: '#fff', fontSize: '18px', margin: '0 10px' }}>Moves: {moves}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
                    <button
                        onClick={initGame}
                        style={{
                            backgroundColor: buttonColor,
                            color: '#fff',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            marginRight: '5px', // Add space between buttons
                        }}
                    >
                        New Game
                    </button>
                    <button
                        onClick={toggleMusic}
                        style={{
                            backgroundColor: buttonColor,
                            color: '#fff',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                        }}
                    >
                        {isMusicEnabled ? 'Mute Music' : 'Play Music'}
                    </button>
                </div>
            </div>
            <div
                className="grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridSize}, 100px)`,
                    gridTemplateRows: `repeat(${gridSize}, 100px)`,
                    gap: '5px',
                    justifyContent: 'center',
                    margin: '20px auto',
                }}
            >
                {grid.map((number, index) => (
                    <div
                        key={index}
                        className="tile"
                        style={{
                            backgroundColor: getTileBackgroundColor(number, index),
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '46px',
                            fontFamily: 'Comic Sans MS',
                            borderRadius: '5px',
                            cursor: number !== null ? 'pointer' : 'default',
                            transition: 'background-color 0.3s', // Transition effect
                            ...(number === null && { pointerEvents: 'none' }), // Disable pointer events for empty tile
                        }}
                        onClick={() => number !== null && moveTile(index)} // Move tile only if it's not empty
                    >
                        {number}
                    </div>
                ))}
            </div>
            {isCompleted && (
                <div className="modal">
                    <div className="modal-content">
                        <p style={{ fontFamily: 'Comic Sans MS', fontSize: '30px', margin: '0' }}>Congratulations! You've completed the puzzle!</p>
                        <button
                            onClick={initGame}
                            style={{
                                backgroundColor: buttonColor,
                                color: '#fff',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                marginTop: '10px', // Add space above the button
                            }}
                        >
                            Play Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SlideandSolve;
