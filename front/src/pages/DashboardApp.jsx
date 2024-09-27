/** @format */
//React Imports
import * as React from 'react'
import { useState, useEffect } from 'react';

//Mui
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { Link } from 'react-router-dom'
import { Container } from '@mui/material';

import { getDrinks } from '../store/services/Drinks'

//Image
// import Profile from '../assets/images/Booking_images/profile.png'

//Components
import Page from '../layouts/components/common/Page';
import { useSelector } from "react-redux";

// Data
import homeBoxes from '../Data';

const DashboardApp = () => {

  useEffect(() => {
    getDrinks();
  }, []);
  
  const profileUse = useSelector((state) => state.auth.profile);
  return (
    <Page title="Dashboard">
      <Container className="ContainerPagePadding">
        <Card>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'self-end' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', alignItems: 'flex-start', p: 7.48, }}>
                <Typography variant='h4'>Congratulations <b>{profileUse.name}! 🎉</b> </Typography>
                <Typography variant='subtitle2' sx={{ mt: 4.50, mb: 4.50, }}>
                  Welcome to ดีเอฟเอ็ม</Typography>
                  <Typography variant='subtitle2'>Please Translate it</Typography>
                <Button
                  variant='contained'
                  component={Link} to="/profile"
                  sx={{ whiteSpace: 'nowrap', fontWeight: '500', textTransform: 'uppercase', pt: 2, pb: 2, pl: 5.5, pr: 5.5, }}

                >
                  View Profile
                </Button>
              </Box>
              {/* <img width={307} height={206} alt='Parent App Logo' src={Profile} /> */}
            </Box>
          </Grid>
        </Card>

        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'space-between', }}>

          {/* {homeBoxes.map((item) => (
            <Card sx={{ width: '32%', pt: 10, pb: 10, pl: 5, pr: 5, }} key={item.id}>
              <Grid container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }} className='dashboard-cursor'>
                <img className="rl-img" width={171} height={150} alt='Parent App Logo' src={item.imageSrc} />
                <Typography variant='h5'>{item.title}</Typography>
                <p>{item.description}</p>
                <Button variant='contained' component={Link} to={`/Booking?category=${item.url}`} sx={{ whiteSpace: 'nowrap', fontWeight: '500', textTransform: 'uppercase', pt: 2, pb: 2, pl: 5.5, pr: 5.5, }}>
                  {item.buttonText}
                </Button>
              </Grid>
            </Card>
          ))} */}

        </Box>

      </Container>
    </Page>);
};

export default DashboardApp;