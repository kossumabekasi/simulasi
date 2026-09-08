const TENORS = [3, 4, 5, 6, 10, 12];
const RATE = 0.012;
const CONTENT = {
  murabahah: { eyebrow: 'Akad jual beli', title: 'Simulasi Murabahah', description: 'Masukkan harga barang untuk melihat estimasi pembayaran pada setiap pilihan jangka waktu.', label: 'Harga barang', summary: 'Harga barang' },
  qardhul: { eyebrow: 'Khusus biaya pendidikan', title: 'Simulasi Qardhul Hasan', description: 'Pembiayaan kebajikan tanpa margin untuk membantu memenuhi kebutuhan biaya pendidikan.', label: 'Nominal pembiayaan', summary: 'Biaya pendidikan' },
  rahn: { eyebrow: 'Akad gadai syariah', title: 'Simulasi Rahn', description: 'Pilih berat Logam Mulia Antam dan masa Rahn. Nilai pembiayaan dihitung otomatis dari 90% harga buyback terbaru.', summary: 'Pembiayaan yang bisa cair' }
};

let akad = 'murabahah';
let goldPrice = null;
let goldPriceDate = '';
const $ = selector => document.querySelector(selector);
const form = $('#simulation-form');
const input = $('#amount');
const results = $('#results');
const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const number = new Intl.NumberFormat('id-ID');
const money = value => rupiah.format(Math.round(value));
const parse = value => Number(value.replace(/\D/g, '')) || 0;
const roundMonthly = value => Math.ceil(value / 1000) * 1000;

function roundFinancing(value) {
  const millions = Math.floor(value / 1_000_000);
  const remainder = value % 1_000_000;
  if (remainder <= 300_000) return millions * 1_000_000;
  if (remainder < 800_000) return millions * 1_000_000 + 500_000;
  return (millions + 1) * 1_000_000;
}

