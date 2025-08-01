import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Quran from './components/Quran';
import Ibadyat from './components/Ibadyat';
import Settings from './components/Settings';
import PrayerNotification from './components/PrayerNotification';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [userProfile, setUserProfile] = useState({
    profilePicture: localStorage.getItem('profilePicture') || null
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const updateProfile = (profile) => {
    setUserProfile(profile);
    if (profile.profilePicture) {
      localStorage.setItem('profilePicture', profile.profilePicture);
    }
  };

  return (
    <div className={`App ${theme}`}>
      <Router>
        <Navbar theme={theme} userProfile={userProfile} />
        <PrayerNotification />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/ibadyat" element={<Ibadyat />} />
          <Route path="/settings" element={
            <Settings 
              theme={theme} 
              toggleTheme={toggleTheme} 
              userProfile={userProfile}
              updateProfile={updateProfile}
            />
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
