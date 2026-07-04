const form = document.querySelector('#register-form');
const feedback = document.querySelector('#register-feedback');

function showFeedback(message, isError) {
  feedback.textContent = message;
  feedback.classList.remove('d-none', 'alert-success', 'alert-danger');
  feedback.classList.add(isError ? 'alert-danger' : 'alert-success');
}

form.onsubmit = async function (event) {
  event.preventDefault();

  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const confirmPassword = document.querySelector('#confirmPassword').value;

  if (password !== confirmPassword) {
    showFeedback('As senhas não coincidem.', true);
    return;
  }

  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (response.ok) {
    showFeedback('Usuário cadastrado com sucesso!', false);
    form.reset();
  } else {
    showFeedback('Não foi possível cadastrar o usuário.', true);
  }
};
