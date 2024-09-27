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
import Typography from '@mui/material/Typography';
import { useParams, useNavigate } from 'react-router-dom';
// Date Day Time Picker
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Components Imports
import Page from '../../layouts/components/common/Page';

// Api Services
import { postProduct, viewProduct, updateProduct } from '../../store/services/ProductServices';

// Third Party Imports
import toast from 'react-hot-toast';

// React Hook Form Imports
import { useForm, Controller } from 'react-hook-form';
import { InputLabel, Select, MenuItem } from '@mui/material';

// Validation Imports
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

//__________________________________________________________

// Validation Schema
const schema = yup.object().shape({
  airlines: yup.string().required('Airline Name/logo is required'),
  price: yup.number().required('Price is required').positive('Price must be positive'),
  stock: yup.string().required('Seat or Stock is required'),
  sector: yup.string().required('Sector is required'),
  pnr: yup.string().required('PNR is required'),
  dept_timing: yup.string().required('Timing is required'),
  dept_date: yup.string().required('Date is required'),
  dept_day: yup.string().required('Day is required'),
  arv_timing: yup.string(),
  arv_date: yup.string(),
  arv_day: yup.string(),
  flight_number: yup.string().required('Flight Number is required'),
  category: yup.string().required('Please Select a Category'),


});

