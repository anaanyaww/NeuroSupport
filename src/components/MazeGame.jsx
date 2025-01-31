import React, { useEffect, useRef, useState } from "react";
import "./MazeGame.css"; // Make sure to import your CSS

const MazeGame = () => {
    const canvasRef = useRef(null);
    const [player, setPlayer] = useState({ x: 0, y: 0 });
    const finish = { x: 9, y: 9 };

    // Define initial maze (can be modified for next levels)
    const [maze, setMaze] = useState([
        [1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 1]
    ]);

    const tileSize = 40;

    useEffect(() => {
        drawMaze();
    }, [player, maze]);

    // Render Maze
    const drawMaze = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let y = 0; y < maze.length; y++) {
          for (let x = 0; x < maze[y].length; x++) {
              // Draw empty spaces in white
              ctx.fillStyle = maze[y][x] === 0 ? "white" : "black"; 
              ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          }
      }
      
      // Draw Player
      ctx.fillStyle = "blue";
      ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
      // Draw Finish Point
      ctx.fillStyle = "green";
      ctx.fillRect(finish.x * tileSize, finish.y * tileSize, tileSize, tileSize);
  };
  

    // Player Movement
    const handleKeyDown = (e) => {
        let newX = player.x;
        let newY = player.y;

        switch (e.key) {
            case "ArrowUp":
                newY--;
                break;
            case "ArrowDown":
                newY++;
                break;
            case "ArrowLeft":
                newX--;
                break;
            case "ArrowRight":
                newX++;
                break;
            default:
                return; // Exit this handler for other keys
        }

        // Check for boundaries and walls
        if (newX >= 0 && newX < maze[0].length && newY >= 0 && newY < maze.length) {
            if (maze[newY][newX] === 0) {
                setPlayer({ x: newX, y: newY });
            }
        }

        checkFinish();
    };

    // Check Finish and Show Congratulations
    const checkFinish = () => {
        // Check if player is adjacent to finish
        const isAdjacent =
            (player.x === finish.x && Math.abs(player.y - finish.y) === 1) || // vertical adjacency
            (player.y === finish.y && Math.abs(player.x - finish.x) === 1); // horizontal adjacency

        if (isAdjacent) {
            alert("Congratulations! You've reached the finish!"); // Replace with a better modal or message display
            setTimeout(nextLevel, 2000); // Proceed to next level after 2 seconds
        }
    };

    // Next Level Setup
    const nextLevel = () => {
        setPlayer({ x: 0, y: 0 }); // Reset player position to start
        setMaze([
            [0, 0, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 1]
        ]); // New complex maze layout
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [player]);

    return (
        <div className="game-container">
            <h1 className="game-title">Maze Game</h1>
            <canvas ref={canvasRef} width={400} height={400}></canvas>
            <p id="congratulations-message" className="hidden">Congratulations! You've reached the finish!</p>
        </div>
    );
};

export default MazeGame;
