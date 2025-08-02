import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown, Offcanvas, Button } from 'react-bootstrap';
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
  FaBars,
  FaTimes,
  FaVolumeUp,
  FaVolumeMute,
  FaSun,
  FaMoon,
  FaUser,
  FaBell
} from 'react-icons/fa';

const Navbar = ({ theme, toggleTheme, userProfile }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  return (
    <>
      <BootstrapNavbar 
        expand="lg" 
        className="custom-navbar" 
        fixed="top"
        expanded={expanded}
        onToggle={(expanded) => setExpanded(expanded)}
      >
        <Container fluid>
          <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <FaMosque className="me-2" />
            <span className="brand-text">Islam360</span>
          </BootstrapNavbar.Brand>
          
          <div className="navbar-controls">
            <Button 
              variant="outline-light" 
              size="sm" 
              className="settings-toggle-btn me-2"
              onClick={handleSettingsToggle}
            >
              <FaCog />
            </Button>
            
            <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav">
              <FaBars />
            </BootstrapNavbar.Toggle>
          </div>
          
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
            </Nav>
            
            <Nav className="navbar-right">
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

      {/* Settings Sidebar */}
      <Offcanvas 
        show={showSettings} 
        onHide={handleSettingsToggle}
        placement="end"
        className="settings-sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <FaCog className="me-2" />
            Settings
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="settings-content">
            {/* Theme Toggle */}
            <div className="setting-item">
              <div className="setting-label">
                <FaSun className="me-2" />
                Theme
              </div>
              <div className="theme-toggle">
                <FaSun className="theme-icon" style={{ color: theme === 'light' ? '#ffc107' : '#6c757d' }} />
                <div 
                  className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}
                  onClick={toggleTheme}
                >
                  <div className="toggle-slider"></div>
                </div>
                <FaMoon className="theme-icon" style={{ color: theme === 'dark' ? '#6f42c1' : '#6c757d' }} />
              </div>
            </div>

            {/* Notification Settings */}
            <div className="setting-item">
              <div className="setting-label">
                <FaBell className="me-2" />
                Notifications
              </div>
              <div className="setting-controls">
                <Button variant="outline-success" size="sm">
                  <FaVolumeUp className="me-1" />
                  Enabled
                </Button>
              </div>
            </div>

            {/* Profile Section */}
            <div className="setting-item">
              <div className="setting-label">
                <FaUser className="me-2" />
                Profile
              </div>
              <div className="profile-section">
                {userProfile.profilePicture ? (
                  <img 
                    src={userProfile.profilePicture} 
                    alt="Profile" 
                    className="profile-preview"
                  />
                ) : (
                  <div className="profile-placeholder">
                    <FaUser />
                  </div>
                )}
                <div className="profile-info">
                  <small className="text-muted">Click to upload photo</small>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="setting-item">
              <div className="setting-label">
                <FaMosque className="me-2" />
                Quick Actions
              </div>
              <div className="quick-actions">
                <Button variant="outline-primary" size="sm" className="mb-2 w-100">
                  <FaClock className="me-1" />
                  Prayer Times
                </Button>
                <Button variant="outline-success" size="sm" className="mb-2 w-100">
                  <FaQuran className="me-1" />
                  Quran
                </Button>
                <Button variant="outline-info" size="sm" className="w-100">
                  <FaHands className="me-1" />
                  Duas
                </Button>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Navbar;