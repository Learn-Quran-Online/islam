import React, { useState, useEffect } from 'react';
import { getPrayerTimes, getNextPrayerNotification } from '../utils/prayerTimes';
import { FaBell, FaTimes } from 'react-icons/fa';

const PrayerNotification = () => {
  const [notification, setNotification] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      const times = await getPrayerTimes();
      setPrayerTimes(times);
    };

    fetchPrayerTimes();
    
    // Check for notifications every minute
    const interval = setInterval(() => {
      if (prayerTimes) {
        const notificationInfo = getNextPrayerNotification(prayerTimes);
        if (notificationInfo.shouldNotify) {
          showNotification(notificationInfo);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [prayerTimes]);

  const showNotification = (notificationInfo) => {
    setNotification(notificationInfo);
    
    // Play notification sound
    playNotificationSound();
    
    // Request browser notification permission
    if (Notification.permission === 'granted') {
      new Notification('Prayer Time Reminder', {
        body: notificationInfo.message,
        icon: '/logo192.png'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Prayer Time Reminder', {
            body: notificationInfo.message,
            icon: '/logo192.png'
          });
        }
      });
    }

    // Auto dismiss after 10 seconds
    setTimeout(() => {
      setNotification(null);
    }, 10000);
  };

  const playNotificationSound = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  if (!notification) return null;

  return (
    <div className="notification">
      <div className="d-flex align-items-center">
        <FaBell className="me-2" />
        <span className="flex-grow-1">{notification.message}</span>
        <button 
          className="btn btn-sm btn-outline-light ms-2"
          onClick={dismissNotification}
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default PrayerNotification;