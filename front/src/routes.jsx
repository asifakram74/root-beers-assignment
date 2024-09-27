/** @format **/

// React
import { Navigate, useRoutes } from 'react-router-dom';


// layout
import DashboardLayout from './layouts/dashboard';

// DashboardApp
import DashboardApp from './pages/DashboardApp';

// Profile
import Profile from './pages/Profile/Profile';

// User
import Users from './pages/UserManagement/UsersList';
import EditUser from './pages/UserManagement/EditUser';

// Product
import Products from './pages/ProductManagement/ProductsList';
import AddEditProduct from './pages/ProductManagement/AddEditProduct';

// Order Management
import Orders from './pages/OrderManagement/OrderList';
import EditOrder from './pages/OrderManagement/EditOrder';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([

    // Dashboard Routes
    {
      element: <DashboardLayout />,
      path: '/',
      children: [
        {
          path: '/',
          element: <DashboardApp />
        },

        // // User
        // { path: 'users', element: <Users /> },
        // { path: 'edit-user/:id', element: <EditUser /> },

        // // Product
        // { path: 'products', element: <Products /> },
        // { path: 'add-product', element: <AddEditProduct /> },
        // { path: 'edit-product/:id', element: <AddEditProduct /> },

        // // Order
        // { path: 'orders', element: <Orders /> },
        // { path: 'edit-order/:id', element: <EditOrder /> },

        // // Booking
        // { path: 'Booking', element: <Booking /> },
        // { path: 'my-Booking', element: <MyBooking /> },

        // // Profile
        // { path: 'profile', element: <Profile /> },
      ],
    },
    // Logout

  ]);
}
