import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaUser, FaUpload, FaPalette, FaCog } from 'react-icons/fa';

const Settings = ({ theme, toggleTheme, userProfile, updateProfile }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setAlertMessage('File size should be less than 5MB');
        setShowAlert(true);
        return;
      }

      if (!file.type.startsWith('image/')) {
        setAlertMessage('Please select a valid image file');
        setShowAlert(true);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        updateProfile({
          ...userProfile,
          profilePicture: e.target.result
        });
        setAlertMessage('Profile picture updated successfully!');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    updateProfile({
      ...userProfile,
      profilePicture: null
    });
    localStorage.removeItem('profilePicture');
    setAlertMessage('Profile picture removed successfully!');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all app data? This action cannot be undone.')) {
      localStorage.clear();
      updateProfile({ profilePicture: null });
      setAlertMessage('All app data cleared successfully!');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <Container>
        <Row>
          <Col>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-center mb-4">
                <FaCog className="me-2" />
                الإعدادات
              </h1>
              <p className="text-center mb-5">Settings & Preferences</p>
            </motion.div>
          </Col>
        </Row>

        <div className="settings-container">
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <Alert variant="info" onClose={() => setShowAlert(false)} dismissible>
                {alertMessage}
              </Alert>
            </motion.div>
          )}

          {/* Theme Settings */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="setting-group">
              <h3 className="mb-4">
                <FaPalette className="me-2" />
                Appearance
              </h3>
              
              <div className="theme-toggle">
                <div>
                  <h5>Theme</h5>
                  <p className="text-muted">
                    Choose between light and dark theme for better reading experience
                  </p>
                </div>
                <div className="d-flex align-items-center">
                  <FaSun className="me-2" style={{ color: theme === 'light' ? '#ffc107' : '#6c757d' }} />
                  <div 
                    className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}
                    onClick={toggleTheme}
                  >
                    <div className="toggle-slider"></div>
                  </div>
                  <FaMoon className="ms-2" style={{ color: theme === 'dark' ? '#6f42c1' : '#6c757d' }} />
                </div>
              </div>

              <div className="mt-3">
                <small className="text-muted">
                  Current theme: <strong>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</strong>
                </small>
              </div>
            </div>
          </motion.div>

          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="setting-group">
              <h3 className="mb-4">
                <FaUser className="me-2" />
                Profile
              </h3>
              
              <div className="profile-upload">
                {userProfile.profilePicture ? (
                  <img 
                    src={userProfile.profilePicture} 
                    alt="Profile" 
                    className="profile-preview"
                  />
                ) : (
                  <div 
                    className="profile-preview d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: 'var(--border-color)' }}
                  >
                    <FaUser size={40} color="var(--text-color)" />
                  </div>
                )}
                
                <div className="d-flex gap-2">
                  <Button 
                    className="upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaUpload className="me-2" />
                    {userProfile.profilePicture ? 'Change Picture' : 'Upload Picture'}
                  </Button>
                  
                  {userProfile.profilePicture && (
                    <Button 
                      variant="outline-danger"
                      onClick={removeProfilePicture}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfilePictureChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                
                <small className="text-muted mt-2">
                  Supported formats: JPG, PNG, GIF (Max size: 5MB)
                </small>
              </div>
            </div>
          </motion.div>

          {/* App Information */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="setting-group">
              <h3 className="mb-4">App Information</h3>
              
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Version:</strong> 1.0.0
                  </div>
                  <div className="mb-3">
                    <strong>Build:</strong> {new Date().getFullYear()}.{new Date().getMonth() + 1}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Prayer Times:</strong> Gujranwala, Pakistan
                  </div>
                  <div className="mb-3">
                    <strong>Calculation Method:</strong> University of Islamic Sciences, Karachi
                  </div>
                </Col>
              </Row>
            </div>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="setting-group">
              <h3 className="mb-4">Data Management</h3>
              
              <div className="d-flex flex-column gap-3">
                <div>
                  <h5>Clear App Data</h5>
                  <p className="text-muted mb-2">
                    This will remove all your settings, profile picture, and preferences.
                  </p>
                  <Button 
                    variant="outline-danger"
                    onClick={clearAllData}
                  >
                    Clear All Data
                  </Button>
                </div>
                
                <div>
                  <h5>Privacy</h5>
                  <p className="text-muted mb-0">
                    All your data is stored locally on your device. We don't collect or store any personal information on our servers.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className="setting-group">
              <h3 className="mb-4">About Islam360</h3>
              
              <p className="mb-3">
                Islam360 is a comprehensive Islamic companion app designed to help Muslims 
                in their daily spiritual journey. The app provides prayer times, Quran recitation, 
                and educational content about Islamic worship.
              </p>
              
              <div className="row">
                <div className="col-md-6">
                  <h6>Features:</h6>
                  <ul className="list-unstyled">
                    <li>✓ Accurate prayer times</li>
                    <li>✓ Quran with audio recitation</li>
                    <li>✓ Islamic worship guidance</li>
                    <li>✓ Prayer notifications</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Location:</h6>
                  <p>Configured for Gujranwala, Pakistan</p>
                  
                  <h6>Developer:</h6>
                  <p>Built with ❤️ for the Muslim community</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default Settings;