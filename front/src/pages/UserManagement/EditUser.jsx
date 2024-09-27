/** @format */
// React Imports
import * as React from 'react';
import { useState, useEffect } from 'react';

// MUI
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useParams, useNavigate } from 'react-router-dom';

// Components Imports
import Page from '../../layouts/components/common/Page';

// Api Services
import { viewUser, updateUser } from '../../store/services/usersService';

// Third Party Imports
import toast from 'react-hot-toast';

// React Hook Form Imports
import { useForm, Controller } from 'react-hook-form';

// Yup Imports
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

//__________________________________________________________

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required('Your name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().required('Phone Number is required'),
  agency: yup.string().required('Agency Name is required'),
  agency_category: yup.string().required('Agency Type is required'),
  agency_address: yup.string().required('Agency Address is required'),
  role: yup.string().required('Role is required'),
  city: yup.string().required('City is required'),
  status: yup.string().required('Status is required'),
});
const UpdateUser = () => {
  // States
  const [loading, setLoading] = useState(false);
  const routeParams = useParams();
  const navigate = useNavigate();

  // React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  // Load user data for editing
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const user = await viewUser(routeParams.id);
        reset(user);
      } catch (error) {
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    if (routeParams.id) {
      fetchUser();
    }
  }, [routeParams.id, reset]);

  // Submit handler
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateUser(routeParams.id, data);
      toast.success('User Updated Successfully');
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Update User">
      <Grid container spacing={2}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="h2_tag">Update User</h2>
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
                      <FormControl fullWidth error={!!errors.agency_category}>
                        <InputLabel
                          id="validation-basic-agency_category"
                          // error={Boolean(errors.select)}
                          htmlFor="validation-basic-agency_category"
                        >
                          Agency Type
                        </InputLabel>
                        <Controller
                          name="agency_category"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <Select
                              defaultValue="Agency Type"
                              value={value}
                              label="Agency Type"
                              placeholder="Agency Type"
                              onChange={onChange}
                              error={Boolean(errors.agency_category)}
                              labelId="validation-basic-agency_category"
                              aria-describedby="validation-basic-agency_category"
                            >
                              <MenuItem selected>Select Item</MenuItem>
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
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <Select
                              defaultValue="Role"
                              value={value}
                              label="Role"
                              placeholder="Role"
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
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <Select
                              defaultValue="Status"
                              value={value}
                              label="Status"
                              placeholder="Status"
                              onChange={onChange}
                              labelId="validation-basic-status"
                              aria-describedby="validation-basic-status"
                            >
                              <MenuItem value='Active'>Active</MenuItem>
                              <MenuItem value='Pending'>Pending</MenuItem>
                              <MenuItem value='Block'>Block</MenuItem>
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

                </Grid>

                <Grid item sx={6} className="CardButtonPadding">
                  <div className="buttons_right">
                    <Button
                      sx={{ textTransform: 'uppercase', fontWeight: '500' }}
                      className="button_margin_right"
                      variant="outlined"
                      onClick={() => navigate('/users')}
                    >
                      Cancel
                    </Button>

                    <Button sx={{ textTransform: 'uppercase', fontWeight: '500' }} variant="contained" type="submit">
                      Update
                    </Button>
                  </div>
                </Grid>
              </form>
            )}
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default UpdateUser;
