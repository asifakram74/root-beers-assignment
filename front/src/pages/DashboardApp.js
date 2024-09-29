/** @format */
// React Imports
import * as React from 'react';
import { useState, useEffect } from 'react';

// MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { Link } from 'react-router-dom';
import { Container } from '@mui/material';

// Slider Library
import { Swiper, SwiperSlide } from 'swiper/react';

// Service
import { getDrinksPictures } from '../store/services/DrinksService';

// Components
import Page from '../layouts/components/common/Page';

// Icons
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';

const DashboardApp = () => {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const REACT_APP_SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

  const renderStars = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} sx={{ color: '#f3cd1e' }} />);
      } else {
        stars.push(<StarBorder key={i} sx={{ color: '#ccc' }} />);
      }
    }

    return stars;
  };
  useEffect(() => {
    getDrinksPictures()
      .then((r) => {
        if (r) {
          setDrinks(r);
        } else {
          setDrinks([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching drinks:", error);
        setDrinks([]);
      });
  }, []);

  return (
    <Page title="Dashboard">
      <Container className="ContainerPagePadding">
        <Box sx={{ mt: 5 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <CircularProgress /> {/* Loading spinner */}
            </Box>
          ) : (
            <Swiper
              spaceBetween={20}
              slidesPerView={4}
              breakpoints={{
                1300: {
                  slidesPerView: 4,
                },
                900: {
                  slidesPerView: 3,
                },
                600: {
                  slidesPerView: 2,
                },
                0: {
                  slidesPerView: 1,
                },
              }}
            >
              {drinks.map((item) => (
                <SwiperSlide key={item.id}>
                  <Card
                    sx={{
                      p: 5,
                      position: 'relative',
                      transition: '0.3s',
                      boxShadow: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Grid container sx={{ flexDirection: 'column', alignItems: 'center' }} className='dashboard-cursor'>
                      <img
                        className="rl-img"
                        width={171}
                        height={150}
                        alt='Drink Image'
                        src={item.Pictures && item.Pictures.length > 0 ? `${REACT_APP_SECRET_KEY}/${item.Pictures[0].path}` : null}
                        style={{ borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <Typography variant='h5' sx={{ mt: 2, fontWeight: 'bold', textAlign: 'center' }}>
                        {item.name}
                      </Typography>
                      <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                        {item.reviewCount} Reviews
                      </Typography>
                      <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center' }}>
                        {renderStars(item.reviewAverageRating)}
                        <span style={{ marginLeft: '8px' }}>({item.reviewCount})</span>
                      </Typography>
                    </Grid>
                    <Button
                      variant='contained'
                      component={Link}
                      to={`/Booking?category=${item.url}`}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        zIndex: 10,
                        '&:hover': {
                          backgroundColor: '#f33733',
                          opacity: 1,
                        },
                      }}
                    >
                      View Drink
                    </Button>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Box>
      </Container>
    </Page>
  );
};

export default DashboardApp;