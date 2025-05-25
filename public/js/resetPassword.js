import axios from 'axios';
import { showAlert } from './alerts';
export const resetPassword = async (resetToken, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${resetToken}`,
      data: {
        password,
        passwordConfirm,
      },
    });
    if (password !== passwordConfirm) {
      showAlert('error', 'Passwords do not match!');
      return;
    }
    if (res.data.status === 'success') {
      showAlert('success', 'Password reset successfully!');
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Something went wrong!');
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: { email },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Check your email for the reset link');
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Something went wrong!');
  }
};
