import { investments } from './data/investments.js';
import { formatCurrency } from './lib/format.js';

const investmentGrid = document.querySelector('.investment-grid');

for (const investment of investments) {
  const card = createInvestmentCard(investment);
  investmentGrid.insertAdjacentHTML('beforeend', card);
}

function createInvestmentCard(investment) {
  return `<div class="col">
    <div class="card" id="investment-${investment.id}">
      <div class="card-header fw-bold">
        ${investment.name}
      </div>
      <div class="card-body">
        <div>
          Valor:
          <span>${formatCurrency(investment.value / 100)}</span>
        </div>
      </div>
    </div>
  </div>`
}
