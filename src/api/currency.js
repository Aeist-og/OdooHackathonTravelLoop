// ExchangeRate API — Free, no key needed
// https://open.er-api.com/

const BASE_URL = 'https://open.er-api.com/v6/latest';

let ratesCache = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 3600000; // 1 hour

export async function getExchangeRates(baseCurrency = 'USD') {
  const now = Date.now();
  const cacheKey = baseCurrency;

  if (ratesCache[cacheKey] && (now - cacheTimestamp) < CACHE_DURATION) {
    return ratesCache[cacheKey];
  }

  try {
    const res = await fetch(`${BASE_URL}/${baseCurrency}`);
    if (!res.ok) throw new Error('Exchange rate API error');
    const data = await res.json();
    
    ratesCache[cacheKey] = data.rates;
    cacheTimestamp = now;
    
    return data.rates;
  } catch (err) {
    console.warn('Exchange rate fetch failed:', err.message);
    return getFallbackRates(baseCurrency);
  }
}

export async function convertCurrency(amount, from, to) {
  const rates = await getExchangeRates(from);
  if (!rates || !rates[to]) return null;
  return Math.round(amount * rates[to] * 100) / 100;
}

export function getPopularCurrencies() {
  return [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  ];
}

function getFallbackRates(base) {
  const usdRates = {
    USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, INR: 83.12,
    AUD: 1.53, CAD: 1.36, CHF: 0.88, THB: 35.2, AED: 3.67,
    SGD: 1.34, KRW: 1320, CNY: 7.24, MXN: 17.15, BRL: 4.97,
  };
  if (base === 'USD') return usdRates;
  const baseRate = usdRates[base] || 1;
  const converted = {};
  Object.entries(usdRates).forEach(([k, v]) => { converted[k] = v / baseRate; });
  return converted;
}
