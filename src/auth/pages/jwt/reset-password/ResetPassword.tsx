import clsx from 'clsx';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { Alert, KeenIcon } from '@/components';
import { useLayout } from '@/providers';
import { authService } from '@/api/services/auth.service';
import { toast } from 'sonner';

const initialValues = {
  email: ''
};

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required')
});

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const { currentLayout } = useLayout();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);
      try {
        const response = await authService.resetPasswordRequest({ email: values.email });
        
        if (response.status === 1) {
          // Success - navigate to OTP screen
          toast.success(response.message || 'OTP sent successfully to your email address.');
          setHasErrors(false);
          
          // Navigate to OTP screen with email in query params
          const params = new URLSearchParams();
          params.append('email', values.email);
          navigate({
            pathname:
              currentLayout?.name === 'auth-branded'
                ? '/auth/reset-password/otp'
                : '/auth/classic/reset-password/otp',
            search: params.toString()
          });
        } else {
          // Status 0 - show error message
          setStatus(response.message || 'Please wait 10 minutes before requesting another password reset email.');
          setHasErrors(true);
          toast.error(response.message || 'Please wait 10 minutes before requesting another password reset email.');
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send OTP. Please try again.';
        setStatus(errorMessage);
        setHasErrors(true);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });
  
  return (
    <div className="card max-w-[370px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Your Email</h3>
          <span className="text-2sm text-gray-600 font-medium">
            Enter your email to reset password
          </span>
        </div>

        {hasErrors && formik.status && (
          <Alert variant="danger">{formik.status}</Alert>
        )}

        {hasErrors === false && (
          <Alert variant="success">
            OTP sent successfully. Please check your email.
          </Alert>
        )}

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Email</label>
          <label className="input">
            <input
              type="email"
              placeholder="email@email.com"
              autoComplete="off"
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                {
                  'is-valid': formik.touched.email && !formik.errors.email
                }
              )}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-5 items-stretch">
          <button
            type="submit"
            className="btn btn-primary flex justify-center grow"
            disabled={loading || formik.isSubmitting}
          >
            {loading ? 'Please wait...' : 'Continue'}
          </button>

          <Link
            to={currentLayout?.name === 'auth-branded' ? '/auth/login' : '/auth/classic/login'}
            className="flex items-center justify-center text-sm gap-2 text-gray-700 hover:text-primary"
          >
            <KeenIcon icon="black-left" />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export { ResetPassword };
