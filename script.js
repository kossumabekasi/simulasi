const TENORS = [3, 4, 5, 6, 10, 12];
const MONTHLY_MARGIN = 0.012;

const form = document.querySelector('#simulation-form');
const input = document.querySelector('#amount');
const amountWrap = document.querySelector('#amount-wrap');
const errorMessage = document.querySelector('#amount-error');
const results = document.querySelector('#results');
const tableBody = document.querySelector('#result-body');
const cards = document.querySelector('#tenor-cards');
const summaryAmount = document.querySelector('#summary-amount');

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});

function parseAmount(value) {
  return Number(value.replace(/\D/g, '')) || 0;
}

function formatInput(value) {
  const amount = parseAmount(value);
  return amount ? new Intl.NumberFormat('id-ID').format(amount) : '';
}

function calculate(amount, tenor) {
  const margin = Math.round(amount * MONTHLY_MARGIN * tenor);
  const total = amount + margin;
  const monthly = Math.ceil(total / tenor);
  return { margin, total, monthly };
}

function tableRow(amount, tenor) {
  const { margin, total, monthly } = calculate(amount, tenor);
  return `<tr>
    <td>${tenor} bulan</td>
    <td>${rupiah.format(amount)}</td>
    <td>${rupiah.format(margin)}</td>
    <td>${rupiah.format(total)}</td>
    <td>${rupiah.format(monthly)}</td>
  </tr>`;
}

function tenorCard(amount, tenor) {
  const { margin, total, monthly } = calculate(amount, tenor);
  return `<article class="tenor-card">
    <div class="tenor-card-top">
      <span class="tenor-badge">${tenor} bulan</span>
      <div class="monthly"><small>Cicilan / bulan</small><strong>${rupiah.format(monthly)}</strong></div>
    </div>
    <div class="card-row"><span>Pokok pembiayaan</span><strong>${rupiah.format(amount)}</strong></div>
    <div class="card-row"><span>Margin</span><strong>${rupiah.format(margin)}</strong></div>
    <div class="card-row"><span>Total pembayaran</span><strong>${rupiah.format(total)}</strong></div>
  </article>`;
}

function showError(message) {
  errorMessage.textContent = message;
  amountWrap.classList.toggle('invalid', Boolean(message));
  input.setAttribute('aria-invalid', Boolean(message).toString());
}

input.addEventListener('input', () => {
  input.value = formatInput(input.value);
  showError('');
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const amount = parseAmount(input.value);

  if (amount < 1000) {
    showError('Masukkan nominal minimal Rp1.000.');
    results.hidden = true;
    input.focus();
    return;
  }

  showError('');
  summaryAmount.textContent = rupiah.format(amount);
  tableBody.innerHTML = TENORS.map((tenor) => tableRow(amount, tenor)).join('');
  cards.innerHTML = TENORS.map((tenor) => tenorCard(amount, tenor)).join('');
  results.hidden = false;
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('#year').textContent = new Date().getFullYear();
