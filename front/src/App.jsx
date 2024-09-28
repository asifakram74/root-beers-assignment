// routes
import Router from './routes';
// components
import './assets/css/drinks.css';
import { Toaster } from 'react-hot-toast';
import 'swiper/swiper-bundle.css';


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
        autoClose={2000}
      />
    </>
  );
}