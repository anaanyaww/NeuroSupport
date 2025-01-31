import React from 'react';
import './gameszone.css';
import { FaPuzzlePiece, FaBookOpen, FaBrain } from 'react-icons/fa'; // Added FaBrain for memory game
import { useNavigate } from 'react-router-dom';
import puzzleImage from './unnamed.png';
import mazeImage from './square-maze-game-for-kids-free-vector.jpg';
import memoryImage from './180445c9f19ac52fa1f5a3bd3e841827.jpg'; // Add your memory game image

const GamesZone = () => {
  const navigate = useNavigate();

  const handleGameClick = (game) => {
    if (game === 'Slide & Solve') {
      navigate('/slideandsolve');
    } else if (game === 'Maze runner') {
      navigate('/mazegame');
    } else if (game === 'Memory Match') {
      navigate('/memorygame');
    }
  };

  return (
    <div className="games-container">
      <h1 className="games-title">
        <span className="icon">🎮</span> Awesome Games Zone
      </h1>
      <div className="games-grid">
        {[
          { name: 'Slide & Solve', icon: <FaPuzzlePiece />, image: puzzleImage },
          { name: 'Maze runner', icon: <FaBookOpen />, image: mazeImage },
          { name: 'Memory Match', icon: <FaBrain />, image: memoryImage },
        ].map((game, index) => (
          <div 
            key={index} 
            className="game-box" 
            onClick={() => handleGameClick(game.name)}
          >
            <img src={game.image} alt={game.name} className="game-image" />
            <div className="game-name">{game.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesZone;