import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Page from '../../layouts/components/common/Page';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import UpdatePassword from './UpdatePassword';
import { getProfile } from '../../store/slices/auth';
// import AuthService from '../../store/services/auth.service'

// Third Party Imports
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  name: yup.string().required(),
  // email: yup.string().email('Invalid email format').required('Email is a Required Field'),
});

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.profile);
  const loading = useSelector((state) => state.auth.loading);
  const [show, setShow] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      id: '',
      name: '',
      email: '',
      phone: '',
      agency: '',
      agency_category: '',
      agency_address:'',
      role: '',
      city: '',
      status: '',
      email_verified: '',
    }
  });

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setValue('id', profile.id || '');
      setValue('name', profile.name || '');
      setValue('email', profile.email || '');
      setValue('phone', profile.phone || '');
      setValue('agency', profile.agency || '');
      setValue('agency_category', profile.agency_category || '');
      setValue('agency_address', profile.agency_address || '');
      setValue('role', profile.role || '');
      setValue('city', profile.city || '');
      setValue('status', profile.status || '');
      setValue('email_verified', profile.email_verified || '');
    }
  }, [profile, setValue]);
   const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  const onSubmit = async (data) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // await AuthService.UpdateProfile(data);
      toast.success('Profile Updated Successfully');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    }
    finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const backHomePage = () => {
    console.log("aa")
    navigate('/dashboard');
  };

  return (
    <>
      <Page title="Profile">
        <Grid container spacing={2}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="h2_tag">Profile</h2>
          </Box>
          <Grid item xs={12} sx={{ mt: 5 }}>
            <Card className="MainCard">
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2} className="CardPadding">

                    <Grid item xs={6}>
                      <Box className="BoxWidth">
                        <FormControl fullWidth>
                          <Controller
                            name="id"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                type="number"
                                value={value}
                                onChange={onChange}
                                label="ID"
                                placeholder="ID"
                                disabled
                              />
                            )}
                          />
                        </FormControl>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box className="BoxWidth">
                        <FormControl fullWidth>
                          <Controller
                            name="name"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <TextField
                                  type="text"
                                  value={value}
                                  onChange={onChange}
                                  label="Your name"
                                  placeholder="Your name"
                                  error={!!errors.name}
                                />
                                {errors.name && <Typography color="error">{errors.name.message}</Typography>}
                              </>
                            )}
                          />
                        </FormControl>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box className="BoxWidth">
                        <FormControl fullWidth>
                          <Controller
                            name="email"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <TextField
                                disabled
                                type="text"
                                  value={value}
                                  onChange={onChange}
                                  label="Email Address"
                                  placeholder="Email Address"
                                  error={!!errors.email}
                                />
                                {errors.email && <Typography color="error">{errors.email.message}</Typography>}
                              </>
                            )}
                          />
                        </FormControl>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box className="BoxWidth">
                        <FormControl fullWidth>
                          <Controller
                            name="phone"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <TextField
                                  type="text"
                                  value={value}
                                  onChange={onChange}
                                  label="Phone Number"
                                  placeholder="Phone Number"
                                  error={!!errors.phone}
                                />
                                {errors.phone && <Typography color="error">{errors.phone.message}</Typography>}
                              </>
                            )}
                          />
                        </FormControl>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box className="BoxWidth">
                        <FormControl fullWidth>
                          <Controller
                            name="agency"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <TextField
                                  type="text"
                                  value={value}
                                  onChange={onChange}
                                  label="Agency Name"
                                  placeholder="Agency Name"
                                  error={!!errors.agency}
                                />
                                {errors.agency && <Typography color="error">{errors.agency.message}</Typography>}
                              </>
                            )}
                          />
                        </FormControl>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box className="BoxWidth">
                        <FormControl fullWidth error={!!errors.agency_category}>
                          <InputLabel id="validation-basic-agency_category">
                            Agency Type
                          </InputLabel>
                          <Controller
                            name="agency_category"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <Select
                                value={value}
                                onChange={onChange}
                                label="Agency Type"
                                labelId="validation-basic-agency_category"
                                aria-describedby="validation-basic-agency_category"
                              >
                                <MenuItem value='IATA'>IATA</MenuItem>
                                <MenuItem value='NON-IATA'>Non IATA</MenuItem>
                              </Select>
                            )}
                          />
                          {errors.agency_category && (
                            <Typography color="error">{errors.agency_category.message}</Typography>
                          )}
                        </FormControl>
                      </Box>
                    </Grid>






                    <Grid item xs={6}>
                      <Box className="BoxWidth">
                        <FormControl fullWidth>
                          <Controller
                            name="agency_address"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <TextField
                                  type="text"
                                  value={value}
                                  onChange={onChange}
                                  label="Agency Address"
                                  placeholder="Agency Address"
                                  error={!!errors.agency_address}
                                />
                                {errors.agency_address && <Typography color="error">{errors.agency_address.message}</Typography>}
                              </>
                            )}
                          />
                        </FormControl>
                      </Box>
                    </Grid>
 

                    <Grid item xs={6}>
                      <Box className="BoxWidth">
                        <FormControl fullWidth error={!!errors.role}>
                          <InputLabel
                            id="validation-basic-role"
                            htmlFor="validation-basic-role"
                          >
                            Role
                          </InputLabel>
                          <Controller
                            name="role"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <Select
                              disabled
                                value={value}
                                label="Role"
                                onChange={onChange}
                                labelId="validation-basic-role"
                                aria-describedby="validation-basic-role"
                              >
                                <MenuItem value='Agent'>Agent</MenuItem>
                                <MenuItem value='Manager'>Manager</MenuItem>
                                <MenuItem value='Admin'>Admin</MenuItem>
                              </Select>
                            )}
                          />
                          {errors.role && (
                            <Typography color="error">{errors.role.message}</Typography>
                          )}
                        </FormControl>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box className="BoxWidth">
                        <FormControl fullWidth>
                          <Controller
                            name="city"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <TextField
                                  type="text"
                                  value={value}
                                  onChange={onChange}
                                  label="City"
                                  placeholder="City"
                                  error={!!errors.city}
                                />
                                {errors.city && <Typography color="error">{errors.city.message}</Typography>}
                              </>
                            )}
                          />
                        </FormControl>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box className="BoxWidth">
                        <FormControl fullWidth error={!!errors.status}>
                          <InputLabel
                            id="validation-basic-status"
                            htmlFor="validation-basic-status"
                          >
                            Status
                          </InputLabel>
                          <Controller
                            name="status"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <Select
                                disabled
                                value={value}
                                label="Status"
                                onChange={onChange}
                                labelId="validation-basic-status"
                                aria-describedby="validation-basic-status"
                              >
                                <MenuItem value='Active'>Active</MenuItem>
                                <MenuItem value='Pending'>Pending</MenuItem>
                                <MenuItem value='Blocked'>Blocked</MenuItem>
                              </Select>
                            )}
                          />
                          {errors.status && (
                            <Typography color="error">{errors.status.message}</Typography>
                          )}
                        </FormControl>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box className="BoxWidth">
                        <FormControl fullWidth>
                          <Controller
                            name="email_verified"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                type="text"
                                value={value}
                                onChange={onChange}
                                label="Email Verified"
                                placeholder="Email Verified"
                                disabled
                              />
                            )}
                          />
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Box>
                        <Button variant="outlined" onClick={handleOpen} className="DeleteButton">
                          Change Password
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid item sx={6} className="CardButtonPadding">
                    <div className="buttons_right">
                      <Button
                        className="button_margin_right"
                        variant="outlined"
                        sx={{ textTransform: 'uppercase', fontWeight: '500' }}
                        onClick={backHomePage}
                      >
                        Cancel
                      </Button>

                      <Button size="large" type="submit" variant="contained" className="AddBtn">
                        Update
                      </Button>
                    </div>
                  </Grid>
                </form>
              )}
            </Card>
            <Grid>
              <UpdatePassword show={show} handleClose={handleClose} id={profile.id}  />
            </Grid>
          </Grid>
        </Grid>
      </Page>
    </>
  );
};

export default Profile;