import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Ibadyat from './components/Ibadyat';
import Quran from './components/Quran';
import Settings from './components/Settings';
import NamesOfAllah from './components/NamesOfAllah';
import PrayerNotification from './components/PrayerNotification';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: 'User',
      email: 'user@example.com',
      profilePicture: null
    };
  });

  const [scrollProgress, setScrollProgress] = useState(0);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const updateUserProfile = (newProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const progress = (scrollPosition / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className="App">
        {/* Scroll Progress Indicator */}
        <div className="scroll-progress">
          <div 
            className="scroll-progress-bar"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Prayer Notifications */}
        <PrayerNotification />

        {/* Navigation */}
        <Navbar 
          theme={theme} 
          toggleTheme={toggleTheme}
          userProfile={userProfile} 
        />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  theme={theme}
                  userProfile={userProfile}
                />
              } 
            />
            <Route 
              path="/ibadyat" 
              element={<Ibadyat />} 
            />
            <Route 
              path="/quran" 
              element={<Quran />} 
            />
            <Route 
              path="/names" 
              element={<NamesOfAllah />} 
            />
            <Route 
              path="/settings" 
              element={
                <Settings 
                  theme={theme}
                  toggleTheme={toggleTheme}
                  userProfile={userProfile}
                  updateUserProfile={updateUserProfile}
                />
              } 
            />
            <Route 
              path="/dua" 
              element={
                <Container className="py-5">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h1 className="text-center mb-4">Duas & Supplications</h1>
                    <p className="text-center text-muted">Coming Soon...</p>
                  </motion.div>
                </Container>
              } 
            />
            <Route 
              path="/tasbih" 
              element={
                <Container className="py-5">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h1 className="text-center mb-4">Digital Tasbih</h1>
                    <p className="text-center text-muted">Coming Soon...</p>
                  </motion.div>
                </Container>
              } 
            />
            <Route 
              path="/qibla" 
              element={
                <Container className="py-5">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h1 className="text-center mb-4">Qibla Direction</h1>
                    <p className="text-center text-muted">Coming Soon...</p>
                  </motion.div>
                </Container>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <Container className="py-5">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h1 className="text-center mb-4">Islamic Calendar</h1>
                    <p className="text-center text-muted">Coming Soon...</p>
                  </motion.div>
                </Container>
              } 
            />
            <Route 
              path="/times" 
              element={<Ibadyat />} 
            />
          </Routes>
        </motion.div>
      </div>
    </Router>
  );
}

export default App;
