import { investments } from './data/investments.js';
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

  trashIcon.onclick = function () {
    const cardInvestment = document.querySelector(
      `#investment-${investment.id}`
    );

    cardInvestment.parentNode.remove();
  };
}

// Handle form submission
const form = document.querySelector('#investment-form');

form.onsubmit = function (event) {
  event.preventDefault();

  const name = document.querySelector('#name').value;

  const value = Math.round(Number(document.querySelector('#value').value) * 100);

  const newInvestment = {
    id: investments.length + 1,
    name,
    value
  };

  investments.push(newInvestment);
  createInvestmentCard(newInvestment);

  form.reset();
};

// Load initial investments
for (const investment of investments) {
  createInvestmentCard(investment);
}
