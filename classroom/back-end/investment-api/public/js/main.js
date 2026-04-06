import { formatCurrency } from './lib/format.js';

function createInvestmentCard(investment) {
  const cardInvestment = `<div class="col">
    <div id="investment-${investment.id}" class="card">
      <div class="card-header">
        ${investment.name}
        <span class="icon iconamoon--trash float-end"></span>
      </div>
      <div class="card-body">
        <p class="card-text">
          Valor: ${formatCurrency(investment.value / 100)}
        </p>
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

// Handle form submission
const form = document.querySelector('#investment-form');

form.onsubmit = async function (event) {
  event.preventDefault();

  const name = document.querySelector('#name').value;

  const value = Math.round(Number(document.querySelector('#value').value) * 100);

  const response = await fetch('/api/investments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, value }),
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