async function loadGoldPrice() {
  const status = $('#price-status');
  try {
    const response = await fetch(`data/gold-price.json?v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Data harga tidak tersedia');
    const data = await response.json();
    if (!Number.isFinite(data.buyback_per_gram) || data.buyback_per_gram <= 0) throw new Error('Data harga tidak valid');
    goldPrice = data.buyback_per_gram;
    goldPriceDate = data.updated_at || '';
    const dateLabel = goldPriceDate ? new Date(goldPriceDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' }) : 'terbaru';
    status.innerHTML = `Harga buyback: <strong>${money(goldPrice)}/gram</strong><br><small>Diperbarui ${dateLabel} WIB</small>`;
    status.classList.remove('price-error');
  } catch (error) {
    goldPrice = null;
    status.textContent = 'Harga buyback belum tersedia. Silakan coba beberapa saat lagi.';
    status.classList.add('price-error');
  }
}

function calculateStandard(amount, tenor) {
  const margin = akad === 'murabahah' ? Math.round(amount * RATE * tenor) : 0;
  const total = amount + margin;
  return { margin, total, monthly: roundMonthly(total / tenor) };
}

function renderStandard(amount) {
  $('#result-body').innerHTML = TENORS.map(tenor => {
    const data = calculateStandard(amount, tenor);
    return `<tr><td>${tenor} bulan</td><td>${money(amount)}</td><td>${money(data.margin)}</td><td>${money(data.total)}</td><td>${money(data.monthly)}</td></tr>`;
  }).join('');
  $('#tenor-cards').innerHTML = TENORS.map(tenor => {
    const data = calculateStandard(amount, tenor);
    return `<article class="tenor-card"><div class="tenor-card-top"><span class="tenor-badge">${tenor} bulan</span><div class="monthly"><small>Cicilan / bulan</small><strong>${money(data.monthly)}</strong></div></div><div class="card-row"><span>Pokok pembiayaan</span><strong>${money(amount)}</strong></div><div class="card-row"><span>Margin</span><strong>${money(data.margin)}</strong></div><div class="card-row"><span>Total pembayaran</span><strong>${money(data.total)}</strong></div></article>`;
  }).join('');
}

function rahnData(amount, tenor, scheme) {
  const installment = amount / tenor;
  let remaining = amount;
  let totalUjrah = 0;
  let rows = '';
  for (let month = 1; month <= tenor; month += 1) {
    const ujrah = Math.round(remaining * RATE);
    const principal = scheme === 'installment' ? (month === tenor ? remaining : installment) : (month === tenor ? amount : 0);
    totalUjrah += ujrah;
    rows += `<tr><td>Angsuran ke-${month}</td><td>${money(principal)}</td><td>${money(ujrah)}</td><td>${money(principal + ujrah)}</td></tr>`;
    if (scheme === 'installment') remaining = Math.max(0, remaining - principal);
  }
  return { rows, totalUjrah, total: amount + totalUjrah };
}

function rahnTable(amount, tenor, scheme) {
  const data = rahnData(amount, tenor, scheme);
  const title = scheme === 'installment' ? 'Skema pokok diangsur' : 'Skema ujrah bulanan';
  const note = scheme === 'installment' ? 'Ujrah menurun mengikuti sisa pokok' : 'Pokok dilunasi pada bulan terakhir';
  return `<div class="rahn-table-card"><div class="scheme-title"><span>${title}</span><small>${note}</small></div><div class="table-wrap"><table><thead><tr><th>Jatuh tempo</th><th>Pengembalian pokok</th><th>Ujrah</th><th>Total dibayar</th></tr></thead><tbody>${data.rows}<tr class="total-row"><td>Total</td><td>${money(amount)}</td><td>${money(data.totalUjrah)}</td><td>${money(data.total)}</td></tr></tbody></table></div></div>`;
}

function renderRahn(amount, weight, rawValue) {
  const tenor = Number($('#rahn-tenor').value);
  $('#gold-valuation').innerHTML = `<div><small>Nilai buyback ${number.format(weight)} gram</small><strong>${money(weight * goldPrice)}</strong></div><span>× 90%</span><div><small>Hasil sebelum pembulatan</small><strong>${money(rawValue)}</strong></div><span>→</span><div class="valuation-result"><small>Pembiayaan yang bisa cair</small><strong>${money(amount)}</strong></div>`;
  $('#rahn-meta').innerHTML = `<span><small>Barang gadai</small><strong>LM Antam ${number.format(weight)} gram</strong></span><span><small>Masa Rahn</small><strong>${tenor} bulan</strong></span>`;
  $('#scheme-installment').innerHTML = rahnTable(amount, tenor, 'installment');
  $('#scheme-ujrah-only').innerHTML = rahnTable(amount, tenor, 'ujrah-only');
}

function setAkad(value) {
  akad = value;
  const content = CONTENT[value];
  document.querySelectorAll('.akad-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.akad === value));
  $('#intro-eyebrow').textContent = content.eyebrow;
  $('#form-title').textContent = content.title;
  $('#intro-description').textContent = content.description;
  $('#item-field').hidden = value !== 'rahn';
  $('#tenor-field').hidden = value !== 'rahn';
  $('#amount-input-group').hidden = value === 'rahn';
  if (value !== 'rahn') $('#amount-label').textContent = content.label;
  input.placeholder = '10.000.000';
  input.value = '';
  results.hidden = true;
}

document.querySelectorAll('.akad-tab').forEach(tab => tab.addEventListener('click', () => setAkad(tab.dataset.akad)));
document.querySelectorAll('.scheme-button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.scheme-button').forEach(item => item.classList.toggle('active', item === button));
  $('#scheme-installment').hidden = button.dataset.scheme !== 'installment';
  $('#scheme-ujrah-only').hidden = button.dataset.scheme !== 'ujrah-only';
}));

input.addEventListener('input', () => {
  const value = parse(input.value);
  input.value = value ? number.format(value) : '';
  $('#amount-error').textContent = '';
  $('#amount-wrap').classList.remove('invalid');
});

form.addEventListener('submit', event => {
  event.preventDefault();
  let amount;
  let weight = 0;
  let rawValue = 0;

  if (akad === 'rahn') {
    if (!goldPrice) {
      $('#price-status').textContent = 'Harga buyback belum tersedia. Muat ulang halaman lalu coba lagi.';
      $('#price-status').classList.add('price-error');
      return;
    }
    weight = Number($('#gold-weight').value);
    rawValue = weight * goldPrice * 0.9;
    amount = roundFinancing(rawValue);
  } else {
    amount = parse(input.value);
    if (amount < 1000) {
      $('#amount-error').textContent = 'Masukkan nominal minimal Rp1.000.';
      $('#amount-wrap').classList.add('invalid');
      results.hidden = true;
      input.focus();
      return;
    }
  }

  const isRahn = akad === 'rahn';
  $('#result-title').textContent = isRahn ? 'Rincian Pembayaran Rahn' : 'Perkiraan Pembayaran';
  $('#summary-label').textContent = CONTENT[akad].summary;
  $('#summary-amount').textContent = money(amount);
  $('#standard-results').hidden = isRahn;
  $('#rahn-results').hidden = !isRahn;
  isRahn ? renderRahn(amount, weight, rawValue) : renderStandard(amount);
  results.hidden = false;
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

$('#year').textContent = new Date().getFullYear();
loadGoldPrice();
