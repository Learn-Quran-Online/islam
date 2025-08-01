import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaSearch, FaPlay, FaPause, FaStop, FaVolumeUp } from 'react-icons/fa';
import { quranSurahs } from '../data/quranData';

const Quran = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSurahs, setFilteredSurahs] = useState(quranSurahs);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const filtered = quranSurahs.filter(surah =>
      surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.arabic.includes(searchQuery)
    );
    setFilteredSurahs(filtered);
  }, [searchQuery]);

  const handleSurahClick = (surah) => {
    setSelectedSurah(surah);
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.src = surah.audio;
      audioRef.current.load();
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
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
    }
  };

  const handleProgressClick = (e) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickX = e.clientX - progressBar.offsetLeft;
      const width = progressBar.offsetWidth;
      const newTime = (clickX / width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
              <p className="text-center mb-5">The Holy Quran</p>
            </motion.div>
          </Col>
        </Row>

        {/* Search Bar */}
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
            </motion.div>
          </Col>
        </Row>

        {/* Audio Player */}
        {selectedSurah && (
          <Row className="mb-5">
            <Col>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="audio-player">
                  <h4 className="mb-3">
                    <FaVolumeUp className="me-2" />
                    Playing: {selectedSurah.arabic} - {selectedSurah.english}
                  </h4>
                  
                  <div className="audio-controls">
                    <Button 
                      className="control-btn me-2"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </Button>
                    
                    <Button 
                      className="control-btn me-3"
                      onClick={stopAudio}
                    >
                      <FaStop />
                    </Button>
                    
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
                  
                  <audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                  />
                </div>
              </motion.div>
            </Col>
          </Row>
        )}

        {/* Surah List */}
        <Row>
          <Col>
            <div className="surah-list">
              {filteredSurahs.map((surah, index) => (
                <motion.div
                  key={surah.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="surah-card"
                  onClick={() => handleSurahClick(surah)}
                >
                  <div className="surah-number">{surah.number}</div>
                  <div className="surah-arabic">{surah.arabic}</div>
                  <div className="surah-english">{surah.name}</div>
                  <div className="surah-info">
                    {surah.english} • {surah.verses} verses • {surah.type}
                  </div>
                  {selectedSurah?.number === surah.number && (
                    <div className="mt-2">
                      <small className="text-primary">
                        {isPlaying ? 'Now Playing...' : 'Selected'}
                      </small>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Col>
        </Row>

        {filteredSurahs.length === 0 && (
          <Row>
            <Col className="text-center">
              <p>No Surahs found matching your search.</p>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Quran;