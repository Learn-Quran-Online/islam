import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaPray, FaKaaba, FaStar, FaMoon, FaClock } from 'react-icons/fa';
import { getPrayerTimes } from '../utils/prayerTimes';

const Ibadyat = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      const times = await getPrayerTimes();
      setPrayerTimes(times);
    };
    fetchPrayerTimes();
  }, []);

  const ibadyatData = {
    prayer: {
      title: "Prayer (Salah)",
      icon: FaPray,
      color: "#4a7c59",
      content: {
        description: "Prayer is the second pillar of Islam and the direct link between the worshipper and Allah.",
        importance: [
          "Five daily prayers are obligatory for every Muslim",
          "Prayer purifies the soul and brings peace to the heart",
          "It is the key to success in this world and the hereafter",
          "Prayer strengthens our connection with Allah"
        ],
        prayers: prayerTimes ? Object.entries(prayerTimes).filter(([key]) => key !== 'date') : [],
        tips: [
          "Perform Wudu (ablution) before prayer",
          "Face the Qibla (direction of Mecca)",
          "Pray with concentration and humility",
          "Read Quran and make Dua after prayer"
        ]
      }
    },
    hajj: {
      title: "Hajj",
      icon: FaKaaba,
      color: "#8b4513",
      content: {
        description: "Hajj is the fifth pillar of Islam and a once-in-a-lifetime obligation for those who are able.",
        importance: [
          "Pilgrimage to the holy city of Mecca",
          "Performed during the month of Dhul-Hijjah",
          "One of the greatest acts of worship in Islam",
          "Brings spiritual purification and forgiveness"
        ],
        rituals: [
          "Ihram - Entering the sacred state",
          "Tawaf - Circumambulation of the Kaaba",
          "Sa'i - Walking between Safa and Marwah",
          "Wuquf - Standing at Arafat",
          "Stoning of the Devil at Mina",
          "Sacrifice and celebration of Eid al-Adha"
        ],
        benefits: [
          "Sins are forgiven",
          "Spiritual rebirth and renewal",
          "Unity with Muslims worldwide",
          "Life-changing experience"
        ]
      }
    },
    umrah: {
      title: "Umrah",
      icon: FaStar,
      color: "#ffc107",
      content: {
        description: "Umrah is a pilgrimage to Mecca that can be undertaken at any time of the year.",
        importance: [
          "Known as the 'lesser pilgrimage'",
          "Can be performed throughout the year",
          "Highly recommended act of worship",
          "Brings great spiritual rewards"
        ],
        rituals: [
          "Ihram - Entering the sacred state",
          "Tawaf - Seven circuits around the Kaaba",
          "Sa'i - Walking between Safa and Marwah hills",
          "Cutting or shaving hair (Halq/Taqsir)"
        ],
        benefits: [
          "Spiritual cleansing and purification",
          "Increased faith and devotion",
          "Blessed experience in the holy city",
          "Preparation for Hajj"
        ]
      }
    },
    fasting: {
      title: "Fasting (Sawm)",
      icon: FaMoon,
      color: "#6f42c1",
      content: {
        description: "Fasting during Ramadan is the fourth pillar of Islam, observed from dawn to sunset.",
        importance: [
          "Obligatory during the month of Ramadan",
          "Develops self-control and discipline",
          "Increases empathy for the less fortunate",
          "Spiritual purification and devotion"
        ],
        rules: [
          "Abstain from food, drink, and marital relations",
          "Fast from Fajr (dawn) to Maghrib (sunset)",
          "Maintain good character and avoid sins",
          "Increase worship, charity, and Quran recitation"
        ],
        benefits: [
          "Spiritual growth and self-discipline",
          "Increased awareness of Allah",
          "Community unity and solidarity",
          "Health benefits and detoxification",
          "Increased charity and compassion"
        ]
      }
    }
  };

  const openModal = (topic) => {
    setSelectedTopic(topic);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTopic(null);
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
              <h1 className="text-center mb-4">العبادات</h1>
              <p className="text-center mb-5">Acts of Worship in Islam</p>
            </motion.div>
          </Col>
        </Row>

        {/* Ibadyat Cards Grid */}
        <Row className="ibadyat-grid">
          {Object.entries(ibadyatData).map(([key, item], index) => {
            const IconComponent = item.icon;
            return (
              <Col key={key}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div 
                    className="ibadyat-card"
                    onClick={() => openModal(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <IconComponent 
                      className="ibadyat-icon" 
                      style={{ color: item.color }}
                    />
                    <h3>{item.title}</h3>
                    <p>{item.content.description}</p>
                    <Button 
                      variant="outline-primary" 
                      className="mt-3"
                    >
                      Learn More
                    </Button>
                  </div>
                </motion.div>
              </Col>
            );
          })}
        </Row>

        {/* Prayer Times Section */}
        {prayerTimes && (
          <Row className="mt-5">
            <Col>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="card-custom">
                  <Card.Header className="card-header-custom">
                    <FaClock className="me-2" />
                    Today's Prayer Times - Gujranwala
                  </Card.Header>
                  <Card.Body>
                    <div className="prayer-times-grid">
                      {Object.entries(prayerTimes).map(([prayer, time]) => {
                        if (prayer === 'date') return null;
                        return (
                          <div key={prayer} className="prayer-time-item">
                            <h5>{prayer}</h5>
                            <h4>{time}</h4>
                          </div>
                        );
                      })}
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        )}
      </Container>

      {/* Modal for detailed information */}
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        {selectedTopic && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                {React.createElement(selectedTopic.icon, { 
                  className: "me-2", 
                  style: { color: selectedTopic.color } 
                })}
                {selectedTopic.title}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
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

              {selectedTopic.content.prayers && (
                <div className="mb-4">
                  <h5>Prayer Times</h5>
                  <Row>
                    {selectedTopic.content.prayers.map(([prayer, time]) => (
                      <Col md={6} key={prayer} className="mb-2">
                        <strong>{prayer}:</strong> {time}
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
                  <h5>Tips for Better Prayer</h5>
                  <ul>
                    {selectedTopic.content.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-4">
                <h5>Benefits</h5>
                <ul>
                  {selectedTopic.content.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </Modal.Body>
            <Modal.Footer>
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