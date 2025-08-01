import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaHeart, FaStar, FaSearch } from 'react-icons/fa';

const NamesOfAllah = () => {
  const [selectedName, setSelectedName] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const namesOfAllah = [
    { number: 1, arabic: "الرَّحْمَٰنُ", transliteration: "Ar-Rahman", meaning: "The Most Gracious", description: "The One who has mercy on the believers and the unbelievers in this world and only on the believers in the hereafter." },
    { number: 2, arabic: "الرَّحِيمُ", transliteration: "Ar-Raheem", meaning: "The Most Merciful", description: "The One who has mercy on the believers." },
    { number: 3, arabic: "الْمَلِكُ", transliteration: "Al-Malik", meaning: "The King", description: "The One with the complete dominion, the One Whose dominion is clear from imperfection." },
    { number: 4, arabic: "الْقُدُّوسُ", transliteration: "Al-Quddus", meaning: "The Most Holy", description: "The One who is pure from any imperfection and clear from children and adversaries." },
    { number: 5, arabic: "السَّلَامُ", transliteration: "As-Salam", meaning: "The Source of Peace", description: "The One who is free from every imperfection." },
    { number: 6, arabic: "الْمُؤْمِنُ", transliteration: "Al-Mu'min", meaning: "The Guardian of Faith", description: "The One who witnessed for Himself that no one is God but Him." },
    { number: 7, arabic: "الْمُهَيْمِنُ", transliteration: "Al-Muhaymin", meaning: "The Protector", description: "The One who witnesses the saying and deeds of His creatures." },
    { number: 8, arabic: "الْعَزِيزُ", transliteration: "Al-Aziz", meaning: "The Almighty", description: "The Defeater who is not defeated." },
    { number: 9, arabic: "الْجَبَّارُ", transliteration: "Al-Jabbar", meaning: "The Compeller", description: "The One that nothing happens in His dominion except that which He willed." },
    { number: 10, arabic: "الْمُتَكَبِّرُ", transliteration: "Al-Mutakabbir", meaning: "The Majestic", description: "The One who is clear from the attributes of the creatures and from resembling them." }
  ];

  const filteredNames = namesOfAllah.filter(name =>
    name.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
    name.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    name.arabic.includes(searchQuery)
  );

  const openModal = (name) => {
    setSelectedName(name);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedName(null);
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
                <FaStar className="me-3" />
                99 Names of Allah
              </h1>
              <p className="text-center mb-5">The beautiful names and attributes of Allah (SWT)</p>
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
                  placeholder="Search names by transliteration, meaning, or Arabic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
            </motion.div>
          </Col>
        </Row>

        {/* Names Grid */}
        <Row>
          {filteredNames.map((name, index) => (
            <Col lg={6} md={6} key={name.number} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card 
                  className="name-card h-100"
                  onClick={() => openModal(name)}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="name-number">
                        <span className="badge bg-primary fs-6">{name.number}</span>
                      </div>
                      <FaHeart className="text-danger" />
                    </div>
                    <h5 className="name-transliteration">{name.transliteration}</h5>
                    <p className="name-arabic text-end mb-3">{name.arabic}</p>
                    <p className="name-meaning text-muted">{name.meaning}</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Name Modal */}
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaStar className="me-2" />
            {selectedName?.transliteration}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedName && (
            <div>
              <div className="text-center mb-4">
                <span className="badge bg-primary fs-6">#{selectedName.number}</span>
              </div>
              <div className="name-modal-arabic text-center mb-4">
                <h3>{selectedName.arabic}</h3>
              </div>
              <div className="name-modal-details">
                <h6>Transliteration:</h6>
                <p className="mb-3">{selectedName.transliteration}</p>
                <h6>Meaning:</h6>
                <p className="mb-3">{selectedName.meaning}</p>
                <h6>Description:</h6>
                <p>{selectedName.description}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary">
            <FaHeart className="me-2" />
            Add to Favorites
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NamesOfAllah;