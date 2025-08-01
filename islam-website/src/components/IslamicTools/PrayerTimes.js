import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaClock, FaMapMarkerAlt, FaBell, FaSun, FaMoon } from 'react-icons/fa';
import { getPrayerTimes } from '../../utils/prayerTimes';

const PrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        const times = await getPrayerTimes();
        setPrayerTimes(times);
        setError(null);
      } catch (err) {
        console.error('Error fetching prayer times:', err);
        setError('Failed to load prayer times. Please try again later.');
        // Set fallback prayer times
        setPrayerTimes({
          Fajr: '05:30',
          Dhuhr: '12:15',
          Asr: '15:45',
          Maghrib: '18:30',
          Isha: '20:00'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();

    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (prayerTimes) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      const prayerTimesInMinutes = {
        Fajr: convertTimeToMinutes(prayerTimes.Fajr),
        Dhuhr: convertTimeToMinutes(prayerTimes.Dhuhr),
        Asr: convertTimeToMinutes(prayerTimes.Asr),
        Maghrib: convertTimeToMinutes(prayerTimes.Maghrib),
        Isha: convertTimeToMinutes(prayerTimes.Isha)
      };

      let nextPrayer = null;
      let minDiff = Infinity;

      Object.entries(prayerTimesInMinutes).forEach(([prayer, time]) => {
        const diff = time - currentTimeInMinutes;
        if (diff > 0 && diff < minDiff) {
          minDiff = diff;
          nextPrayer = prayer;
        }
      });

      setCurrentPrayer(nextPrayer);
    }
  }, [prayerTimes, currentTime]);

  const convertTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTimeRemaining = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTimeRemaining = (prayerTime) => {
    const now = new Date();
    const [hours, minutes] = prayerTime.split(':').map(Number);
    const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    if (prayerDate < now) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }
    
    const diffMs = prayerDate - now;
    return Math.floor(diffMs / (1000 * 60));
  };

  const prayerIcons = {
    Fajr: FaSun,
    Dhuhr: FaSun,
    Asr: FaSun,
    Maghrib: FaMoon,
    Isha: FaMoon
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <Container>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading prayer times...</p>
          </div>
        </Container>
      </div>
    );
  }

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
                <FaClock className="me-3" />
                Prayer Times
              </h1>
              <p className="text-center mb-5">Daily prayer times for your location</p>
            </motion.div>
          </Col>
        </Row>

        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="warning">
                <FaMapMarkerAlt className="me-2" />
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {prayerTimes && (
          <Row>
            {Object.entries(prayerTimes).filter(([key]) => key !== 'date').map(([prayer, time], index) => {
              const IconComponent = prayerIcons[prayer];
              const isCurrentPrayer = currentPrayer === prayer;
              const timeRemaining = getTimeRemaining(time);
              
              return (
                <Col lg={4} md={6} key={prayer} className="mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className={`prayer-time-card ${isCurrentPrayer ? 'current-prayer' : ''}`}>
                      <Card.Body className="text-center">
                        <div className="prayer-icon mb-3">
                          <IconComponent size={30} className={isCurrentPrayer ? 'text-warning' : 'text-primary'} />
                        </div>
                        <h4 className="prayer-name">{prayer}</h4>
                        <h2 className="prayer-time">{time}</h2>
                        {isCurrentPrayer && (
                          <div className="current-prayer-badge">
                            <span className="badge bg-warning text-dark">
                              <FaBell className="me-1" />
                              Next Prayer
                            </span>
                          </div>
                        )}
                        <p className="time-remaining text-muted">
                          {timeRemaining > 0 ? `${formatTimeRemaining(timeRemaining)} remaining` : 'Time to pray'}
                        </p>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              );
            })}
          </Row>
        )}

        <Row className="mt-5">
          <Col>
            <h3 className="text-center mb-4">Prayer Times Information</h3>
            <Row>
              <Col md={6}>
                <Card className="info-card h-100">
                  <Card.Body>
                    <h5><FaSun className="me-2" />Fajr</h5>
                    <p>The dawn prayer, performed before sunrise. It marks the beginning of the Islamic day.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="info-card h-100">
                  <Card.Body>
                    <h5><FaSun className="me-2" />Dhuhr</h5>
                    <p>The noon prayer, performed when the sun has passed its zenith and begins to decline.</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}>
                <Card className="info-card h-100">
                  <Card.Body>
                    <h5><FaSun className="me-2" />Asr</h5>
                    <p>The afternoon prayer, performed in the late afternoon before sunset.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="info-card h-100">
                  <Card.Body>
                    <h5><FaMoon className="me-2" />Maghrib</h5>
                    <p>The sunset prayer, performed immediately after the sun sets.</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <Card className="info-card">
                  <Card.Body>
                    <h5><FaMoon className="me-2" />Isha</h5>
                    <p>The night prayer, performed after the twilight has disappeared and before midnight.</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrayerTimes;