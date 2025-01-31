import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ThemeProvider from './components/ThemeProvider';
import DashBoard from './DashBoard';
import GamesZone from './components/gameszone';
import SlideandSolve from './components/SlideandSolve';
import MazeGame from './components/MazeGame';
import TestForm from './components/TestForm';
import Memorygame from './components/Memorygame';
import VirtualFriend from './components/VirtualFriend';

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/games" element={<GamesZone />} />
        <Route path="/slideandsolve" element={<SlideandSolve/>} />
        <Route path="/mazegame" element={<MazeGame/>} />
        <Route path="/testform" element={<TestForm/>} />
        <Route path="/memorygame" element={<Memorygame/>} />
        <Route path="/virtualfriend" element={<VirtualFriend />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;