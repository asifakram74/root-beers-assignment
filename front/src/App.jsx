// routes
import Router from './routes';
// components
import './assets/css/App.css'
import './assets/css/Booking.css'
import './assets/Booking.css'
import { Toaster } from 'react-hot-toast';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <>
      <Router />
      <Toaster
        position="top-right"
        reverseOrder={false}
        limits={1}
        preventDuplicates
        autoClose={2000} />
    </>
  );
}
