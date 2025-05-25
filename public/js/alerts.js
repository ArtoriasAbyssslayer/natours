export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.remove();
};

// type is 'success' or 'error'
export const showAlert = (type, msg, time = 8) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.body.insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};
