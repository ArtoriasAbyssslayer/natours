import axios from "axios";
import { showAlert } from './alerts';
export const  signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Account created verification email sent!');
      window.setTimeout(() => {
        location.assign('/');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};



