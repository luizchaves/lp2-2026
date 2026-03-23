import { investments } from './data/investments.js';
import { formatCurrency } from './lib/format.js';

const investmentGrid = document.querySelector('.investment-grid');

for (const investment of investments) {
  const card = createInvestmentCard(investment);
  investmentGrid.insertAdjacentHTML('beforeend', card);
}

investmentGrid.addEventListener('click', (event) => {
  if (event.target.closest('.btn-remove')) {
    const col = event.target.closest('.col');
    col.remove();
  }
});

function createInvestmentCard(investment) {
  return `<div class="col">
    <div class="card" id="investment-${investment.id}">
      <div class="card-header fw-bold d-flex justify-content-between align-items-center">
        <span>${investment.name}</span>
        <svg class="btn-remove" role="button" style="cursor: pointer;" title="Remover investimento" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
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
