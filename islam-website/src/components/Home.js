import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaSearch, FaClock, FaPlay, FaHeart, FaDonate } from 'react-icons/fa';
import { getPrayerTimes, getCurrentPrayer, formatTimeRemaining } from '../utils/prayerTimes';
import { quranVerse, islamicVideos } from '../data/quranData';

const Home = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentPrayerInfo, setCurrentPrayerInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrayerData = async () => {
      try {
        const times = await getPrayerTimes();
        setPrayerTimes(times);
        setCurrentPrayerInfo(getCurrentPrayer(times));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        setLoading(false);
      }
    };

    fetchPrayerData();

    // Update current prayer info every minute
    const interval = setInterval(() => {
      if (prayerTimes) {
        setCurrentPrayerInfo(getCurrentPrayer(prayerTimes));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const openVideo = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero Section with Animated Background */}
      <section className="hero-section">
        <div className="animated-bg"></div>
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <motion.div 
                className="hero-content"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <h1>أهلاً وسهلاً</h1>
                <p>Welcome to your spiritual journey</p>
                
                {/* Prayer Time Display */}
                {currentPrayerInfo && (
                  <motion.div 
                    className="prayer-time-card current-prayer"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h4>
                      <FaClock className="me-2" />
                      Next Prayer: {currentPrayerInfo.next.name}
                    </h4>
                    <p className="mb-0">
                      Time Remaining: {formatTimeRemaining(currentPrayerInfo.timeRemaining)}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        {/* Search Bar */}
        <Row className="justify-content-center mb-5">
          <Col lg={8}>
            <motion.div 
              className="search-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search for Surahs, Duas, Islamic content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  <FaSearch />
                </button>
              </form>
            </motion.div>
          </Col>
        </Row>

        {/* Prayer Times Card */}
        {prayerTimes && (
          <Row className="mb-5">
            <Col>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Card className="card-custom">
                  <Card.Header className="card-header-custom">
                    <FaClock className="me-2" />
                    Prayer Times - Gujranwala
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      {Object.entries(prayerTimes).map(([prayer, time]) => {
                        if (prayer === 'date') return null;
                        const isCurrent = currentPrayerInfo?.current?.name === prayer;
                        const isNext = currentPrayerInfo?.next?.name === prayer;
                        
                        return (
                          <Col md={4} lg={2} key={prayer} className="mb-3">
                            <div className={`prayer-time-card ${isCurrent ? 'current-prayer' : ''} ${isNext ? 'border border-warning' : ''}`}>
                              <h6 className="mb-1">{prayer}</h6>
                              <h5 className="mb-0">{time}</h5>
                            </div>
                          </Col>
                        );
                      })}
                    </Row>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        )}

        {/* Quran Verse */}
        <Row className="mb-5">
          <Col>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <div className="verse-card">
                <div className="verse-arabic">{quranVerse.arabic}</div>
                <div className="verse-translation">"{quranVerse.translation}"</div>
                <div className="verse-reference">- {quranVerse.reference}</div>
              </div>
            </motion.div>
          </Col>
        </Row>

        {/* Islamic Videos */}
        <Row className="mb-5">
          <Col>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <h2 className="text-center mb-4">Islamic Content</h2>
              <Row>
                {islamicVideos.map((video, index) => (
                  <Col md={4} key={video.id} className="mb-4">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 + index * 0.2 }}
                    >
                      <Card className="video-card h-100">
                        <div className="position-relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="video-thumbnail"
                          />
                          <Button
                            variant="primary"
                            className="position-absolute top-50 start-50 translate-middle"
                            style={{ borderRadius: '50%', width: '60px', height: '60px' }}
                            onClick={() => openVideo(video.url)}
                          >
                            <FaPlay />
                          </Button>
                        </div>
                        <Card.Body>
                          <Card.Title>{video.title}</Card.Title>
                          <Card.Text>{video.description}</Card.Text>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </motion.div>
          </Col>
        </Row>

        {/* Support Section */}
        <Row>
          <Col>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="support-section">
                <Container>
                  <Row className="justify-content-center">
                    <Col lg={8} className="text-center">
                      <FaHeart className="mb-3" style={{ fontSize: '3rem' }} />
                      <h2>Support Our Mission</h2>
                      <p className="mb-4">
                        "الصدقة تطفئ الخطيئة كما يطفئ الماء النار"
                        <br />
                        "Charity extinguishes sin as water extinguishes fire"
                        <br />
                        Help us spread Islamic knowledge and build a stronger Muslim community.
                      </p>
                      <Button className="donation-btn" size="lg">
                        <FaDonate className="me-2" />
                        Support Us
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;