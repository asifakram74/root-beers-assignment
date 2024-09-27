import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

// API
import { VerifyOTP } from '../../../store/services/ForgotPasswordService';

// Toast imports
import toast from 'react-hot-toast';

// Loading imports
import CircularProgress from '@mui/material/CircularProgress';

// Validation imports
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Validation schema
const schema = yup.object().shape({
  otp: yup.string().required('OTP is required'),
});

const OTPFormsec = ({ onOtpVerified }) => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const email = JSON.parse(localStorage.getItem('email'));
    try {
      const formdata = {
        email,
        otp: data.otp
      };
      const response = await VerifyOTP(formdata);
      localStorage.setItem('formdata', JSON.stringify(formdata));
      if (response.data.status == 200) {
        toast.success(response.data.message);
        onOtpVerified();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Incorrect OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="container">
        <h3 className="login-page__title">OTP Verification</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="comment-one__form contact-form-validated" noValidate>
          <div className="row">
            <div className="col">
              <div className="comment-form__input-box">
                <Controller
                  name="otp"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="Your OTP"
                      {...field}
                      className={errors.otp ? 'input-error' : ''}
                    />
                  )}
                />
                {errors.otp && <p className="error-message">{errors.otp.message}</p>}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <button type="submit" className="thm-btn faqs-contact__btn">
                <span>
                  {loading ? <CircularProgress size={24} /> : 'Verify'}
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