const AddUpdateProduct = () => {
  const [mode, setMode] = useState('create');
  // States
  const [loading, setLoading] = useState(false);
  const routeParams = useParams();
  const navigate = useNavigate();

  // React Hook Form
  const {
    watch,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: '',
      day: '',
      timing: '',
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  // Departure Date Day Time Picker
  const handleDateTimeChange = (newValue) => {
    if (newValue) {
      const newDeptDay = newValue.toLocaleString('en-US', { weekday: 'long' });
      const newDeptDate = newValue.toLocaleDateString();
      const newDeptTime = newValue.toLocaleTimeString();

      setValue('dept_day', newDeptDay);
      setValue('dept_date', newDeptDate);
      setValue('dept_timing', newDeptTime);
    } else {
      setValue('dept_day', '');
      setValue('dept_date', '');
      setValue('dept_timing', '');
    }
  };


  // Arrival Date Day Time Picker
  const handleArrDateTimeChange = (newValue) => {
    if (newValue) {
      const newArvDay = newValue.toLocaleString('en-US', { weekday: 'long' });
      const newArvDate = newValue.toLocaleDateString();
      const newArvTime = newValue.toLocaleTimeString();

      setValue('arv_day', newArvDay);
      setValue('arv_date', newArvDate);
      setValue('arv_timing', newArvTime);
    } else {
      setValue('arv_day', '');
      setValue('arv_date', '');
      setValue('arv_timing', '');
    }
  };

  // Load Product data for editing
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const product = await viewProduct(routeParams.id);
        reset(product);
        setMode('update');
      } catch (error) {
        toast.error('Failed to load Product data');
      } finally {
        setLoading(false);
      }
    };

    if (routeParams.id) {
      fetchProduct();
    }
  }, [routeParams.id, reset]);

  // Submit handler
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (mode === 'create') {
        await postProduct(data);
        toast.success('Product Created Successfully');
      } else {
        await updateProduct(routeParams.id, data);
        toast.success('Product Updated Successfully');
      }
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${mode === 'create' ? 'create' : 'update'}`)
    };
  }

  return (
    <Page title={mode && mode == 'create' ? ' Add Product' : 'Update Product'}>
      <Grid container spacing={2}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="h2_tag">{mode && mode == 'create' ? ' Add Product' : 'Update Product'}</h2>
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

                  {mode && mode == 'create' ? '' :
                    <Grid item xs={6}>
                      <Box className="BoxWidth">
                        <FormControl fullWidth>
                          <Controller
                            name="id"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                type="text"
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
                  }

                  <Grid item xs={6}>
                    <Box className="BoxWidth">
                      <FormControl fullWidth error={!!errors.airlines}>
                        <InputLabel
                          id="validation-basic-airlines"
                          htmlFor="validation-basic-airlines"
                        >
                          Airlines
                        </InputLabel>
                        <Controller
                          name="airlines"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <Select
                              value={value}
                              label="Airline"
                              onChange={onChange}
                              labelId="validation-basic-airlines"
                              aria-describedby="validation-basic-airlines"
                            >
                              <MenuItem value='PIA'>PIA</MenuItem>
                              <MenuItem value='Saudi Airlines'>Saudi Airlines</MenuItem>
                              <MenuItem value='Fly Jinnah'>Fly Jinnah</MenuItem>

                            </Select>
                          )}
                        />
                        {errors.airlines && (
                          <Typography color="error">{errors.airlines.message}</Typography>
                        )}
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box className="BoxWidth">
                      <FormControl fullWidth error={!!errors.category}>
                        <InputLabel
                          id="validation-basic-category"
                          htmlFor="validation-basic-category"
                        >
                          Category
                        </InputLabel>
                        <Controller
                          name="category"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <Select
                              value={value}
                              label="Category"
                              onChange={onChange}
                              labelId="validation-basic-category"
                              aria-describedby="validation-basic-category"
                            >
                              <MenuItem value='One Way'>One Way</MenuItem>
                              <MenuItem value='Return'>Return</MenuItem>
                              <MenuItem value='Umrah Package'>Umrah Package</MenuItem>
                            </Select>
                          )}
                        />
                        {errors.category && (
                          <Typography color="error">{errors.category.message}</Typography>
                        )}
                      </FormControl>
                    </Box>
                  </Grid>


                  <Grid item xs={6}>
                    <Box className="BoxWidth">
                      <FormControl fullWidth>
                        <Controller
                          name="price"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <TextField
                                type="number"
                                value={value}
                                onChange={onChange}
                                label="Price"
                                placeholder="Price"
                                error={!!errors.price}
                              />
                              {errors.price && <Typography color="error">{errors.price.message}</Typography>}
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
                          name="sector"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <TextField
                                type="text"
                                value={value}
                                onChange={onChange}
                                label="Sector"
                                placeholder="Sector"
                                error={!!errors.sector}
                              />
                              {errors.sector && <Typography color="error">{errors.sector.message}</Typography>}
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
                          name="pnr"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <TextField
                                type="string"
                                value={value || ""}
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  if (inputValue.length <= 6) {
                                    onChange(inputValue);
                                  }
                                }}
                                label="PNR"
                                placeholder="PNR"
                                error={!!errors.pnr}
                                inputProps={{ maxLength: 6 }}
                              />
                              {errors.pnr && <Typography color="error">{errors.pnr.message}</Typography>}
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
                          name="flight_number"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <TextField
                                type="text"
                                value={value}
                                onChange={onChange}
                                label="Flight Number"
                                placeholder="Flight Number"
                                disabled={mode !== 'create'}
                                error={!!errors.flight_number}
                              />
                              {errors.flight_number && <Typography color="error">{errors.flight_number.message}</Typography>}
                            </>
                          )}
                        />
                      </FormControl>
                    </Box>
                  </Grid>

                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box className="BoxWidth">
                          <FormControl fullWidth>
                            <DateTimePicker
                              label="Select Dept Date & Time"
                              onChange={handleDateTimeChange}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box className="BoxWidth">
                          <FormControl fullWidth>
                            <Controller
                              name="dept_timing"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <TextField
                                    type="text"
                                    {...field}
                                    label="Dept Timing"
                                    placeholder="Dept Timing"
                                    error={!!errors.dept_timing}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                  {errors.dept_timing && <Typography color="error">{errors.dept_timing.message}</Typography>}
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
                              name="dept_date"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <TextField
                                    type="text"
                                    {...field}
                                    label="Dept Date"
                                    placeholder="Dept Date"
                                    error={!!errors.dept_date}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                  {errors.dept_date && <Typography color="error">{errors.dept_date.message}</Typography>}
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
                              name="dept_day"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <TextField
                                    type="text"
                                    {...field}
                                    label="Dept Day"
                                    placeholder="Dept Day"
                                    error={!!errors.dept_day}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                  {errors.dept_day && <Typography color="error">{errors.dept_day.message}</Typography>}
                                </>
                              )}
                            />
                          </FormControl>
                        </Box>
                      </Grid>
                    </Grid>
                  </LocalizationProvider>


                  {/* Arrival Date */}
                  {watch('category') !== 'One Way' && <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box className="BoxWidth">
                          <FormControl fullWidth>
                            <DateTimePicker
                              label="Select Dept Date & Time"
                              onChange={handleArrDateTimeChange}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box className="BoxWidth">
                          <FormControl fullWidth>
                            <Controller
                              name="arv_timing"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <TextField
                                    type="text"
                                    {...field}
                                    label="Arv Timing"
                                    placeholder="Arv Timing"
                                    error={!!errors.arv_timing}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                  {errors.arv_timing && <Typography color="error">{errors.arv_timing.message}</Typography>}
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
                              name="arv_date"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <TextField
                                    type="text"
                                    {...field}
                                    label="Arv Date"
                                    placeholder="Arv Date"
                                    error={!!errors.arv_date}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                  {errors.arv_date && <Typography color="error">{errors.arv_date.message}</Typography>}
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
                              name="arv_day"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <TextField
                                    type="text"
                                    {...field}
                                    label="Arv Day"
                                    placeholder="Arv Day"
                                    error={!!errors.arv_day}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                  {errors.arv_day && <Typography color="error">{errors.arv_day.message}</Typography>}
                                </>
                              )}
                            />
                          </FormControl>
                        </Box>
                      </Grid>
                    </Grid>
                  </LocalizationProvider>
                  }


                  <Grid item xs={6}>
                    <Box className="BoxWidth">
                      <FormControl fullWidth>
                        <Controller
                          name="stock"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <TextField
                                type="text"
                                value={value}
                                onChange={onChange}
                                label="Seat or Stock"
                                placeholder="Seat or Stock"
                                error={!!errors.stock}
                              />
                              {errors.stock && <Typography color="error">{errors.stock.message}</Typography>}
                            </>
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
                      onClick={() => navigate('/products')}
                    >
                      Cancel
                    </Button>
                    <Button sx={{ textTransform: 'uppercase', fontWeight: '500' }} variant="contained" type="submit">
                      {mode && mode == 'create' ? ' ADD PRODUCT' : 'UPDATE PRODUCT'}
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

export default AddUpdateProduct;
