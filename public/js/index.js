import '@babel/polyfill';
import { login, logout } from './login.js';
import { signup } from './signup.js';
import { displayMap } from './leaflet.js';
import { updateSettings } from './updateSettings.js';
import { resetPassword } from './resetPassword.js';
import { forgotPassword } from './resetPassword.js';
import { bookTour } from './stripe.js';
import { showAlert } from './alerts';

// DOM elements
document.addEventListener('DOMContentLoaded', () => {
  const mapContainer = document.getElementById('map');
  const loginForm = document.querySelector('.form--login');
  const signupForm = document.querySelector('.form--signup');
  const accountForm = document.querySelector('.form-user-data');
  const userPasswordForm = document.querySelector('.form-user-password');
  const logOutBtn = document.querySelector('.nav__el--logout');
  const resetPasswordForm = document.getElementById('resetPasswordForm');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const bookBtn = document.getElementById('book-tour');
  if (bookBtn) {
    bookBtn.addEventListener('click', (e) => {
      e.target.textContent = 'Processing...';
      const tourId = e.target.dataset.tourId;
      bookTour(tourId);
    });
  }
  if (mapContainer) {
    const locations = JSON.parse(
      document.getElementById('map').dataset.locations,
    );
    displayMap(locations);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
    });
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      if (!email) return;
      await forgotPassword(email);
      // return to /login page
      setTimeout(() => {
        location.assign('/login');
      }, 3500);
    });
  }

  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('confirmPassword').value;
      const resetToken = document.querySelector('input[name="token"]').value;
      try {
        await resetPassword(resetToken, password, passwordConfirm);

        setTimeout(() => {
          location.assign('/login');
        }, 3500);
      } catch (err) {
        console.error(err);
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('passwordConfirm').value;
      signup(name, email, password, confirmPassword);
    });
  }
  if (logOutBtn) logOutBtn.addEventListener('click', logout);

  if (accountForm) {
    accountForm.addEventListener('submit', (e) => {
      e.preventDefault();

      //reacreate multipart form data
      const form = new FormData();
      form.append('name', document.getElementById('name').value);
      form.append('email', document.getElementById('email').value);
      form.append('photo', document.getElementById('photo').files[0]);

      updateSettings(form, 'data');
    });
  }
  if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      document.querySelector('.btn--save-password').textContent = 'Updating...';

      const passwordCurrent = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;
      await updateSettings(
        { passwordCurrent, password, passwordConfirm },
        'password',
      );

      document.querySelector('.btn--save-password').textContent =
        'Save password';
      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
    });
});

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
