import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Modal, Alert, Toast, ToastContainer } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaPlay, FaPause, FaStop, FaVolumeUp, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { quranSurahs } from '../data/quranData';

const Quran = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSurahs, setFilteredSurahs] = useState(quranSurahs);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    const filtered = quranSurahs.filter(surah =>
      surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.arabic.includes(searchQuery)
    );
    setFilteredSurahs(filtered);
  }, [searchQuery]);

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const showError = (title, message) => {
    setErrorMessage({ title, message });
    setShowErrorModal(true);
  };

  const handleSurahClick = (surah) => {
    // Check if another audio is playing
    if (isPlaying && selectedSurah && selectedSurah.number !== surah.number) {
      showError(
        'Audio Already Playing',
        `Please stop the current recitation of ${selectedSurah.arabic} (${selectedSurah.english}) before playing a new one.`
      );
      return;
    }

    setSelectedSurah(surah);
    setIsPlaying(false);
    setCurrentTime(0);
    setLoading(true);
    
    if (audioRef.current) {
      audioRef.current.src = surah.audio;
      audioRef.current.load();
    }

    showNotification(`Selected ${surah.arabic} - ${surah.english}`, 'success');
  };

  const togglePlayPause = async () => {
    if (!audioRef.current || !selectedSurah) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        showNotification('Recitation paused', 'info');
      } else {
        setLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
        setLoading(false);
        showNotification('Recitation started', 'success');
      }
    } catch (error) {
      setLoading(false);
      setIsPlaying(false);
      showError(
        'Audio Playback Error',
        'Unable to play the audio. This might be due to network issues or browser restrictions. Please check your internet connection and try again.'
      );
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      showNotification('Recitation stopped', 'info');
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setLoading(false);
    }
  };

  const handleAudioError = () => {
    setLoading(false);
    setIsPlaying(false);
    showError(
      'Audio Loading Failed',
      'Failed to load the audio file. The audio might be temporarily unavailable. Please try again later or select a different Surah.'
    );
  };

  const handleProgressClick = (e) => {
    if (audioRef.current && duration > 0) {
      const progressBar = e.currentTarget;
      const clickX = e.clientX - progressBar.offsetLeft;
      const width = progressBar.offsetWidth;
      const newTime = (clickX / width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
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
              <h1 className="text-center mb-4">القرآن الكريم</h1>
              <p className="text-center mb-5">The Holy Quran - Listen and Learn</p>
            </motion.div>
          </Col>
        </Row>

        {/* Enhanced Search Bar */}
        <Row className="justify-content-center mb-4">
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Form.Group className="search-container">
                <Form.Control
                  type="text"
                  placeholder="Search Surahs by name, English, or Arabic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <div className="search-btn">
                  <FaSearch />
                </div>
              </Form.Group>
              {searchQuery && (
                <div className="text-center mt-2">
                  <small className="text-muted">
                    Found {filteredSurahs.length} of {quranSurahs.length} Surahs
                  </small>
                </div>
              )}
            </motion.div>
          </Col>
        </Row>

        {/* Enhanced Audio Player */}
        <AnimatePresence>
          {selectedSurah && (
            <Row className="mb-5">
              <Col>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="audio-player">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="mb-0">
                        <FaVolumeUp className="me-2" />
                        {selectedSurah.arabic} - {selectedSurah.english}
                      </h4>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-primary me-2">{selectedSurah.verses} verses</span>
                        <span className="badge bg-secondary">{selectedSurah.type}</span>
                      </div>
                    </div>
                    
                    <div className="audio-controls">
                      <motion.button 
                        className="control-btn me-2"
                        onClick={togglePlayPause}
                        disabled={loading}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {loading ? (
                          <div className="spinner-border spinner-border-sm" role="status"></div>
                        ) : isPlaying ? (
                          <FaPause />
                        ) : (
                          <FaPlay />
                        )}
                      </motion.button>
                      
                      <motion.button 
                        className="control-btn me-3"
                        onClick={stopAudio}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaStop />
                      </motion.button>
                      
                      <div 
                        className="progress-bar"
                        onClick={handleProgressClick}
                      >
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
                          }}
                        ></div>
                      </div>
                      
                      <div className="time-display ms-3">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>
                    
                    {isPlaying && (
                      <motion.div 
                        className="mt-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="d-flex align-items-center justify-content-center">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="me-2"
                          >
                            🎵
                          </motion.div>
                          <small className="text-muted">Now playing beautiful recitation...</small>
                        </div>
                      </motion.div>
                    )}
                    
                    <audio
                      ref={audioRef}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => {
                        setIsPlaying(false);
                        showNotification('Recitation completed', 'success');
                      }}
                      onError={handleAudioError}
                      onLoadStart={() => setLoading(true)}
                      onCanPlay={() => setLoading(false)}
                    />
                  </div>
                </motion.div>
              </Col>
            </Row>
          )}
        </AnimatePresence>

        {/* Enhanced Surah List */}
        <Row>
          <Col>
            <AnimatePresence>
              <div className="surah-list">
                {filteredSurahs.map((surah, index) => (
                  <motion.div
                    key={surah.number}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`surah-card ${selectedSurah?.number === surah.number ? 'selected' : ''}`}
                    onClick={() => handleSurahClick(surah)}
                  >
                    <div className="d-flex align-items-start">
                      <div className="surah-number">{surah.number}</div>
                      <div className="flex-grow-1">
                        <div className="surah-arabic">{surah.arabic}</div>
                        <div className="surah-english">{surah.name}</div>
                        <div className="surah-info">
                          {surah.english} • {surah.verses} verses • {surah.type}
                        </div>
                        {selectedSurah?.number === surah.number && (
                          <motion.div 
                            className="mt-2"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <div className="d-flex align-items-center">
                              <FaCheckCircle className="text-success me-2" />
                              <small className="text-primary fw-bold">
                                {loading ? 'Loading...' : isPlaying ? 'Now Playing...' : 'Selected'}
                              </small>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </Col>
        </Row>

        {filteredSurahs.length === 0 && (
          <Row>
            <Col className="text-center py-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FaExclamationTriangle size={50} className="text-warning mb-3" />
                <h4>No Surahs Found</h4>
                <p className="text-muted">
                  No Surahs match your search criteria. Try different keywords or clear the search.
                </p>
                <Button 
                  variant="outline-primary" 
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              </motion.div>
            </Col>
          </Row>
        )}
      </Container>

      {/* Beautiful Error Modal */}
      <Modal 
        show={showErrorModal} 
        onHide={closeErrorModal} 
        centered
        backdrop="static"
      >
        <Modal.Header className="bg-danger text-white" closeButton>
          <Modal.Title className="d-flex align-items-center">
            <FaExclamationTriangle className="me-2" />
            {errorMessage.title || 'Error'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <FaExclamationTriangle size={60} className="text-warning mb-3" />
            </motion.div>
            <p className="lead">{errorMessage.message}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={closeErrorModal}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              closeErrorModal();
              if (selectedSurah) {
                stopAudio();
              }
            }}
          >
            {selectedSurah ? 'Stop Current Audio' : 'Understood'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050, top: '100px' }}>
        {notifications.map((notification) => (
          <Toast 
            key={notification.id} 
            show={true} 
            delay={4000} 
            autohide
            bg={notification.type === 'error' ? 'danger' : notification.type === 'success' ? 'success' : notification.type === 'warning' ? 'warning' : 'info'}
          >
            <Toast.Header closeButton={false}>
              <div className="d-flex align-items-center">
                {notification.type === 'success' && <FaCheckCircle className="me-2" />}
                {notification.type === 'error' && <FaExclamationTriangle className="me-2" />}
                <strong className="me-auto">
                  {notification.type === 'error' ? 'Error' : 
                   notification.type === 'success' ? 'Success' : 
                   notification.type === 'warning' ? 'Warning' : 'Info'}
                </strong>
              </div>
            </Toast.Header>
            <Toast.Body className="text-white">
              {notification.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </div>
  );
};

export default Quran;