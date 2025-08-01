import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components
import Navbar from './components/Navbar';
import Home from './components/Home';
import Quran from './components/Quran';
import Ibadyat from './components/Ibadyat';
import Settings from './components/Settings';
import PrayerNotification from './components/PrayerNotification';
import Footer from './components/Footer';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: '',
      profilePicture: ''
    };
  });

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const updateProfile = (newProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  return (
    <Router>
      <div className="App">
        <Navbar theme={theme} userProfile={userProfile} />
        <PrayerNotification />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/ibadyat" element={<Ibadyat />} />
          <Route 
            path="/settings" 
            element={
              <Settings 
                theme={theme} 
                toggleTheme={toggleTheme}
                userProfile={userProfile}
                updateProfile={updateProfile}
              />
            } 
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
