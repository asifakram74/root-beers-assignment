/** @format **/

// React
import { Navigate, useRoutes } from 'react-router-dom';


// layout
import DashboardLayout from './layouts/dashboard';

// DashboardApp
import DashboardApp from './pages/DashboardApp';

// Beer
import RootBeerList from './pages/RootBeer/RootBeerList';
import AddRootBeer from './pages/RootBeer/AddRootBeer';
import EditRootBeer from './pages/RootBeer/EditRootBeer';

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
          element: <AddRootBeer />
        },
        {
          path: 'edit-drinks/:id',
          element: <EditRootBeer />
        },
      ],
    },

  ]);
}
