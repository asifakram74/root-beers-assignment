import { PERMISSIONS } from './roles';

export const hasPermission = (role, page) => {
  const rolePermissions = {
    Admin: [
      PERMISSIONS.USERS_PAGE,
      PERMISSIONS.DASHBOARD_PAGE,
      PERMISSIONS.Booking_PAGE,
      PERMISSIONS.EDIT_USER_PAGE,
      PERMISSIONS.PRODUCTS_PAGE,
      PERMISSIONS.ADD_PRODUCT_PAGE,
      PERMISSIONS.EDIT_PRODUCT_PAGE,
      PERMISSIONS.ORDERS_PAGE,
      PERMISSIONS.EDIT_ORDER_PAGE,
      PERMISSIONS.PROFILE_PAGE,
    ],
    Manager: [
      PERMISSIONS.DASHBOARD_PAGE,
      PERMISSIONS.Booking_PAGE,
      PERMISSIONS.ORDERS_PAGE,
      PERMISSIONS.MY_Booking_PAGE,
      PERMISSIONS.PROFILE_PAGE,
    ],
    Agent: [
      PERMISSIONS.DASHBOARD_PAGE,
      PERMISSIONS.MY_Booking_PAGE,
      PERMISSIONS.Booking_PAGE,
      PERMISSIONS.PROFILE_PAGE,
    ],
  };

  return rolePermissions[role]?.includes(page);
};
