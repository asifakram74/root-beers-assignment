/** @format */

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Modal, Typography, Button, Card} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import UserDropdown from '../UserDropdown';
// import UnAuthorized from '../../../assets/images/Booking_images/misc-not-authorized-illustration.png';
// import UnAuthorized from '../../../assets/images/Booking_images/illustration_404.svg';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/auth';

// ----------------------------------------------------------------------

const DashboardNavbar = (props) => {
  const [settings, saveSettings] = useState({});
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  DashboardNavbar.propTypes = {
    onOpenSidebar: PropTypes.func,
  };

  useEffect(() => {
    const storedData = localStorage.getItem('user');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUser(parsedData.user);

      if (parsedData.user.status === 'Pending' || parsedData.user.status === 'Block') {
        setModalMessage(`Your status is ${parsedData.user.status.toLowerCase()}. Please contact the administration.`);
        setShowModal(true);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogin = () => {
    setShowModal(false);
    navigate('/login');
  };

  const handleDropdownClose = (url) => {
    if (url) {
      // router.push(url)
    }
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    dispatch(logout());
    localStorage.removeItem('user');
    handleDropdownClose();
    navigate('/login');
  };

  return (
    <>
      {user && user.status === 'Active' ? (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box className="actions-left" sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <p className='logo'>ดีเอฟเอ็ม</p>
          </Box>
          <Box className="actions-right" sx={{ display: 'flex', alignItems: 'center' }}>
            <nav className="nav_menu">
              <ul className="nav_main_menu">
                {user.role === 'Admin' && (
                  <>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/products">Flights</Link></li>
                    <li><Link to="/users">Users</Link></li>
                    <li><Link to="/Orders">Booking</Link></li>
                  </>
                )}
                {user.role === 'Agent' && (
                  <>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/my-Booking">My Booking</Link></li>
                  </>
                )}
                {user.role === 'Manager' && (
                  <>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/products">Flights</Link></li>
                    <li><Link to="/my-Booking">My Booking</Link></li>
                  </>
                )}
              </ul>
            </nav>
            <UserDropdown settings={settings} />
          </Box>
        </Box>
      ) : (
        <Modal
          open={showModal}
          onClose={handleLogin}
          aria-labelledby="login-modal-title"
          aria-describedby="login-modal-description"
        >
          <Box className='Booking_modal'>
            <Card sx={{ mb: 6, width: '60%' }}>
              <Box sx={{ p: 5, textAlign: 'center' }}>
                <Typography id="login-modal-title" variant="h2" component="h2">
                  401
                </Typography>
                <Typography id="login-modal-title" variant="h4" component="h4">
                  You are not authorized! 🔐
                </Typography>
                <Typography id="login-modal-description" sx={{ mt: 2 }}>
                  {modalMessage}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                  {/* <Box component="img" src={UnAuthorized} sx={{ height: 350, mx: 'auto', my: { xs: 5, sm: 10 } }} /> */}
                  <Button sx={{ textTransform: 'uppercase', fontWeight: '500' }} variant="contained" onClick={handleLogout} >
                    Logout
                  </Button>
                </Box>
              </Box>
            </Card>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default DashboardNavbar;