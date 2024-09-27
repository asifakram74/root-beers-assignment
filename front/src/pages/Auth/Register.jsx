// ** React Imports
import { useState } from 'react'

// ** Next Imports
import { useNavigate } from 'react-router-dom'

// ** MUI Components
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'


// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Layout Import
import BlankLayout from '../../layouts/components/common/BlankLayout'

// ** Demo Imports
import toast from 'react-hot-toast'
import { useDispatch } from "react-redux"
import register from "../../store/slices/auth"

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string(),
  agency_type: yup.string().required('Agency Type is required'),
  agency: yup.string().required('Agency is required'),
  agency_address: yup.string().required('Agency Type is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(5, 'Password must be at least 5 characters'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  city: yup.string().required('City is required'),
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    dispatch(register(data));
    toast.success('Register Successful');
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <>
      <Box className='login_wrapper register_form'>
        <Grid className="container" container spacing={2} >
          <Grid item xs={12}>
            <Box className="login_cover">
              <Box className="heading_content">
                <h1>Welcome To AL AIRLINE Groups Of Companies Pakistan</h1>
                <a href="#" className="default_button">Get Started</a>
              </Box>
              <Box className="login_form_wrapper">
                <h2>Register</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="login_form">

                  <Grid container spacing={2}>

                    <Grid item xs={6}>

                      <Box className="BoxWidth">
                        <FormControl fullWidth>
                          <Controller
                            name='name'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange, onBlur } }) => (
                              <TextField
                                type="string"
                                label='Name'
                                value={value}
                                onBlur={onBlur}
                                onChange={onChange}
                                error={Boolean(errors.name)}
                                placeholder='Name'
                              />
                            )}
                          />
                          {errors.name &&
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {errors.name.message}
                            </FormHelperText>}
                        </FormControl>
                      </Box>

                      <Box className="BoxWidth">
                        <FormControl fullWidth>
                          <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                            Password
                          </InputLabel>
                          <Controller
                            name='password'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange, onBlur } }) => (
                              <OutlinedInput
                                value={value}
                                onBlur={onBlur}
                                label='Password'
                                onChange={onChange}
                                id='auth-login-v2-password'
                                error={Boolean(errors.password)}
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                  <InputAdornment position='end'>
                                    <IconButton
                                      edge='end'
                                      onMouseDown={e => e.preventDefault()}
                                      onClick={() => setShowPassword(!showPassword)}
                                    >
                                      {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                            )}
                          />
                          {errors.password && (
                            <FormHelperText sx={{ color: 'error.main' }} id=''>
                              {errors.password.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Box>

                      <Box className="BoxWidth">
                        <FormControl fullWidth>
                          <Controller
                            name='agency'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange, onBlur } }) => (
                              <TextField
                                autoFocus
                                label='Agency Name'
                                value={value}
                                onBlur={onBlur}
                                onChange={onChange}
                                error={Boolean(errors.agency)}
                                placeholder='Agency Name'
                              />
                            )}
                          />
                          {errors.agency &&
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {errors.agency.message}
                            </FormHelperText>}
                        </FormControl>
                      </Box>

                      <Box className="BoxWidth">
                        <FormControl fullWidth>
                          <Controller
                            name='agency_address'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange, onBlur } }) => (
                              <TextField
                                autoFocus
                                label='Agency Address'
                                value={value}
                                onBlur={onBlur}
                                onChange={onChange}
                                error={Boolean(errors.agency_address)}
                                placeholder='Agency Address'
                              />
                            )}
                          />
                          {errors.agency_address &&
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {errors.agency_address.message}
                            </FormHelperText>}
                        </FormControl>
                      </Box>

                      <Box className="BoxWidth">
                        <FormControl fullWidth>
                          <Controller
                            name='phone'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange, onBlur } }) => (
                              <TextField
                                type='text'
                                autoFocus
                                label='Phone'
                                value={value}
                                onBlur={onBlur}
                                onChange={onChange}
                                error={Boolean(errors.phone)}
                                placeholder='Phone'
                              />
                            )}
                          />
                          {errors.phone &&
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {errors.phone.message}
                            </FormHelperText>}
                        </FormControl>
                      </Box>

                    </Grid>

                    <Grid item xs={6}>

                      <Box className="BoxWidth">
                        <FormControl fullWidth>
                          <Controller
                            name='email'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange, onBlur } }) => (
                              <TextField
                                autoFocus
                                label='Email'
                                value={value}
                                onBlur={onBlur}
                                onChange={onChange}
                                error={Boolean(errors.email)}
                                placeholder='Email'
                              />
                            )}
                          />
                          {errors.email &&
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {errors.email.message}
                            </FormHelperText>}
                        </FormControl>
                      </Box>

                      <Box className="BoxWidth">
                        <FormControl fullWidth variant="outlined">
                          <InputLabel
                            id="validation-schema-password_confirmation"
                            error={Boolean(errors.password_confirmation)}
                            htmlFor="validation-schema-password_confirmation">
                            Confirm Password
                          </InputLabel>
                          <Controller
                            name="password_confirmation"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <OutlinedInput
                                value={value}
                                onChange={onChange}
                                id="validation-schema-password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                error={Boolean(errors.password_confirmation)}
                                labelid="validation-schema-password_confirmation"
                                aria-describedby="validation-schema-password_confirmation"
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onMouseDown={(e) => e.preventDefault()}
                                      onClick={() =>
                                        setshowConfirmPassword(
                                          !showConfirmPassword,
                                        )
                                      }
                                      edge="end">
                                      {showConfirmPassword ? (
                                        <EyeOutline />
                                      ) : (
                                        <EyeOffOutline />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                }
                                label="Confirm Password"
                              />
                            )}
                          />
                          {errors.password_confirmation && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-schema-password_confirmation">
                              {errors.password_confirmation.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Box>

                      <Box className="BoxWidth">
                        <FormControl fullWidth error={!!errors.agency_type}>
                          <InputLabel
                            id="validation-basic-agency_type"
                            htmlFor="validation-basic-agency_type"
                          >
                            Agency Type
                          </InputLabel>
                          <Controller
                            name="agency_type"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <Select
                                defaultValue="Agency Type"
                                value={value}
                                label="Agency Type"
                                placeholder="Agency Type"
                                onChange={onChange}
                                labelId="validation-basic-agency_type"
                                aria-describedby="validation-basic-agency_type"
                              >
                                <MenuItem selected>Select Agency Type</MenuItem>
                                <MenuItem value="IATA">IATA</MenuItem>
                                <MenuItem value="NON-IATA">Non IATA</MenuItem>
                              </Select>
                            )}
                          />
                          {errors.agency_type && (
                            <Typography color="error">{errors.agency_type.message}</Typography>
                          )}
                        </FormControl>
                      </Box>

                      <Box className="BoxWidth">
                        <FormControl fullWidth>
                          <Controller
                            name='city'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange, onBlur } }) => (
                              <TextField
                                autoFocus
                                label='City'
                                value={value}
                                onBlur={onBlur}
                                onChange={onChange}
                                error={Boolean(errors.city)}
                                placeholder='City'
                              />
                            )}
                          />
                          {errors.city &&
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {errors.city.message}
                            </FormHelperText>}
                        </FormControl>
                      </Box>

                    </Grid>

                  </Grid>

                  <Grid item sx={6} className="CardButtonPadding">
                    <Button className="default_button" type="submit">
                      Sign Up
                    </Button>
                  </Grid>

                </form>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
RegisterPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
RegisterPage.guestGuard = true

export default RegisterPage;