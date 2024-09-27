import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasPermission } from '../../../store/permissions';
// import { PERMISSIONS } from '../store/roles';

function Protected({ Component, page }) {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user.user);

useEffect(() => {
  if (!isAuthenticated) {
    navigate('/login');

  } else if (user && !hasPermission(user.role, page)) {
    navigate('/unauthorized');
  }
}, [isAuthenticated, user, page, navigate]);

return isAuthenticated && user && hasPermission(user.role, page) ? <Component /> : null;
}
 

export default Protected;
