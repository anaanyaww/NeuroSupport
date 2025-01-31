import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './components/card';
import { Button } from './components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Brain, 
  BookOpen, 
  MessageSquare, 
  Activity, 
  CheckCircle, 
  User, 
  Gamepad,
  Eye,
  Headphones,
  Type 
} from 'lucide-react';
import './DashBoard.css';
import { useNavigate } from 'react-router-dom';

const progressData = [
  { name: 'Week 1', progress: 20 },
  { name: 'Week 2', progress: 35 },
  { name: 'Week 3', progress: 50 },
  { name: 'Week 4', progress: 65 },
];

const DashBoard = () => {
  const [currentMode, setCurrentMode] = useState('visual');
  const navigate = useNavigate();

  const navigateToGamesZone = () => {
    navigate('/games');
  };

  const navigateToTestForm = () => {
    navigate('/testform');
  };

  const navigateToVirtualFriend = () => {
    navigate('/virtualfriend');
  };

  return (
    <div className="container">
      <h1 className="dashboard-title">Autism and Dyslexia Support Dashboard</h1>

      {/* Virtual Friend Card */}
      <Card className="card virtual-friend-card">
        <CardHeader className="card-header">
          <h2>Your Virtual Friend</h2>
          <User className="icon h-6 w-6" />
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            className="w-full py-8 text-xl font-semibold hover:scale-105 transition-transform"
            onClick={navigateToVirtualFriend}
          >
            Talk with Your Virtual Friend
          </Button>
          <p className="mt-4 text-gray-600">
            Have a natural conversation with an AI friend who understands and responds to your emotions
          </p>
        </CardContent>
      </Card>

      <div className="grid">
        {/* Self Assessment Card */}
        <Card className="card">
          <CardHeader className="card-header">
            <h2>Self-Assessment</h2>
            <Brain className="icon h-6 w-6" />
          </CardHeader>
          <CardContent>
            <Button onClick={navigateToTestForm} className="w-full">
              Take Self-Assessment Test
            </Button>
          </CardContent>
        </Card>

        {/* AI Learning Path Card */}
        <Card className="card">
          <CardHeader className="card-header">
            <h2>AI-Driven Learning Path</h2>
            <BookOpen className="icon h-6 w-6" />
          </CardHeader>
          <CardContent>
            <Button className="w-full">View Personalized Learning Path</Button>
          </CardContent>
        </Card>
      </div>

      {/* Games Zone Card */}
      <Card className="card">
        <CardHeader className="card-header">
          <h2>Games Zone</h2>
          <Gamepad className="icon h-6 w-6" />
        </CardHeader>
        <CardContent>
          <Button onClick={navigateToGamesZone} className="w-full">
            Go to Games Zone
          </Button>
        </CardContent>
      </Card>

      {/* Multimodal Interaction Card */}
      <Card className="card">
        <CardHeader className="card-header">
          <h2>Multimodal Interaction</h2>
          <MessageSquare className="icon h-6 w-6" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              className={`mode-button ${currentMode === 'visual' ? 'active' : ''}`}
              onClick={() => setCurrentMode('visual')}
            >
              <Eye size={20} />
              Visual Mode
            </Button>
            <Button
              className={`mode-button ${currentMode === 'audio' ? 'active' : ''}`}
              onClick={() => setCurrentMode('audio')}
            >
              <Headphones size={20} />
              Audio Mode
            </Button>
            <Button
              className={`mode-button ${currentMode === 'text' ? 'active' : ''}`}
              onClick={() => setCurrentMode('text')}
            >
              <Type size={20} />
              Text Mode
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracking Card */}
      <Card className="card">
        <CardHeader className="card-header">
          <h2>Progress Tracking</h2>
          <Activity className="icon h-6 w-6" />
        </CardHeader>
        <CardContent>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text)' }} />
                <YAxis tick={{ fill: 'var(--text)' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--secondary)', 
                    border: '1px solid var(--border)',
                    color: 'var(--text)'
                  }}
                />
                <Bar dataKey="progress" fill="var(--accent)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Therapy Management Card */}
      <Card className="card">
        <CardHeader className="card-header">
          <h2>Therapy Management</h2>
          <CheckCircle className="icon h-6 w-6" />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
              <TabsTrigger value="past">Past Sessions</TabsTrigger>
              <TabsTrigger value="reports">Progress Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="p-4">
              <div className="text-gray-600">No upcoming sessions scheduled</div>
            </TabsContent>
            <TabsContent value="past" className="p-4">
              <div className="text-gray-600">No past sessions recorded</div>
            </TabsContent>
            <TabsContent value="reports" className="p-4">
              <div className="text-gray-600">No reports available yet</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashBoard;