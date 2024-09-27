import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

// API
import { ResetPassword } from '../../../store/services/ForgotPasswordService';

// Toast imports
import toast from 'react-hot-toast';

// Loading imports
import CircularProgress from '@mui/material/CircularProgress';

// Validation imports
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


// Validation schema
const schema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(5, 'Password must be at least 5 characters'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const OTPFormsec = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });


  const onSubmit = async (data) => {
    setLoading(true);
    const passReset = JSON.parse(localStorage.getItem('formdata'));
    try {
      const formdata = {
        email: passReset.email,
        otp: passReset.otp,
        password: data.password
      };
      const response = await ResetPassword(formdata);
      if (response.data.status == 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
      console.log(  response.data.message)
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.response.data.message)
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="container">
        <h3 className="login-page__title">Reset Password</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="comment-one__form contact-form-validated" noValidate>
          <div className="row">
            <div className="col-xl-6">
              <div className="comment-form__input-box">
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <div className="password-input-container">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        {...field}
                        className={errors.password ? 'input-error' : ''}
                      />
                      {/* <IconButton onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton> */}
                    </div>
                  )}
                />
                {errors.password && <p className="error-message">{errors.password.message}</p>}
              </div>
            </div>
            <div className="col-xl-6">
              <div className="comment-form__input-box">
                <Controller
                  name="password_confirmation"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <div className="password-input-container">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        {...field}
                        className={errors.password_confirmation ? 'input-error' : ''}
                      />
                      {/* <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton> */}
                    </div>
                  )}
                />
                {errors.password_confirmation && <p className="error-message">{errors.password_confirmation.message}</p>}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <button type="submit" className="thm-btn faqs-contact__btn">
                <span>
                  {loading ? <CircularProgress size={24} /> : 'Reset'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default OTPFormsec;