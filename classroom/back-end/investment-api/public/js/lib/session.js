const TOKEN_STORAGE_KEY = '@invest-app:token';

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);

  return atob(base64 + padding);
}

function decodeJwtPayload(token) {
  const [, encodedPayload] = token.split('.');

  if (!encodedPayload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(encodedPayload));
  } catch (error) {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function getCurrentUser() {
  const token = getToken();

  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);
  const now = Math.floor(Date.now() / 1000);

  if (!payload?.userId || !payload?.exp || payload.exp < now) {
    clearToken();
    return null;
  }

  return {
    id: payload.userId,
    name: payload.name,
    email: payload.email,
  };
}

export function getAuthHeaders() {
  const token = getToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function requireCurrentUser() {
  const user = getCurrentUser();

  if (!user) {
    window.location.replace('signin.html');
    return null;
  }

  return user;
}

export function loadMenu(activePage) {
  const navbarLinks = document.querySelector('#navbar-links');

  if (!navbarLinks) {
    return;
  }

  const user = getCurrentUser();
  const links = user
    ? [
        { page: 'home', href: 'home.html', label: 'Home' },
        { page: 'signout', href: '#', label: 'Sair' },
      ]
    : [
        { page: 'signin', href: 'signin.html', label: 'Entrar' },
        { page: 'signup', href: 'signup.html', label: 'Cadastrar' },
      ];

  navbarLinks.innerHTML = links
    .map(({ page, href, label }) => {
      const active = page === activePage ? ' active' : '';
      const ariaCurrent = page === activePage ? ' aria-current="page"' : '';
      const id = page === 'signout' ? ' id="signout-link"' : '';

      return `<li class="nav-item">
        <a${id} class="nav-link${active}"${ariaCurrent} href="${href}">
          ${label}
        </a>
      </li>`;
    })
    .join('');

  document.querySelector('#signout-link')?.addEventListener('click', (event) => {
    event.preventDefault();
    clearToken();
    window.location.href = 'signin.html';
  });
}
