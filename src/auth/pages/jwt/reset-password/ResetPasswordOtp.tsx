import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KeenIcon } from '@/components';
import { useLayout } from '@/providers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert } from '@/components';
import { authService } from '@/api/services/auth.service';
import { toast } from 'sonner';

const resetPasswordOtpSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .min(4, 'OTP must be at least 4 characters')
    .max(10, 'OTP must be at most 10 characters'),
  new_password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Maximum 50 symbols')
    .required('New password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('new_password')], 'Passwords must match')
    .required('Please confirm your password'),
});

const ResetPasswordOtp = () => {
  const { currentLayout } = useLayout();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate(
        currentLayout?.name === 'auth-branded'
          ? '/auth/reset-password'
          : '/auth/classic/reset-password'
      );
    }
  }, [email, navigate, currentLayout]);

  const formik = useFormik({
    initialValues: {
      otp: '',
      new_password: '',
      confirm_password: '',
    },
    validationSchema: resetPasswordOtpSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);

      try {
        const response = await authService.resetPasswordOtp({
          email: email,
          otp: values.otp,
          new_password: values.new_password,
        });
        
        if (response.status === 1) {
          // Success - password reset successful
          toast.success(response.message || 'Password reset successfully');
          setHasErrors(false);
          
          // Navigate to login page after a short delay
          setTimeout(() => {
            navigate(
              currentLayout?.name === 'auth-branded'
                ? '/auth/login'
                : '/auth/classic/login'
            );
          }, 2000);
        } else {
          // Status 0 - invalid or expired OTP
          setStatus(response.message || 'Invalid or expired OTP');
          setHasErrors(true);
          toast.error(response.message || 'Invalid or expired OTP');
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to reset password. Please try again.';
        setStatus(errorMessage);
        setHasErrors(true);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="card max-w-[370px] w-full">
      <form className="card-body flex flex-col gap-5 p-10" onSubmit={formik.handleSubmit} noValidate>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Enter OTP</h3>
          <span className="text-2sm text-gray-700">
            Enter the OTP sent to {email}
          </span>
        </div>

        {hasErrors && formik.status && (
          <Alert variant="danger">{formik.status}</Alert>
        )}

        {hasErrors === false && (
          <Alert variant="success">
            Password reset successfully! Redirecting to login...
          </Alert>
        )}

        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">OTP</label>
          <input
            className="input"
            type="text"
            placeholder="Enter OTP"
            value={formik.values.otp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="otp"
            maxLength={10}
          />
          {formik.touched.otp && formik.errors.otp && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.otp}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">New Password</label>
          <label className="input">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={formik.values.new_password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="new_password"
            />
            <button type="button" className="btn btn-icon" onClick={togglePassword}>
              <KeenIcon icon="eye" className={showPassword ? 'hidden' : 'text-gray-500'} />
              <KeenIcon icon="eye-slash" className={showPassword ? 'text-gray-500' : 'hidden'} />
            </button>
          </label>
          {formik.touched.new_password && formik.errors.new_password && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.new_password}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">Confirm Password</label>
          <label className="input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={formik.values.confirm_password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="confirm_password"
            />
            <button type="button" className="btn btn-icon" onClick={toggleConfirmPassword}>
              <KeenIcon icon="eye" className={showConfirmPassword ? 'hidden' : 'text-gray-500'} />
              <KeenIcon icon="eye-slash" className={showConfirmPassword ? 'text-gray-500' : 'hidden'} />
            </button>
          </label>
          {formik.touched.confirm_password && formik.errors.confirm_password && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.confirm_password}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-5 items-stretch">
          <button
            type="submit"
            className="btn btn-primary flex justify-center grow"
            disabled={loading || formik.isSubmitting}
          >
            {loading ? 'Please wait...' : 'Reset Password'}
          </button>

          <Link
            to={
              currentLayout?.name === 'auth-branded'
                ? '/auth/reset-password'
                : '/auth/classic/reset-password'
            }
            className="flex items-center justify-center text-sm gap-2 text-gray-700 hover:text-primary"
          >
            <KeenIcon icon="black-left" />
            Back
          </Link>
        </div>
      </form>
    </div>
  );
};

export { ResetPasswordOtp };

