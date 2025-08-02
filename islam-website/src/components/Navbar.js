import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaPray, 
  FaQuran, 
  FaCog, 
  FaMosque, 
  FaHands, 
  FaCompass, 
  FaCalendarAlt,
  FaStar,
  FaClock,
  FaBook,
  FaHeart,
  FaBars
} from 'react-icons/fa';

const Navbar = ({ theme, userProfile }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <BootstrapNavbar 
      expand="lg" 
      className="custom-navbar" 
      fixed="top"
      expanded={expanded}
      onToggle={(expanded) => setExpanded(expanded)}
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FaMosque className="me-2" />
          Islam360
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav">
          <FaBars />
        </BootstrapNavbar.Toggle>
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={isActive('/') ? 'active' : ''}
              onClick={handleNavClick}
            >
              <FaHome className="me-1" />
              Home
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/ibadyat" 
              className={isActive('/ibadyat') ? 'active' : ''}
              onClick={handleNavClick}
            >
              <FaPray className="me-1" />
              Ibadyat
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/quran" 
              className={isActive('/quran') ? 'active' : ''}
              onClick={handleNavClick}
            >
              <FaQuran className="me-1" />
              Quran
            </Nav.Link>

            <NavDropdown 
              title={
                <span>
                  <FaBook className="me-1" />
                  Islamic Tools
                </span>
              } 
              id="islamic-tools-dropdown"
              className="nav-dropdown"
              show={expanded}
            >
              <NavDropdown.Item as={Link} to="/dua" onClick={handleNavClick}>
                <FaHands className="me-2" />
                Duas & Supplications
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/tasbih" onClick={handleNavClick}>
                <FaStar className="me-2" />
                Digital Tasbih
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/qibla" onClick={handleNavClick}>
                <FaCompass className="me-2" />
                Qibla Direction
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/calendar" onClick={handleNavClick}>
                <FaCalendarAlt className="me-2" />
                Islamic Calendar
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/names" onClick={handleNavClick}>
                <FaHeart className="me-2" />
                99 Names of Allah
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/times" onClick={handleNavClick}>
                <FaClock className="me-2" />
                Prayer Times
              </NavDropdown.Item>
            </NavDropdown>
            
            <Nav.Link 
              as={Link} 
              to="/settings" 
              className={isActive('/settings') ? 'active' : ''}
              onClick={handleNavClick}
            >
              <FaCog className="me-1" />
              Settings
            </Nav.Link>
          </Nav>
          
          <Nav>
            {userProfile.profilePicture && (
              <img 
                src={userProfile.profilePicture} 
                alt="Profile" 
                className="profile-pic"
              />
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;