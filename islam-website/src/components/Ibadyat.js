import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaMosque, 
  FaPray, 
  FaHands, 
  FaStar, 
  FaBook, 
  FaHeart, 
  FaClock, 
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSun,
  FaMoon,
  FaCloud,
  FaCloudSun,
  FaCloudMoon
} from 'react-icons/fa';
import { getPrayerTimes } from '../utils/prayerTimes';

const Ibadyat = () => {
  const [prayerTimes, setPrayerTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedIbadyat, setSelectedIbadyat] = useState(null);

  const convertToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getCurrentPrayer = (times) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
      { name: 'Fajr', time: convertToMinutes(times.Fajr), icon: FaSun },
      { name: 'Dhuhr', time: convertToMinutes(times.Dhuhr), icon: FaCloudSun },
      { name: 'Asr', time: convertToMinutes(times.Asr), icon: FaCloud },
      { name: 'Maghrib', time: convertToMinutes(times.Maghrib), icon: FaMoon },
      { name: 'Isha', time: convertToMinutes(times.Isha), icon: FaCloudMoon }
    ];

    let current = prayers[prayers.length - 1];
    let next = prayers[0];

    for (let i = 0; i < prayers.length; i++) {
      if (currentTime < prayers[i].time) {
        current = i > 0 ? prayers[i - 1] : prayers[prayers.length - 1];
        next = prayers[i];
        break;
      }
    }

    return { current, next };
  };

  const formatTimeUntil = (nextPrayer) => {
    const now = new Date();
    const nextTime = new Date();
    const [hours, minutes] = nextPrayer.time.split(':').map(Number);
    nextTime.setHours(hours, minutes, 0, 0);
    
    if (nextTime <= now) {
      nextTime.setDate(nextTime.getDate() + 1);
    }
    
    const diff = nextTime - now;
    const hoursUntil = Math.floor(diff / (1000 * 60 * 60));
    const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursUntil > 0) {
      return `${hoursUntil}h ${minutesUntil}m`;
    } else {
      return `${minutesUntil}m`;
    }
  };

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        const times = await getPrayerTimes();
        setPrayerTimes(times);

        const { current, next } = getCurrentPrayer(times);
        setCurrentPrayer(current);
        setNextPrayer(next);

        setError(null);
      } catch (err) {
        console.error('Error fetching prayer times:', err);
        setError('Failed to load prayer times. Please try again later.');
        const fallbackTimes = {
          Fajr: '05:30',
          Dhuhr: '12:15',
          Asr: '15:45',
          Maghrib: '17:30',
          Isha: '19:00'
        };
        setPrayerTimes(fallbackTimes);
        const { current, next } = getCurrentPrayer(fallbackTimes);
        setCurrentPrayer(current);
        setNextPrayer(next);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
    
    // Update time until next prayer every minute
    const interval = setInterval(() => {
      if (nextPrayer) {
        setTimeUntilNext(formatTimeUntil(nextPrayer));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [nextPrayer]);

  useEffect(() => {
    if (nextPrayer) {
      setTimeUntilNext(formatTimeUntil(nextPrayer));
    }
  }, [nextPrayer]);

  const ibadyatData = [
    {
      id: 1,
      title: 'Salah (Prayer)',
      description: 'The five daily prayers are the foundation of Islamic worship',
      icon: FaPray,
      color: '#4CAF50',
      details: {
        fajr: 'Dawn prayer - 2 rak\'ahs',
        dhuhr: 'Noon prayer - 4 rak\'ahs',
        asr: 'Afternoon prayer - 4 rak\'ahs',
        maghrib: 'Sunset prayer - 3 rak\'ahs',
        isha: 'Night prayer - 4 rak\'ahs'
      }
    },
    {
      id: 2,
      title: 'Du\'a (Supplication)',
      description: 'Personal prayers and supplications to Allah',
      icon: FaHands,
      color: '#2196F3',
      details: {
        morning: 'Morning supplications',
        evening: 'Evening supplications',
        beforeMeal: 'Before eating',
        afterMeal: 'After eating',
        enteringHome: 'When entering home',
        leavingHome: 'When leaving home'
      }
    },
    {
      id: 3,
      title: 'Dhikr (Remembrance)',
      description: 'Remembrance of Allah through various forms',
      icon: FaHeart,
      color: '#9C27B0',
      details: {
        subhanallah: 'Glory be to Allah - 33 times',
        alhamdulillah: 'Praise be to Allah - 33 times',
        allahuAkbar: 'Allah is the Greatest - 33 times',
        laIlaahaIllallah: 'There is no god but Allah - 100 times'
      }
    },
    {
      id: 4,
      title: 'Tasbih (Prayer Beads)',
      description: 'Counting dhikr with prayer beads',
      icon: FaStar,
      color: '#FF9800',
      details: {
        morning: 'Morning tasbih - 100 times',
        evening: 'Evening tasbih - 100 times',
        afterPrayer: 'After each prayer',
        special: 'Special occasions and needs'
      }
    },
    {
      id: 5,
      title: 'Quran Recitation',
      description: 'Reading and memorizing the Holy Quran',
      icon: FaBook,
      color: '#E91E63',
      details: {
        daily: 'Daily recitation - minimum 1 juz',
        memorization: 'Memorization of verses',
        tafsir: 'Understanding and interpretation',
        reflection: 'Deep reflection on meanings'
      }
    },
    {
      id: 6,
      title: 'Sadaqah (Charity)',
      description: 'Giving charity and helping others',
      icon: FaHeart,
      color: '#00BCD4',
      details: {
        daily: 'Daily charity - even a smile',
        monthly: 'Monthly contributions',
        special: 'Special occasions',
        emergency: 'Emergency relief'
      }
    }
  ];

  const handleIbadyatClick = (ibadyat) => {
    setSelectedIbadyat(ibadyat);
    setShowModal(true);
  };

  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Row className="mb-5">
          <Col>
            <h1 className="text-center mb-4">
              <FaMosque className="me-3" style={{ color: 'var(--primary-color)' }} />
              Islamic Acts of Worship
            </h1>
            <p className="text-center text-muted lead">
              Discover and practice the various forms of Islamic worship and devotion
            </p>
          </Col>
        </Row>

        {/* Enhanced Prayer Times Card */}
        <Row className="mb-5">
          <Col>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="prayer-times-card">
                <Card.Header className="prayer-times-header">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <FaClock className="me-2" />
                      <span>Prayer Times - Gujranwala</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <FaMapMarkerAlt className="me-2" />
                      <small>Location: Gujranwala, Pakistan</small>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading prayer times...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-4">
                      <p className="text-danger">{error}</p>
                    </div>
                  ) : (
                    <div className="prayer-times-grid">
                      {Object.entries(prayerTimes).map(([prayer, time]) => {
                        const isCurrent = currentPrayer?.name === prayer;
                        const IconComponent = currentPrayer?.icon || FaClock;
                        
                        return (
                          <motion.div
                            key={prayer}
                            className={`prayer-time-item ${isCurrent ? 'current-prayer' : ''}`}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="prayer-icon">
                              <IconComponent />
                            </div>
                            <div className="prayer-info">
                              <h5>{prayer}</h5>
                              <h4>{time}</h4>
                              {isCurrent && (
                                <span className="current-badge">
                                  Current Prayer
                                </span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                  
                  {nextPrayer && (
                    <div className="prayer-location-info">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        <FaClock className="me-2" />
                        <strong>Next Prayer: {nextPrayer.name}</strong>
                      </div>
                      <div className="d-flex align-items-center justify-content-center">
                        <small className="text-muted">
                          Time until {nextPrayer.name}: {timeUntilNext}
                        </small>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Enhanced Ibadyat Grid */}
        <Row className="ibadyat-grid">
          {ibadyatData.map((ibadyat, index) => (
            <Col lg={6} md={6} key={ibadyat.id} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="ibadyat-card"
                  onClick={() => handleIbadyatClick(ibadyat)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="text-center">
                    <div className="ibadyat-icon-container">
                      <ibadyat.icon 
                        className="ibadyat-icon"
                        style={{ color: ibadyat.color }}
                      />
                    </div>
                    <div className="ibadyat-content">
                      <h4>{ibadyat.title}</h4>
                      <p>{ibadyat.description}</p>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Enhanced Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        size="lg"
        className="modal-custom"
      >
        <Modal.Header className="modal-header-custom">
          <Modal.Title>
            {selectedIbadyat && (
              <div className="d-flex align-items-center">
                <selectedIbadyat.icon 
                  className="me-3" 
                  style={{ color: selectedIbadyat.color }}
                />
                {selectedIbadyat.title}
              </div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          {selectedIbadyat && (
            <div>
              <p className="lead mb-4">{selectedIbadyat.description}</p>
              <div className="row">
                {Object.entries(selectedIbadyat.details).map(([key, value]) => (
                  <div key={key} className="col-md-6 mb-3">
                    <Card className="detail-card">
                      <Card.Body>
                        <h6 className="text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</h6>
                        <p className="mb-0">{value}</p>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary"
            onClick={() => setShowModal(false)}
          >
            Learn More
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Ibadyat;