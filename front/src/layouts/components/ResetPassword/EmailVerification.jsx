import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

// API
import { postVerifyEmail } from '../../../store/services/ForgotPasswordService';

// Toast imports
import toast from 'react-hot-toast';

// Loading imports
import CircularProgress from '@mui/material/CircularProgress';

// Validation imports
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Validation schema
const schema = yup.object().shape({
  email: yup.string().required('Email is required'),
});

const EmailVarificationFormsec = ({ onEmailVerified }) => {
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
    try {
      const response = await postVerifyEmail(data);
      localStorage.setItem('email', JSON.stringify(data.email));
      if (response.data.status == 200) {
        toast.success(response.data.message);
        onEmailVerified();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'User Not Found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="container">
        <h3 className="login-page__title">Email Verification</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="comment-one__form contact-form-validated" noValidate>
          <div className="row">
            <div className="col">
              <div className="comment-form__input-box">
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="Your Email"
                      {...field}
                      className={errors.email ? 'input-error' : ''}
                    />
                  )}
                />
                {errors.email && <p className="error-message">{errors.email.message}</p>}
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

export default EmailVarificationFormsec;