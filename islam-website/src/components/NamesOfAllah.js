import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaHeart, 
  FaStar, 
  FaBookmark, 
  FaShare, 
  FaSearch, 
  FaFilter,
  FaLightbulb,
  FaPray,
  FaMosque,
  FaCrown,
  FaGem
} from 'react-icons/fa';

const NamesOfAllah = () => {
  const [selectedName, setSelectedName] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNames, setFilteredNames] = useState(namesOfAllah);
  const [favorites, setFavorites] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('all');

  const namesOfAllah = [
    {
      id: 1,
      arabic: 'الرَّحْمَنُ',
      transliteration: 'Ar-Rahman',
      english: 'The Most Gracious',
      meaning: 'The Most Gracious, The Most Merciful',
      category: 'mercy',
      description: 'The One who is most merciful and compassionate to all creation.',
      benefits: 'Reciting this name brings mercy and compassion into your life.',
      count: 'Recite 100 times daily for Allah\'s mercy'
    },
    {
      id: 2,
      arabic: 'الرَّحِيمُ',
      transliteration: 'Ar-Raheem',
      english: 'The Most Merciful',
      meaning: 'The Most Merciful, The Most Compassionate',
      category: 'mercy',
      description: 'The One who shows mercy and compassion to believers.',
      benefits: 'Reciting this name increases your faith and brings peace.',
      count: 'Recite 100 times daily for inner peace'
    },
    {
      id: 3,
      arabic: 'الْمَلِكُ',
      transliteration: 'Al-Malik',
      english: 'The King',
      meaning: 'The King, The Sovereign',
      category: 'power',
      description: 'The One who is the absolute ruler and master of all.',
      benefits: 'Reciting this name brings respect and authority.',
      count: 'Recite 100 times daily for respect'
    },
    {
      id: 4,
      arabic: 'الْقُدُّوسُ',
      transliteration: 'Al-Quddus',
      english: 'The Most Holy',
      meaning: 'The Most Holy, The Most Pure',
      category: 'purity',
      description: 'The One who is free from all defects and imperfections.',
      benefits: 'Reciting this name purifies your heart and soul.',
      count: 'Recite 100 times daily for purification'
    },
    {
      id: 5,
      arabic: 'السَّلَامُ',
      transliteration: 'As-Salam',
      english: 'The Source of Peace',
      meaning: 'The Source of Peace, The Peace',
      category: 'peace',
      description: 'The One who is the source of all peace and safety.',
      benefits: 'Reciting this name brings peace and tranquility.',
      count: 'Recite 100 times daily for peace'
    },
    {
      id: 6,
      arabic: 'الْمُؤْمِنُ',
      transliteration: 'Al-Mu\'min',
      english: 'The Guardian of Faith',
      meaning: 'The Guardian of Faith, The Protector',
      category: 'protection',
      description: 'The One who gives security and faith to believers.',
      benefits: 'Reciting this name strengthens your faith.',
      count: 'Recite 100 times daily for faith'
    },
    {
      id: 7,
      arabic: 'الْمُهَيْمِنُ',
      transliteration: 'Al-Muhaymin',
      english: 'The Protector',
      meaning: 'The Protector, The Guardian',
      category: 'protection',
      description: 'The One who watches over and protects all creation.',
      benefits: 'Reciting this name brings protection and security.',
      count: 'Recite 100 times daily for protection'
    },
    {
      id: 8,
      arabic: 'الْعَزِيزُ',
      transliteration: 'Al-Aziz',
      english: 'The Almighty',
      meaning: 'The Almighty, The Most Powerful',
      category: 'power',
      description: 'The One who is most powerful and invincible.',
      benefits: 'Reciting this name brings strength and power.',
      count: 'Recite 100 times daily for strength'
    },
    {
      id: 9,
      arabic: 'الْجَبَّارُ',
      transliteration: 'Al-Jabbar',
      english: 'The Compeller',
      meaning: 'The Compeller, The Restorer',
      category: 'power',
      description: 'The One who compels and restores all things.',
      benefits: 'Reciting this name helps overcome difficulties.',
      count: 'Recite 100 times daily for overcoming difficulties'
    },
    {
      id: 10,
      arabic: 'الْمُتَكَبِّرُ',
      transliteration: 'Al-Mutakabbir',
      english: 'The Majestic',
      meaning: 'The Majestic, The Supreme',
      category: 'majesty',
      description: 'The One who is supremely great and majestic.',
      benefits: 'Reciting this name brings dignity and respect.',
      count: 'Recite 100 times daily for dignity'
    },
    // Add more names here...
    {
      id: 99,
      arabic: 'الصَّمَدُ',
      transliteration: 'As-Samad',
      english: 'The Eternal',
      meaning: 'The Eternal, The Absolute',
      category: 'eternity',
      description: 'The One who is eternal and self-sufficient.',
      benefits: 'Reciting this name brings contentment and satisfaction.',
      count: 'Recite 100 times daily for contentment'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Names', icon: FaHeart },
    { id: 'mercy', name: 'Mercy', icon: FaPray },
    { id: 'power', name: 'Power', icon: FaCrown },
    { id: 'protection', name: 'Protection', icon: FaMosque },
    { id: 'purity', name: 'Purity', icon: FaGem },
    { id: 'peace', name: 'Peace', icon: FaStar },
    { id: 'majesty', name: 'Majesty', icon: FaCrown },
    { id: 'eternity', name: 'Eternity', icon: FaLightbulb }
  ];

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = namesOfAllah.filter(name => 
      name.arabic.includes(term) ||
      name.transliteration.toLowerCase().includes(term) ||
      name.english.toLowerCase().includes(term) ||
      name.meaning.toLowerCase().includes(term)
    );
    setFilteredNames(filtered);
  };

  const handleCategoryFilter = (category) => {
    setCurrentCategory(category);
    if (category === 'all') {
      setFilteredNames(namesOfAllah);
    } else {
      const filtered = namesOfAllah.filter(name => name.category === category);
      setFilteredNames(filtered);
    }
  };

  const handleNameClick = (name) => {
    setSelectedName(name);
    setShowModal(true);
  };

  const toggleFavorite = (nameId) => {
    setFavorites(prev => 
      prev.includes(nameId) 
        ? prev.filter(id => id !== nameId)
        : [...prev, nameId]
    );
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : FaHeart;
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
              <FaHeart className="me-3" style={{ color: 'var(--primary-color)' }} />
              99 Names of Allah
            </h1>
            <p className="text-center text-muted lead">
              Asma ul Husna - The Most Beautiful Names of Allah
            </p>
          </Col>
        </Row>

        {/* Search and Filter */}
        <Row className="mb-4">
          <Col>
            <div className="search-container">
              <div className="position-relative">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search Names of Allah..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </Col>
        </Row>

        {/* Category Filter */}
        <Row className="mb-4">
          <Col>
            <div className="category-filter">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={currentCategory === category.id ? 'primary' : 'outline-primary'}
                    size="sm"
                    className="me-2 mb-2"
                    onClick={() => handleCategoryFilter(category.id)}
                  >
                    <IconComponent className="me-1" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </Col>
        </Row>

        {/* Names Grid */}
        <Row className="names-grid">
          {filteredNames.map((name, index) => {
            const IconComponent = getCategoryIcon(name.category);
            const isFavorite = favorites.includes(name.id);
            
            return (
              <Col lg={4} md={6} key={name.id} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="name-card"
                    onClick={() => handleNameClick(name)}
                  >
                    <Card.Body className="text-center">
                      <div className="name-header">
                        <div className="name-number">{name.id}</div>
                        <Button
                          variant="link"
                          className="favorite-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(name.id);
                          }}
                        >
                          <FaHeart 
                            className={isFavorite ? 'text-danger' : 'text-muted'} 
                          />
                        </Button>
                      </div>
                      
                      <div className="name-arabic mb-3">{name.arabic}</div>
                      <div className="name-transliteration mb-2">{name.transliteration}</div>
                      <div className="name-english mb-3">{name.english}</div>
                      <div className="name-meaning mb-3">{name.meaning}</div>
                      
                      <div className="name-category">
                        <IconComponent className="me-1" />
                        <Badge bg="primary">{name.category}</Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            );
          })}
        </Row>

        {/* Statistics */}
        <Row className="mt-5">
          <Col>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <h4>Names of Allah Statistics</h4>
                <div className="row">
                  <div className="col-md-3">
                    <div className="stat-item">
                      <h3>{namesOfAllah.length}</h3>
                      <p>Total Names</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-item">
                      <h3>{favorites.length}</h3>
                      <p>Favorites</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-item">
                      <h3>{categories.length - 1}</h3>
                      <p>Categories</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-item">
                      <h3>{filteredNames.length}</h3>
                      <p>Showing</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Name Details Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        size="lg"
        className="name-modal"
      >
        <Modal.Header className="modal-header-custom">
          <Modal.Title>
            {selectedName && (
              <div className="d-flex align-items-center">
                <FaHeart className="me-3" style={{ color: 'var(--primary-color)' }} />
                {selectedName.transliteration}
              </div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          {selectedName && (
            <div className="name-details">
              <div className="text-center mb-4">
                <div className="name-arabic-large mb-3">{selectedName.arabic}</div>
                <h3 className="name-transliteration-large mb-2">{selectedName.transliteration}</h3>
                <h4 className="name-english-large mb-3">{selectedName.english}</h4>
                <p className="name-meaning-large">{selectedName.meaning}</p>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <Card className="detail-card">
                    <Card.Body>
                      <h6><FaLightbulb className="me-2" />Description</h6>
                      <p>{selectedName.description}</p>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-6 mb-3">
                  <Card className="detail-card">
                    <Card.Body>
                      <h6><FaStar className="me-2" />Benefits</h6>
                      <p>{selectedName.benefits}</p>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-12">
                  <Card className="detail-card">
                    <Card.Body>
                      <h6><FaPray className="me-2" />Recommended Recitation</h6>
                      <p>{selectedName.count}</p>
                    </Card.Body>
                  </Card>
                </div>
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
            Add to Favorites
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default NamesOfAllah;