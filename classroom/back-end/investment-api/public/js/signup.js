import { loadMenu } from './lib/session.js';

const form = document.querySelector('#signup-form');
const feedback = document.querySelector('#signup-feedback');
const confirmationPassword = document.querySelector('#confirmationPassword');

function showFeedback(message, isError = true) {
  feedback.textContent = message;
  feedback.classList.remove('d-none', 'alert-success', 'alert-danger');
  feedback.classList.add(isError ? 'alert-danger' : 'alert-success');
}

function validatePasswordConfirmation() {
  const passwordsMatch = form.password.value === confirmationPassword.value;

  confirmationPassword.setCustomValidity(
    passwordsMatch ? '' : 'As senhas não são iguais.',
  );

  return passwordsMatch;
}

confirmationPassword.oninput = validatePasswordConfirmation;
form.password.oninput = validatePasswordConfirmation;

loadMenu('signup');

form.onsubmit = async (event) => {
  event.preventDefault();

  validatePasswordConfirmation();

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const user = {
    name: form.name.value,
    email: form.email.value,
    password: form.password.value,
  };

  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (response.ok) {
    showFeedback('Usuário cadastrado com sucesso.', false);
    form.reset();
    window.location.href = 'signin.html';
  } else {
    showFeedback('Não foi possível cadastrar o usuário.');
  }
};
