import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Alert, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaPlay, FaPause, FaStop, FaVolumeUp, FaExclamationTriangle, FaCheckCircle, FaBook, FaArrowLeft, FaDownload } from 'react-icons/fa';
import { quranSurahs } from '../data/quranData';

const Quran = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [showReading, setShowReading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [fullSurahText, setFullSurahText] = useState(null);

  const audioRef = useRef(null);

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  // Generate full Surah text with all verses
  const generateFullSurahText = (surah) => {
    if (!surah) return null;
    
    // For demonstration, we'll create a more complete text structure
    // In a real app, you would fetch the complete Surah text from an API
    const verses = [];
    for (let i = 1; i <= surah.verses; i++) {
      verses.push({
        verse: i,
        arabic: surah.text && surah.text[i - 1] ? surah.text[i - 1].arabic : `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ - آية ${i}`,
        translation: surah.text && surah.text[i - 1] ? surah.text[i - 1].translation : `Verse ${i} of ${surah.name} - Translation coming soon...`
      });
    }
    return verses;
  };

  const handleSurahClick = (surah) => {
    // Check if another audio is playing
    if (currentAudio && isPlaying && currentAudio !== surah.audio) {
      showError('Another recitation is currently playing. Please stop it first before starting a new one.');
      return;
    }

    setSelectedSurah(surah);
    setShowReading(true);
    setLoading(true);
    
    // Generate full Surah text
    const fullText = generateFullSurahText(surah);
    setFullSurahText(fullText);
    
    showNotification(`Opening ${surah.name} for reading and listening`, 'success');
  };

  const closeReading = () => {
    if (isPlaying) {
      stopAudio();
    }
    setShowReading(false);
    setSelectedSurah(null);
    setFullSurahText(null);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        showNotification('Recitation paused', 'info');
      } else {
        setLoading(true);
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setLoading(false);
          showNotification('Playing beautiful recitation...', 'success');
        }).catch((error) => {
          setLoading(false);
          handleAudioError(error);
        });
      }
    } catch (error) {
      setLoading(false);
      handleAudioError(error);
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

  const handleProgressClick = (e) => {
    if (audioRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleAudioError = (error) => {
    setLoading(false);
    setIsPlaying(false);
    showError(`Unable to load audio. This might be due to network issues or the audio file being unavailable. Please check your internet connection and try again. Error: ${error.message || 'Unknown error'}`);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const filteredSurahs = quranSurahs.filter(surah =>
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.arabic.includes(searchQuery) ||
    surah.english.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedSurah && audioRef.current) {
      setCurrentAudio(selectedSurah.audio);
      audioRef.current.src = selectedSurah.audio;
    }
  }, [selectedSurah]);

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <Container>
        {!showReading ? (
          <>
            {/* Main Quran Page */}
            <Row>
              <Col>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-center mb-4">القرآن الكريم</h1>
                  <p className="text-center mb-5">The Holy Quran - Read, Listen, and Reflect</p>
                </motion.div>
              </Col>
            </Row>

            {/* Search Bar */}
            <Row className="justify-content-center mb-4">
              <Col lg={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="search-container">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search Surahs by name, Arabic, or English..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="search-icon" />
                  </div>
                  <small className="text-muted d-block mt-2 text-center">
                    {filteredSurahs.length} Surahs found
                  </small>
                </motion.div>
              </Col>
            </Row>

            {/* Surahs List */}
            <AnimatePresence>
              {filteredSurahs.length > 0 ? (
                <Row>
                  {filteredSurahs.map((surah, index) => (
                    <Col lg={4} md={6} key={surah.number} className="mb-4">
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <Card 
                          className={`surah-card ${selectedSurah?.number === surah.number ? 'selected' : ''} h-100`}
                          onClick={() => handleSurahClick(surah)}
                        >
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div className="surah-number">
                                {surah.number}
                              </div>
                              {selectedSurah?.number === surah.number && (
                                <FaCheckCircle className="text-success" />
                              )}
                            </div>
                            <h5 className="surah-name">{surah.name}</h5>
                            <p className="surah-arabic">{surah.arabic}</p>
                            <p className="surah-english text-muted">{surah.english}</p>
                            <div className="surah-info">
                              <small className="text-muted">
                                {surah.verses} verses • {surah.type}
                              </small>
                            </div>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-5"
                >
                  <FaExclamationTriangle size={50} className="text-muted mb-3" />
                  <h4>No Surahs Found</h4>
                  <p className="text-muted">Try adjusting your search query</p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <>
            {/* Surah Reading View */}
            <Row>
              <Col>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-4"
                >
                  <Button 
                    variant="outline-primary" 
                    onClick={closeReading}
                    className="mb-3"
                  >
                    <FaArrowLeft className="me-2" />
                    Back to Surahs List
                  </Button>
                  
                  <div className="surah-header">
                    <h1 className="surah-title">
                      {selectedSurah?.name} - {selectedSurah?.arabic}
                    </h1>
                    <p className="surah-subtitle">
                      {selectedSurah?.english} • {selectedSurah?.verses} verses • {selectedSurah?.type}
                    </p>
                  </div>
                </motion.div>
              </Col>
            </Row>

            {/* Full Surah Text */}
            <Row className="mb-5">
              <Col>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="surah-text-card">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h4>
                        <FaBook className="me-2" />
                        Complete Surah Text
                      </h4>
                      {fullSurahText && (
                        <small className="text-muted">
                          {fullSurahText.length} verses
                        </small>
                      )}
                    </Card.Header>
                    <Card.Body className="surah-reading-content">
                      {fullSurahText ? (
                        <div className="verses-container">
                          {fullSurahText.map((verse, index) => (
                            <motion.div
                              key={verse.verse}
                              className="verse-container"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <div className="verse-number">{verse.verse}</div>
                              <div className="verse-arabic">{verse.arabic}</div>
                              <div className="verse-translation">{verse.translation}</div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-5">
                          <p className="text-muted">
                            Loading complete Surah text...
                          </p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </>
        )}

        {/* Enhanced Audio Player - Only show when a Surah is selected for reading */}
        <AnimatePresence>
          {selectedSurah && showReading && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="audio-player-container"
            >
              <Card className="audio-player">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">
                      <FaVolumeUp className="me-2" />
                      Audio Recitation
                    </h5>
                    {isPlaying && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="playing-indicator"
                      >
                        <small className="text-success">
                          Now playing beautiful recitation...
                        </small>
                      </motion.div>
                    )}
                  </div>

                  <div className="audio-controls">
                    <div className="control-buttons">
                      <Button
                        variant="primary"
                        size="lg"
                        className="control-btn me-3"
                        onClick={togglePlayPause}
                        disabled={loading}
                      >
                        {loading ? (
                          <Spinner animation="border" size="sm" />
                        ) : isPlaying ? (
                          <FaPause />
                        ) : (
                          <FaPlay />
                        )}
                      </Button>
                      
                      <Button
                        variant="outline-danger"
                        className="control-btn"
                        onClick={stopAudio}
                      >
                        <FaStop />
                      </Button>
                    </div>

                    <div className="progress-container flex-grow-1 mx-3">
                      <div 
                        className="progress-bar" 
                        onClick={handleProgressClick}
                      >
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: duration ? `${(currentTime / duration) * 100}%` : '0%' 
                          }}
                        />
                      </div>
                      <div className="time-display">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                  </div>

                  <audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onLoadStart={() => setLoading(true)}
                    onCanPlay={() => setLoading(false)}
                    onError={handleAudioError}
                    onEnded={() => {
                      setIsPlaying(false);
                      setCurrentTime(0);
                      showNotification('Recitation completed', 'success');
                    }}
                  />
                </Card.Body>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* Beautiful Error Modal */}
      <Modal show={showErrorModal} onHide={closeErrorModal} centered>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="text-danger">
              <FaExclamationTriangle className="me-2" />
              Audio Error
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <div className="mb-3">
              <FaExclamationTriangle size={50} className="text-warning" />
            </div>
            <p>{errorMessage}</p>
          </Modal.Body>
          <Modal.Footer className="border-0 justify-content-center">
            <Button variant="primary" onClick={closeErrorModal}>
              Understood
            </Button>
          </Modal.Footer>
        </motion.div>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050, top: '100px' }}>
        {notifications.map((notification) => (
          <Toast 
            key={notification.id} 
            show={true} 
            delay={5000} 
            autohide
            bg={notification.type === 'error' ? 'danger' : notification.type === 'success' ? 'success' : notification.type === 'warning' ? 'warning' : 'info'}
          >
            <Toast.Header closeButton={false}>
              <strong className="me-auto">
                {notification.type === 'error' ? 'Error' : 
                 notification.type === 'success' ? 'Success' : 
                 notification.type === 'warning' ? 'Warning' : 'Info'}
              </strong>
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