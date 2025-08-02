import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaPray, FaKaaba, FaStar, FaMoon, FaClock, FaExclamationTriangle, FaMosque, FaCalendarAlt } from 'react-icons/fa';
import { getPrayerTimes } from '../utils/prayerTimes';

const Ibadyat = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        const times = await getPrayerTimes();
        setPrayerTimes(times);
        
        // Determine current prayer
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const prayers = [
          { name: 'Fajr', time: convertToMinutes(times.Fajr) },
          { name: 'Dhuhr', time: convertToMinutes(times.Dhuhr) },
          { name: 'Asr', time: convertToMinutes(times.Asr) },
          { name: 'Maghrib', time: convertToMinutes(times.Maghrib) },
          { name: 'Isha', time: convertToMinutes(times.Isha) }
        ];
        
        let current = prayers[prayers.length - 1];
        for (let i = 0; i < prayers.length; i++) {
          if (currentTime < prayers[i].time) {
            current = i > 0 ? prayers[i - 1] : prayers[prayers.length - 1];
            break;
          }
        }
        setCurrentPrayer(current);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching prayer times:', err);
        setError('Failed to load prayer times. Please try again later.');
        // Set fallback prayer times for major cities
        const fallbackTimes = {
          Fajr: '05:30',
          Dhuhr: '12:15',
          Asr: '15:45',
          Maghrib: '17:30',
          Isha: '19:00'
        };
        setPrayerTimes(fallbackTimes);
      } finally {
        setLoading(false);
      }
    };
    fetchPrayerTimes();
  }, []);

  const convertToMinutes = (timeString) => {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  };

  // Use useMemo or create ibadyatData inside useEffect to ensure it updates when prayerTimes changes
  const getIbadyatData = () => {
    return {
      prayer: {
        title: "Prayer (Salah)",
        icon: FaPray,
        color: "#4a7c59",
        content: {
          description: "Prayer is the second pillar of Islam and the direct link between the worshipper and Allah. It is performed five times a day at specific times.",
          importance: [
            "Five daily prayers are obligatory for every Muslim",
            "Prayer purifies the soul and brings peace to the heart",
            "It is the key to success in this world and the hereafter",
            "Prayer strengthens our connection with Allah",
            "It serves as a reminder of our purpose in life"
          ],
          prayers: prayerTimes ? Object.entries(prayerTimes).filter(([key]) => key !== 'date') : [],
          tips: [
            "Perform Wudu (ablution) before prayer",
            "Face the Qibla (direction of Mecca)",
            "Pray with concentration and humility",
            "Read Quran and make Dua after prayer",
            "Try to pray in congregation when possible"
          ]
        }
      },
      hajj: {
        title: "Hajj",
        icon: FaKaaba,
        color: "#8b4513",
        content: {
          description: "Hajj is the fifth pillar of Islam and a once-in-a-lifetime obligation for those who are physically and financially able.",
          importance: [
            "Pilgrimage to the holy city of Mecca",
            "Performed during the month of Dhul-Hijjah",
            "Purifies the soul and forgives sins",
            "Brings together Muslims from all over the world",
            "Strengthens the bond of Islamic brotherhood"
          ],
          rituals: [
            "Ihram - Sacred state of purity",
            "Tawaf - Circumambulation of Kaaba",
            "Sa'i - Walking between Safa and Marwah",
            "Standing at Arafat",
            "Symbolic stoning of the devil",
            "Sacrifice of an animal",
            "Tawaf al-Ifadah"
          ],
          tips: [
            "Prepare spiritually and physically",
            "Learn about the rituals beforehand",
            "Pack appropriate clothing",
            "Stay hydrated and take care of health",
            "Make sincere supplications"
          ]
        }
      },
      umrah: {
        title: "Umrah",
        icon: FaStar,
        color: "#ff6b35",
        content: {
          description: "Umrah is a pilgrimage to Mecca that can be performed at any time of the year. It is often called the 'lesser pilgrimage'.",
          importance: [
            "Voluntary act of worship with great reward",
            "Can be performed throughout the year",
            "Purifies the soul and brings spiritual peace",
            "Opportunity to visit the holy sites",
            "Preparation for Hajj"
          ],
          rituals: [
            "Ihram - Entering the sacred state",
            "Tawaf - Seven rounds around Kaaba",
            "Sa'i - Walking between Safa and Marwah hills",
            "Cutting or trimming hair (Halq or Taqsir)"
          ],
          tips: [
            "Choose the right time to avoid crowds",
            "Book through licensed travel agents",
            "Learn the supplications (Duas)",
            "Respect the sanctity of the holy places",
            "Take advantage of spiritual opportunities"
          ]
        }
      },
      fasting: {
        title: "Fasting (Sawm)",
        icon: FaMoon,
        color: "#663399",
        content: {
          description: "Fasting during Ramadan is the fourth pillar of Islam, involving abstinence from food, drink, and other physical needs from dawn to sunset.",
          importance: [
            "Develops self-control and discipline",
            "Increases empathy for the less fortunate",
            "Purifies the soul and body",
            "Brings spiritual cleansing and closeness to Allah",
            "Builds community spirit and unity"
          ],
          rules: [
            "Fast from dawn (Fajr) to sunset (Maghrib)",
            "Abstain from food, drink, and marital relations",
            "Avoid negative behaviors and thoughts",
            "Increase prayers and Quran recitation",
            "Give charity (Zakat) and help others"
          ],
          tips: [
            "Have a healthy Suhur (pre-dawn meal)",
            "Break fast with dates and water",
            "Avoid overeating during Iftar",
            "Increase spiritual activities",
            "Be patient and maintain good character"
          ]
        }
      }
    };
  };

  const openModal = (topic) => {
    try {
      setSelectedTopic(topic);
      setShowModal(true);
    } catch (err) {
      console.error('Error opening modal:', err);
      setError('Failed to open details. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTopic(null);
  };

  const ibadyatData = getIbadyatData();

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
              <h1 className="text-center mb-4">العبادات</h1>
              <p className="text-center mb-5">Acts of Worship in Islam</p>
            </motion.div>
          </Col>
        </Row>

        {/* Error Alert */}
        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="warning" dismissible onClose={() => setError(null)}>
                <FaExclamationTriangle className="me-2" />
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Enhanced Prayer Times Section */}
        {prayerTimes && !loading && (
          <Row className="mb-5">
            <Col>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="prayer-times-card">
                  <Card.Header className="prayer-times-header">
                    <FaClock className="me-2" />
                    Today's Prayer Times - Gujranwala, Lahore, Islamabad
                  </Card.Header>
                  <Card.Body>
                    <div className="prayer-times-grid">
                      {Object.entries(prayerTimes).map(([prayer, time]) => {
                        if (prayer === 'date') return null;
                        const isCurrent = currentPrayer && currentPrayer.name === prayer;
                        return (
                          <div key={prayer} className={`prayer-time-item ${isCurrent ? 'current-prayer' : ''}`}>
                            <div className="prayer-icon">
                              <FaMosque />
                            </div>
                            <div className="prayer-info">
                              <h5>{prayer}</h5>
                              <h4>{time}</h4>
                              {isCurrent && <span className="current-badge">Current</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="prayer-location-info">
                      <small className="text-muted">
                        <FaCalendarAlt className="me-1" />
                        Times calculated for Gujranwala, Pakistan (University of Islamic Sciences, Karachi method)
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        )}

        {/* Enhanced Ibadyat Cards Grid */}
        <Row className="ibadyat-grid">
          {Object.entries(ibadyatData).map(([key, item], index) => {
            const IconComponent = item.icon;
            return (
              <Col key={key} lg={6} md={6} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="ibadyat-card"
                    onClick={() => openModal(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="ibadyat-icon-container">
                      <IconComponent 
                        className="ibadyat-icon" 
                        style={{ color: item.color }}
                      />
                    </div>
                    <div className="ibadyat-content">
                      <h4>{item.title}</h4>
                      <p>Click to learn more about this act of worship</p>
                    </div>
                  </div>
                </motion.div>
              </Col>
            );
          })}
        </Row>

        {/* Loading state */}
        {loading && (
          <Row className="mt-5">
            <Col className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading prayer times...</span>
              </div>
              <p className="mt-2">Loading prayer times...</p>
            </Col>
          </Row>
        )}
      </Container>

      {/* Enhanced Modal for detailed information */}
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        {selectedTopic && (
          <>
            <Modal.Header closeButton className="modal-header-custom">
              <Modal.Title>
                {React.createElement(selectedTopic.icon, { 
                  className: "me-2", 
                  style: { color: selectedTopic.color } 
                })}
                {selectedTopic.title}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
              <div className="mb-4">
                <h5>Description</h5>
                <p>{selectedTopic.content.description}</p>
              </div>

              <div className="mb-4">
                <h5>Importance</h5>
                <ul>
                  {selectedTopic.content.importance.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {selectedTopic.content.prayers && selectedTopic.content.prayers.length > 0 && (
                <div className="mb-4">
                  <h5>Prayer Times</h5>
                  <Row>
                    {selectedTopic.content.prayers.map(([prayer, time]) => (
                      <Col md={6} key={prayer} className="mb-2">
                        <div className="prayer-time-display">
                          <strong>{prayer}:</strong> <span className="time-badge">{time}</span>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {selectedTopic.content.rituals && (
                <div className="mb-4">
                  <h5>Rituals</h5>
                  <ul>
                    {selectedTopic.content.rituals.map((ritual, index) => (
                      <li key={index}>{ritual}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTopic.content.rules && (
                <div className="mb-4">
                  <h5>Rules and Guidelines</h5>
                  <ul>
                    {selectedTopic.content.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTopic.content.tips && (
                <div className="mb-4">
                  <h5>Tips and Recommendations</h5>
                  <ul>
                    {selectedTopic.content.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer className="modal-footer-custom">
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Ibadyat;