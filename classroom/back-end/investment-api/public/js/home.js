import { formatCurrency, formatDate } from './lib/format.js';
import {
  clearToken,
  getAuthHeaders,
  loadMenu,
  requireCurrentUser,
} from './lib/session.js';

const form = document.querySelector('#investment-form');
const grid = document.querySelector('#investment-grid');
const emptyState = document.querySelector('#empty-investments');
const closeOffcanvasButton = document.querySelector('#offcanvas-close');
const createInvestmentButton = document.querySelector('.create-investment');
const confirmRemoveButton = document.querySelector('#confirm-remove-investment');
const removeModal = new bootstrap.Modal('#removeInvestmentModal');

let investmentIdToRemove;
const currentUser = requireCurrentUser();

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    clearToken();
    window.location.href = 'signin.html';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function jsonRequest(method, body) {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => {
    const replacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };

    return replacements[character];
  });
}

function updateEmptyState() {
  emptyState.classList.toggle('d-none', grid.children.length > 0);
}

function investmentCard(investment) {
  const categoryColor = investment.category?.color ?? '#6c757d';

  return `<div class="col" id="investment-${investment.id}">
    <div class="card h-100">
      <div class="card-header d-flex align-items-center justify-content-between gap-2">
        <span class="investment-name fw-semibold">${escapeHtml(investment.name)}</span>
        <button
          type="button"
          class="card-action remove-investment"
          data-investment-id="${investment.id}"
          aria-label="Remover investimento"
        >
          <span class="icon iconamoon--trash"></span>
        </button>
      </div>
      <div class="card-body">
        <div class="mb-2">
          <span class="fw-bold">Valor:</span>
          <span>${formatCurrency(investment.amount / 100)}</span>
        </div>
        <div class="mb-2">
          <span class="fw-bold">Taxa:</span>
          <span>${escapeHtml(investment.interest)}</span>
        </div>
        <div class="mb-2">
          <span class="fw-bold">Vencimento:</span>
          <span>${formatDate(investment.dueDate)}</span>
        </div>
        <div class="mb-2">
          <span class="fw-bold">Corretora:</span>
          <span>${escapeHtml(investment.broker?.name)}</span>
        </div>
        <div>
          <span class="fw-bold">Categoria:</span>
          <span class="badge" style="background-color: ${categoryColor}">
            ${escapeHtml(investment.category?.name)}
          </span>
        </div>
      </div>
    </div>
  </div>`;
}

function loadRemoveHandler(investmentId) {
  const removeButton = document.querySelector(
    `[data-investment-id="${investmentId}"]`,
  );

  removeButton.onclick = () => {
    investmentIdToRemove = investmentId;
    removeModal.show();
  };
}

function createInvestmentCard(investment) {
  grid.insertAdjacentHTML('beforeend', investmentCard(investment));
  loadRemoveHandler(investment.id);
  updateEmptyState();
}

async function loadInvestmentCards() {
  const investments = await request('/api/investments');

  grid.innerHTML = '';

  for (const investment of investments) {
    createInvestmentCard(investment);
  }

  updateEmptyState();
}

async function loadSelectOptions() {
  const [categories, brokers] = await Promise.all([
    request('/api/categories'),
    request('/api/brokers'),
  ]);

  const categorySelect = document.querySelector('#categoryId');
  const brokerSelect = document.querySelector('#brokerId');

  for (const category of categories) {
    categorySelect.insertAdjacentHTML(
      'beforeend',
      `<option value="${category.id}">${escapeHtml(category.name)}</option>`,
    );
  }

  for (const broker of brokers) {
    brokerSelect.insertAdjacentHTML(
      'beforeend',
      `<option value="${broker.id}">${escapeHtml(broker.name)}</option>`,
    );
  }
}

createInvestmentButton.onclick = () => {
  form.reset();
  form.classList.remove('was-validated');
};

confirmRemoveButton.onclick = async () => {
  if (!investmentIdToRemove) {
    return;
  }

  await request(`/api/investments/${investmentIdToRemove}`, {
    method: 'DELETE',
  });

  document.querySelector(`#investment-${investmentIdToRemove}`)?.remove();
  investmentIdToRemove = undefined;
  removeModal.hide();
  updateEmptyState();
};

form.onsubmit = async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const formData = Object.fromEntries(new FormData(form));

  const investment = {
    name: formData.name,
    amount: Math.round(Number(formData.amount) * 100),
    interest: formData.interest,
    dueDate: formData.dueDate,
    categoryId: formData.categoryId,
    brokerId: formData.brokerId,
  };

  const createdInvestment = await request(
    '/api/investments',
    jsonRequest('POST', investment),
  );

  createInvestmentCard(createdInvestment);
  form.reset();
  form.classList.remove('was-validated');
  closeOffcanvasButton.click();
};

if (currentUser) {
  loadMenu('home');
  await loadSelectOptions();
  await loadInvestmentCards();
}
