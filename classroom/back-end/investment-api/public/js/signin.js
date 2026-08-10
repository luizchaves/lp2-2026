import { loadMenu, setToken } from './lib/session.js';

const form = document.querySelector('#signin-form');
const feedback = document.querySelector('#signin-feedback');

function showFeedback(message) {
  feedback.textContent = message;
  feedback.classList.remove('d-none');
  feedback.classList.add('alert-danger');
}

loadMenu('signin');

form.onsubmit = async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const credentials = Object.fromEntries(new FormData(form));

  const response = await fetch('/api/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const { token } = await response.json();

    setToken(token);
    window.location.href = 'home.html';
  } else {
    showFeedback('Email ou senha inválidos.');
  }
};
