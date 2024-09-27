// ** React Imports
import { useState } from 'react'

// ** Next Imports
import { useNavigate } from 'react-router-dom'

// ** MUI Components
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress';

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
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import Cookies from "js-cookie"
import { login } from "../../store/slices/auth"

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const loginLoading = useSelector((state) => state.auth.loading);
  const loginError = useSelector((state) => state.auth.error);
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (token) {
      Cookies.set('token', token);
      toast.success('Login Successful');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else if (loginError) {
      toast.error(loginError);
    }
  }, [token, loginError, navigate]);

  const onSubmit = async (data) => {
    dispatch(login({ email: data.email, password: data.password }));
  };

  return (
    <>
      <Box className='login_wrapper'>
        <Box className="container">
          <Box className="login_cover">
            <Box className="heading_content">
              <h1>Welcome To AL AIRLINE Groups Of Companies Pakistan</h1>
              <a href="/login" className="default_button">Get Started</a>
            </Box>
            <Box className="login_form_wrapper">
              <h2>LOGIN</h2>
              <form className="login_form" noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Box className="inputs">
                  <FormControl fullWidth sx={{ mb: 2 }}>
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
                          placeholder='Your Email'
                        />
                      )}
                    />
                    {errors.email &&
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.email.message}
                      </FormHelperText>}
                  </FormControl>
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
                <Button className="default_button" type='submit'>{loginLoading ? <CircularProgress size={24} /> : 'LOGIN'}</Button>
                <Box className="login_more_menu">
                  <p className="link">
                    Don't Have an Account? <a href="/register">Signup</a>
                  </p>
                  <p className="link">
                    Forgot Password? <a href="/reset-password">Click here</a>
                  </p>
                </Box>
              </form>
            </Box>
          </Box>
        </Box >
      </Box >
    </>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage;