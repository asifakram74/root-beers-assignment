/** @format **/

// React
import { Navigate, useRoutes } from 'react-router-dom';


// layout
import DashboardLayout from './layouts/dashboard';

// DashboardApp
import DashboardApp from './pages/DashboardApp';

// Beer
import RootBeerList from './pages/RootBeer/RootBeerList';
import AddEditRootBeer from './pages/RootBeer/AddEditRootBeer';

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
        {
          path: 'drinks-list',
          element: <RootBeerList />
        },
        {
          path: 'add-drinks',
          element: <AddEditRootBeer />
        },
        {
          path: 'edit-drinks',
          element: <AddEditRootBeer />
        },
      ],
    },

  ]);
}
