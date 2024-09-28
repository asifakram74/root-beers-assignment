/** @format */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------

const DashboardNavbar = (props) => {
  const [settings, saveSettings] = useState({});

  DashboardNavbar.propTypes = {
    onOpenSidebar: PropTypes.func,
  };

  return (
    <>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box className="actions-left" sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
          <p className='logo'>Drinks</p>
        </Box>
        <Box className="actions-right" sx={{ display: 'flex', alignItems: 'center' }}>
          <nav className="nav_menu">
            <ul className="nav_main_menu">
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/drinks-list">Root Beers</Link></li>
              <li><Link to="#">Login</Link></li>
              <li><Link to="#">SignUp</Link></li>
              <li><Link to="#">Booking</Link></li>
            </ul>
          </nav>
          {/* <UserDropdown settings={settings} /> */}
        </Box>
      </Box>
    </>
  );
};

export default DashboardNavbar;