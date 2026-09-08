import { readFile, writeFile } from 'node:fs/promises';

const SOURCE_URL = 'https://www.logammulia.com/sell/gold';
const DATA_PATH = new URL('../data/gold-price.json', import.meta.url);

const response = await fetch(SOURCE_URL, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; KossumaPriceUpdater/1.0)',
    'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8'
  }
});

if (!response.ok) throw new Error(`Antam membalas HTTP ${response.status}`);
const html = await response.text();
const plainText = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ');
const match = plainText.match(/(?:Harga\s+Buyback|Buyback)\s*:?\s*Rp\s*([\d.,]+)/i);
if (!match) throw new Error('Harga buyback tidak ditemukan pada halaman resmi Antam');

const price = Number(match[1].replace(/\D/g, ''));
if (!Number.isFinite(price) || price < 100000 || price > 10000000) throw new Error(`Harga buyback tidak wajar: ${price}`);

let previous = {};
try { previous = JSON.parse(await readFile(DATA_PATH, 'utf8')); } catch {}
if (previous.buyback_per_gram && Math.abs(price - previous.buyback_per_gram) / previous.buyback_per_gram > 0.15) {
  throw new Error(`Perubahan harga lebih dari 15%; pembaruan dibatalkan (${previous.buyback_per_gram} -> ${price})`);
}

await writeFile(DATA_PATH, `${JSON.stringify({ buyback_per_gram: price, updated_at: new Date().toISOString(), source: SOURCE_URL }, null, 2)}\n`);
console.log(`Harga buyback diperbarui: Rp${price.toLocaleString('id-ID')}/gram`);
