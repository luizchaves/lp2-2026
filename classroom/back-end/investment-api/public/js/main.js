import { formatCurrency } from './lib/format.js';

function createInvestmentCard(investment) {
  const cardInvestment = `<div class="col">
    <div id="investment-${investment.id}" class="card h-100 position-relative">
      <span class="icon iconamoon--trash position-absolute top-0 end-0 m-2"></span>
      <div class="card-body">
        <h5 class="card-title fw-bold mb-1">${investment.name}</h5>
        <span class="badge mb-3" style="background-color: ${investment.category?.color ?? '#aaa'}">${investment.category?.name ?? ''}</span>
        <p class="card-text mb-1">Valor: <strong>${formatCurrency(investment.amount / 100)}</strong></p>
        <p class="card-text mb-1">Juros: ${investment.interest}</p>
        <p class="card-text text-muted">Corretora: ${investment.broker?.name ?? ''}</p>
      </div>
    </div>
  </div>`;

  const investmentsGrid = document.querySelector('.investments-grid');

  investmentsGrid.insertAdjacentHTML('beforeend', cardInvestment);

  const trashIcon = document.querySelector(
    `#investment-${investment.id} .icon`
  );

  trashIcon.onclick = async function () {
    const response = await fetch(`/api/investments/${investment.id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      const cardInvestment = document.querySelector(
        `#investment-${investment.id}`
      );

      cardInvestment.parentNode.remove();
    }
  };
}

// Load categories and brokers into selects
const [categoriesRes, brokersRes] = await Promise.all([
  fetch('/api/categories'),
  fetch('/api/brokers'),
]);

const categories = await categoriesRes.json();
const brokers = await brokersRes.json();

const categorySelect = document.querySelector('#categoryId');
for (const category of categories) {
  categorySelect.insertAdjacentHTML(
    'beforeend',
    `<option value="${category.id}">${category.name}</option>`
  );
}

const brokerSelect = document.querySelector('#brokerId');
for (const broker of brokers) {
  brokerSelect.insertAdjacentHTML(
    'beforeend',
    `<option value="${broker.id}">${broker.name}</option>`
  );
}

// Handle form submission
const form = document.querySelector('#investment-form');

form.onsubmit = async function (event) {
  event.preventDefault();

  const name = document.querySelector('#name').value;
  const amount = Math.round(Number(document.querySelector('#amount').value) * 100);
  const interest = document.querySelector('#interest').value;
  const dueDate = document.querySelector('#dueDate').value;
  const categoryId = document.querySelector('#categoryId').value;
  const brokerId = document.querySelector('#brokerId').value;

  const response = await fetch('/api/investments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, amount, interest, dueDate, categoryId, brokerId }),
  });

  if (response.ok) {
    const newInvestment = await response.json();

    createInvestmentCard(newInvestment);

    form.reset();
  }
};

// Load initial investments
const response = await fetch('/api/investments');

const investments = await response.json();

for (const investment of investments) {
  createInvestmentCard(investment);
}
