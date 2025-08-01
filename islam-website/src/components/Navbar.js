import React from 'react';
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
  FaHeart
} from 'react-icons/fa';

const Navbar = ({ theme, userProfile }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <BootstrapNavbar expand="lg" className="custom-navbar" fixed="top">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FaMosque className="me-2" />
          Islam360
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={isActive('/') ? 'active' : ''}
            >
              <FaHome className="me-1" />
              Home
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/ibadyat" 
              className={isActive('/ibadyat') ? 'active' : ''}
            >
              <FaPray className="me-1" />
              Ibadyat
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/quran" 
              className={isActive('/quran') ? 'active' : ''}
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
            >
              <NavDropdown.Item as={Link} to="/dua">
                <FaHands className="me-2" />
                Duas & Supplications
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/tasbih">
                <FaStar className="me-2" />
                Digital Tasbih
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/qibla">
                <FaCompass className="me-2" />
                Qibla Direction
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/calendar">
                <FaCalendarAlt className="me-2" />
                Islamic Calendar
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/names">
                <FaHeart className="me-2" />
                99 Names of Allah
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/times">
                <FaClock className="me-2" />
                Prayer Times
              </NavDropdown.Item>
            </NavDropdown>
            
            <Nav.Link 
              as={Link} 
              to="/settings" 
              className={isActive('/settings') ? 'active' : ''}
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