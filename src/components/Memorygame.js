import React, { useState, useEffect } from 'react';
import './Memorygame.css';

// Card component
const Card = ({ card, onClick, flipped, disabled }) => {
  return (
    <div className={`card ${flipped ? 'flipped' : ''}`} onClick={disabled ? null : onClick}>
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{card.emoji}</div>
      </div>
    </div>
  );
};

// Congratulatory Message Component with animation
const CongratulationsMessage = ({ moves, time, onRestart }) => {
  return (
    <div className="congrats-popup">
      <div className="congrats-content">
        <h2>🎉 Congratulations! 🎉</h2>
        <p>You have completed the game!</p>
        <p>Moves: {moves}</p>
        <p>Time: {time} seconds</p>
        <img src="https://i.gifer.com/7efs.gif" alt="Party" className="party-gif" />
        <button onClick={onRestart}>Play Again</button>
      </div>
    </div>
  );
};

function Memorygame() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [pairsFound, setPairsFound] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [theme, setTheme] = useState('light');
  const [time, setTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const cardEmojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐷', '🐸', '🐵', '🦁'];

  // Timer
  useEffect(() => {
    if (!gameComplete && cards.length > 0) {
      const interval = setInterval(() => setTime(time + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [time, gameComplete]);

  useEffect(() => {
    const shuffledCards = shuffleCards([...getDifficultyCards()]);
    setCards(shuffledCards);
  }, [difficulty]);

  const shuffleCards = (cards) => {
    return cards
      .map((emoji) => ({ emoji, id: Math.random() }))
      .sort(() => Math.random() - 0.5);
  };

  const getDifficultyCards = () => {
    if (difficulty === 'easy') return cardEmojis.slice(0, 6).concat(cardEmojis.slice(0, 6));
    if (difficulty === 'medium') return cardEmojis.slice(0, 8).concat(cardEmojis.slice(0, 8));
    return cardEmojis.concat(cardEmojis);
  };

  const handleCardClick = (index) => {
    if (flippedIndices.length === 0) {
      setFlippedIndices([index]);
    } else if (flippedIndices.length === 1) {
      const firstIndex = flippedIndices[0];
      const secondIndex = index;

      if (firstIndex === secondIndex) return;

      setFlippedIndices([firstIndex, secondIndex]);
      setIsChecking(true);

      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        setMatchedCards([...matchedCards, firstIndex, secondIndex]);
        setPairsFound(pairsFound + 1);
      }

      setMoves((prev) => prev + 1);

      setTimeout(() => {
        setFlippedIndices([]);
        setIsChecking(false);
      }, 1000);
    }

    if (matchedCards.length + 2 === cards.length) {
      setTimeout(() => {
        setGameComplete(true);
      }, 500);  // Add a short delay to ensure the final card is flipped
    }
  };

  const resetGame = () => {
    setFlippedIndices([]);
    setMatchedCards([]);
    setMoves(0);
    setPairsFound(0);
    setTime(0);
    setGameComplete(false);
    setCards(shuffleCards([...getDifficultyCards()]));
  };

  return (
    <div className={`memory-game App ${theme}`}>
      <h1>Memory Matching Game</h1>

      {/* Difficulty Selector */}
      <div className="difficulty">
        <label>Difficulty: </label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy (4x3)</option>
          <option value="medium">Medium (4x4)</option>
          <option value="hard">Hard (6x4)</option>
        </select>
      </div>

      {/* Theme Selector */}
      <div className="theme">
        <label>Theme: </label>
        <button onClick={() => setTheme('light')}>Light</button>
        <button onClick={() => setTheme('dark')}>Dark</button>
        <button onClick={() => setTheme('pastel')}>Pastel</button>
      </div>

      <div className="game-board">
        {cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            onClick={() => !isChecking && !flippedIndices.includes(index) && !matchedCards.includes(index) ? handleCardClick(index) : null}
            flipped={flippedIndices.includes(index) || matchedCards.includes(index)}
            disabled={isChecking || flippedIndices.includes(index) || matchedCards.includes(index)}
          />
        ))}
      </div>

      {/* Game Stats */}
      <div className="stats">
        <p>Moves: {moves}</p>
        <p>Pairs Found: {pairsFound} / {cards.length / 2}</p>
      </div>

      {/* Restart Button */}
      <button className="restart-button" onClick={resetGame}>Restart Game</button>

      {/* Display Congratulations when game is complete */}
      {gameComplete && <CongratulationsMessage moves={moves} time={time} onRestart={resetGame} />}
    </div>
  );
}

export default Memorygame;