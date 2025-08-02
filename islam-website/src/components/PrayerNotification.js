import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMosque, FaBell, FaVolumeUp, FaClock, FaStar, FaVolumeMute } from 'react-icons/fa';
import { getPrayerTimes, getCurrentPrayer } from '../utils/prayerTimes';

const PrayerNotification = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastNotifiedPrayer, setLastNotifiedPrayer] = useState(null);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      } else {
        setNotificationPermission(Notification.permission);
      }
    }

    // Get sound preference from localStorage
    const savedSoundSetting = localStorage.getItem('prayerSoundEnabled');
    if (savedSoundSetting !== null) {
      setSoundEnabled(JSON.parse(savedSoundSetting));
    }

    // Get last notified prayer from localStorage
    const savedLastNotified = localStorage.getItem('lastNotifiedPrayer');
    if (savedLastNotified) {
      setLastNotifiedPrayer(savedLastNotified);
    }

    // Fetch prayer times
    const fetchPrayerTimes = async () => {
      try {
        const times = await getPrayerTimes();
        setPrayerTimes(times);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };

    fetchPrayerTimes();
  }, []);

  useEffect(() => {
    if (!prayerTimes) return;

    // Check for prayer times every 30 seconds for more accurate notifications
    const interval = setInterval(() => {
      checkPrayerTime();
    }, 30000); // Check every 30 seconds

    // Initial check
    checkPrayerTime();

    return () => clearInterval(interval);
  }, [prayerTimes, lastNotifiedPrayer]);

  const checkPrayerTime = () => {
    if (!prayerTimes) return;

    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Check if current time matches any prayer time
    Object.entries(prayerTimes).forEach(([prayerName, prayerTime]) => {
      if (prayerName === 'date') return;

      // Convert prayer time to 24-hour format for comparison
      const prayerTime24 = convertTo24Hour(prayerTime);
      
      // Check if it's exactly prayer time and we haven't notified for this prayer today
      if (currentTime === prayerTime24) {
        const today = now.toDateString();
        const notificationKey = `${prayerName}-${today}`;
        
        if (lastNotifiedPrayer !== notificationKey) {
          triggerPrayerNotification(prayerName, prayerTime);
          setLastNotifiedPrayer(notificationKey);
          
          // Store in localStorage to persist across page reloads
          localStorage.setItem('lastNotifiedPrayer', notificationKey);
        }
      }
    });

    // Also check for upcoming prayer (5 minutes before)
    checkUpcomingPrayer();
  };

  const checkUpcomingPrayer = () => {
    if (!prayerTimes) return;

    const now = new Date();
    const currentTime = now.getTime();

    Object.entries(prayerTimes).forEach(([prayerName, prayerTime]) => {
      if (prayerName === 'date') return;

      const prayerDateTime = parseTimeToDate(prayerTime);
      const timeDifference = prayerDateTime.getTime() - currentTime;
      
      // Check if prayer is in 5 minutes (5 minutes = 300000 milliseconds)
      if (timeDifference > 0 && timeDifference <= 300000 && timeDifference >= 240000) {
        const today = now.toDateString();
        const reminderKey = `${prayerName}-reminder-${today}`;
        
        if (lastNotifiedPrayer !== reminderKey) {
          triggerUpcomingPrayerNotification(prayerName, prayerTime);
          setLastNotifiedPrayer(reminderKey);
          localStorage.setItem('lastNotifiedPrayer', reminderKey);
        }
      }
    });
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM' || modifier === 'pm') {
      hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const parseTimeToDate = (timeString) => {
    const today = new Date();
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':');
    
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    
    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    
    const prayerDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    return prayerDate;
  };

  const triggerPrayerNotification = (prayerName, prayerTime) => {
    const message = `It's time for ${prayerName} prayer!`;
    
    // Show toast notification
    showNotification({
      type: 'prayer',
      title: `${prayerName} Prayer Time`,
      message: `It's time for ${prayerName} prayer (${prayerTime})`,
      prayerName,
      priority: 'high'
    });

    // Show browser notification
    if (notificationPermission === 'granted') {
      const notification = new Notification(`${prayerName} Prayer Time`, {
        body: message,
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        tag: `prayer-${prayerName}`,
        vibrate: [200, 100, 200, 100, 200],
        requireInteraction: true,
        silent: false
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 15 seconds
      setTimeout(() => {
        notification.close();
      }, 15000);
    }

    // Play notification sound with alarm
    if (soundEnabled) {
      playPrayerAlarm();
    }
  };

  const triggerUpcomingPrayerNotification = (prayerName, prayerTime) => {
    showNotification({
      type: 'reminder',
      title: `Upcoming Prayer`,
      message: `${prayerName} prayer is in 5 minutes (${prayerTime})`,
      prayerName,
      priority: 'medium'
    });

    if (soundEnabled) {
      playReminderSound();
    }
  };

  const playPrayerAlarm = () => {
    if (isAlarmPlaying) return;
    
    setIsAlarmPlaying(true);
    
    try {
      // Create a more complex and beautiful Adhan-like sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a sequence of beautiful tones for Adhan-like sound
      const frequencies = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00]; // C5, D5, E5, F5, G5, A5
      const duration = 1.2; // Duration of each tone
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'sine';
        
        // Create a gentle envelope
        const startTime = audioContext.currentTime + (index * 0.4);
        const endTime = startTime + duration;
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
        
        oscillator.start(startTime);
        oscillator.stop(endTime);
      });
      
      // Add a final resonant tone
      setTimeout(() => {
        const finalOscillator = audioContext.createOscillator();
        const finalGain = audioContext.createGain();
        
        finalOscillator.connect(finalGain);
        finalGain.connect(audioContext.destination);
        
        finalOscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        finalOscillator.type = 'sine';
        
        finalGain.gain.setValueAtTime(0, audioContext.currentTime);
        finalGain.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
        finalGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
        
        finalOscillator.start();
        finalOscillator.stop(audioContext.currentTime + 3);
        
        // Reset alarm state after completion
        setTimeout(() => {
          setIsAlarmPlaying(false);
        }, 3000);
      }, 2400);
      
    } catch (error) {
      console.error('Error playing prayer alarm:', error);
      // Fallback to a simple beep
      playSimpleBeep();
      setIsAlarmPlaying(false);
    }
  };

  const playReminderSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.8);
    } catch (error) {
      console.error('Error playing reminder sound:', error);
    }
  };

  const playSimpleBeep = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Error playing simple beep:', error);
    }
  };

  const showNotification = (notification) => {
    const id = Date.now();
    const newNotification = { ...notification, id, timestamp: new Date() };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove notification after 10 seconds for prayer, 6 seconds for reminder
    const timeout = notification.priority === 'high' ? 10000 : 6000;
    setTimeout(() => {
      removeNotification(id);
    }, timeout);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    localStorage.setItem('prayerSoundEnabled', JSON.stringify(newSoundEnabled));
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    }
  };

  return (
    <>
      {/* Enhanced Notification Settings Button */}
      <div className="prayer-notification-settings">
        <Button
          variant="outline-primary"
          size="sm"
          className="notification-settings-btn"
          onClick={() => document.getElementById('notification-settings').classList.toggle('show')}
        >
          <FaBell className="me-1" />
          Prayer Alerts
          {soundEnabled && <span className="sound-indicator">🔊</span>}
        </Button>
        
        <div id="notification-settings" className="notification-settings-panel">
          <h6>Prayer Notifications</h6>
          <div className="setting-item">
            <Button
              variant={soundEnabled ? "success" : "outline-secondary"}
              size="sm"
              onClick={toggleSound}
            >
              {soundEnabled ? <FaVolumeUp className="me-1" /> : <FaVolumeMute className="me-1" />}
              Sound {soundEnabled ? 'On' : 'Off'}
            </Button>
          </div>
          
          {notificationPermission !== 'granted' && (
            <div className="setting-item">
              <Button
                variant="outline-warning"
                size="sm"
                onClick={requestNotificationPermission}
              >
                <FaBell className="me-1" />
                Enable Browser Notifications
              </Button>
            </div>
          )}
          
          <small className="text-muted">
            {notificationPermission === 'granted' 
              ? '✓ Browser notifications enabled' 
              : 'Browser notifications disabled'}
          </small>
          
          <div className="mt-2">
            <small className="text-info">
              <FaClock className="me-1" />
              Alerts 5 min before & at prayer time
            </small>
          </div>
        </div>
      </div>

      {/* Enhanced Toast Notifications */}
      <ToastContainer position="top-center" className="prayer-toast-container">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Toast
                show={true}
                onClose={() => removeNotification(notification.id)}
                className={`prayer-notification-toast ${notification.type === 'prayer' ? 'prayer-toast' : 'reminder-toast'}`}
              >
                <Toast.Header className="prayer-toast-header">
                  <div className="d-flex align-items-center">
                    {notification.type === 'prayer' ? (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <FaMosque className="me-2 prayer-icon" />
                      </motion.div>
                    ) : (
                      <FaClock className="me-2 reminder-icon" />
                    )}
                    <strong className="prayer-title">{notification.title}</strong>
                  </div>
                  <div className="prayer-time-badge">
                    {notification.timestamp.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </Toast.Header>
                <Toast.Body className="prayer-toast-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="prayer-message">{notification.message}</div>
                      {notification.type === 'prayer' && (
                        <div className="prayer-blessing">
                          <FaStar className="me-1" />
                          <small>May Allah accept your prayers</small>
                        </div>
                      )}
                    </div>
                    {notification.type === 'prayer' && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="prayer-animation"
                      >
                        🤲
                      </motion.div>
                    )}
                  </div>
                </Toast.Body>
              </Toast>
            </motion.div>
          ))}
        </AnimatePresence>
      </ToastContainer>
    </>
  );
};

export default PrayerNotification;