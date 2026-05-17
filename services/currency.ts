export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
  locale: string;
}

const CURRENCY_MAP: Record<string, CurrencyInfo> = {
  // South Asia
  IN: { code: 'INR', symbol: '₹', rate: 85, locale: 'en-IN' },
  PK: { code: 'PKR', symbol: 'Rs', rate: 280, locale: 'en-PK' },
  BD: { code: 'BDT', symbol: '৳', rate: 110, locale: 'en-BD' },
  LK: { code: 'LKR', symbol: 'Rs', rate: 310, locale: 'en-LK' },
  NP: { code: 'NPR', symbol: 'Rs', rate: 133, locale: 'en-NP' },
  // Europe
  DE: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'de-DE' },
  FR: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'fr-FR' },
  IT: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'it-IT' },
  ES: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'es-ES' },
  NL: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'nl-NL' },
  BE: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'fr-BE' },
  AT: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'de-AT' },
  PT: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'pt-PT' },
  IE: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'en-IE' },
  FI: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'fi-FI' },
  GR: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'el-GR' },
  GB: { code: 'GBP', symbol: '£', rate: 0.79, locale: 'en-GB' },
  SE: { code: 'SEK', symbol: 'kr', rate: 10.5, locale: 'sv-SE' },
  NO: { code: 'NOK', symbol: 'kr', rate: 10.7, locale: 'nb-NO' },
  DK: { code: 'DKK', symbol: 'kr', rate: 6.9, locale: 'da-DK' },
  CH: { code: 'CHF', symbol: 'CHF', rate: 0.88, locale: 'de-CH' },
  PL: { code: 'PLN', symbol: 'zł', rate: 4, locale: 'pl-PL' },
  CZ: { code: 'CZK', symbol: 'Kč', rate: 23, locale: 'cs-CZ' },
  HU: { code: 'HUF', symbol: 'Ft', rate: 370, locale: 'hu-HU' },
  RO: { code: 'RON', symbol: 'lei', rate: 4.6, locale: 'ro-RO' },
  // Americas
  CA: { code: 'CAD', symbol: 'C$', rate: 1.37, locale: 'en-CA' },
  BR: { code: 'BRL', symbol: 'R$', rate: 5.1, locale: 'pt-BR' },
  MX: { code: 'MXN', symbol: 'MX$', rate: 17.5, locale: 'es-MX' },
  AR: { code: 'ARS', symbol: 'ARS', rate: 900, locale: 'es-AR' },
  CO: { code: 'COP', symbol: 'COP', rate: 4100, locale: 'es-CO' },
  CL: { code: 'CLP', symbol: 'CLP', rate: 950, locale: 'es-CL' },
  PE: { code: 'PEN', symbol: 'S/', rate: 3.7, locale: 'es-PE' },
  // Asia Pacific
  JP: { code: 'JPY', symbol: '¥', rate: 155, locale: 'ja-JP' },
  CN: { code: 'CNY', symbol: '¥', rate: 7.25, locale: 'zh-CN' },
  KR: { code: 'KRW', symbol: '₩', rate: 1350, locale: 'ko-KR' },
  AU: { code: 'AUD', symbol: 'A$', rate: 1.55, locale: 'en-AU' },
  NZ: { code: 'NZD', symbol: 'NZ$', rate: 1.68, locale: 'en-NZ' },
  SG: { code: 'SGD', symbol: 'S$', rate: 1.35, locale: 'en-SG' },
  MY: { code: 'MYR', symbol: 'RM', rate: 4.7, locale: 'ms-MY' },
  TH: { code: 'THB', symbol: '฿', rate: 36, locale: 'th-TH' },
  ID: { code: 'IDR', symbol: 'Rp', rate: 15800, locale: 'id-ID' },
  PH: { code: 'PHP', symbol: '₱', rate: 57, locale: 'en-PH' },
  VN: { code: 'VND', symbol: '₫', rate: 25000, locale: 'vi-VN' },
  TW: { code: 'TWD', symbol: 'NT$', rate: 32, locale: 'zh-TW' },
  HK: { code: 'HKD', symbol: 'HK$', rate: 7.8, locale: 'en-HK' },
  // Middle East
  AE: { code: 'AED', symbol: 'AED', rate: 3.67, locale: 'ar-AE' },
  SA: { code: 'SAR', symbol: 'SAR', rate: 3.75, locale: 'ar-SA' },
  QA: { code: 'QAR', symbol: 'QAR', rate: 3.64, locale: 'ar-QA' },
  KW: { code: 'KWD', symbol: 'KD', rate: 0.31, locale: 'ar-KW' },
  EG: { code: 'EGP', symbol: 'E£', rate: 31, locale: 'ar-EG' },
  TR: { code: 'TRY', symbol: '₺', rate: 32, locale: 'tr-TR' },
  IL: { code: 'ILS', symbol: '₪', rate: 3.7, locale: 'he-IL' },
  // Africa
  NG: { code: 'NGN', symbol: '₦', rate: 800, locale: 'en-NG' },
  ZA: { code: 'ZAR', symbol: 'R', rate: 18.5, locale: 'en-ZA' },
  KE: { code: 'KES', symbol: 'KSh', rate: 155, locale: 'en-KE' },
  GH: { code: 'GHS', symbol: 'GH₵', rate: 14.5, locale: 'en-GH' },
  // CIS
  RU: { code: 'RUB', symbol: '₽', rate: 92, locale: 'ru-RU' },
  UA: { code: 'UAH', symbol: '₴', rate: 41, locale: 'uk-UA' },
};

const USD_CURRENCY: CurrencyInfo = { code: 'USD', symbol: '$', rate: 1, locale: 'en-US' };

export function niceRound(amount: number): number {
  if (amount < 1) return Math.ceil(amount * 100) / 100;
  if (amount < 10) return Math.ceil(amount);
  if (amount < 50) return Math.ceil(amount / 5) * 5;
  if (amount < 200) return Math.ceil(amount / 10) * 10;
  if (amount < 1000) return Math.ceil(amount / 50) * 50;
  if (amount < 5000) return Math.ceil(amount / 100) * 100;
  if (amount < 20000) return Math.ceil(amount / 500) * 500;
  if (amount < 100000) return Math.ceil(amount / 1000) * 1000;
  return Math.ceil(amount / 5000) * 5000;
}

export function getCurrencyForCountry(countryCode: string): CurrencyInfo {
  return CURRENCY_MAP[countryCode.toUpperCase()] || USD_CURRENCY;
}

export function formatLocalPrice(usdAmount: number, currency: CurrencyInfo): string {
  if (currency.code === 'USD') return `$${usdAmount}`;
  const converted = usdAmount * currency.rate;
  const rounded = niceRound(converted);
  const formatted = rounded.toLocaleString('en-US', {
    maximumFractionDigits: rounded < 10 ? 2 : 0,
  });
  return `${currency.symbol}${formatted}`;
}

const COUNTRY_NAMES: Record<string, string> = {
  IN: 'India', PK: 'Pakistan', BD: 'Bangladesh', LK: 'Sri Lanka', NP: 'Nepal',
  DE: 'Germany', FR: 'France', IT: 'Italy', ES: 'Spain', NL: 'Netherlands',
  BE: 'Belgium', AT: 'Austria', PT: 'Portugal', IE: 'Ireland', FI: 'Finland',
  GR: 'Greece', GB: 'United Kingdom', SE: 'Sweden', NO: 'Norway', DK: 'Denmark',
  CH: 'Switzerland', PL: 'Poland', CZ: 'Czech Republic', HU: 'Hungary', RO: 'Romania',
  CA: 'Canada', BR: 'Brazil', MX: 'Mexico', AR: 'Argentina', CO: 'Colombia',
  CL: 'Chile', PE: 'Peru', US: 'United States',
  JP: 'Japan', CN: 'China', KR: 'South Korea', AU: 'Australia', NZ: 'New Zealand',
  SG: 'Singapore', MY: 'Malaysia', TH: 'Thailand', ID: 'Indonesia', PH: 'Philippines',
  VN: 'Vietnam', TW: 'Taiwan', HK: 'Hong Kong',
  AE: 'UAE', SA: 'Saudi Arabia', QA: 'Qatar', KW: 'Kuwait', EG: 'Egypt',
  TR: 'Turkey', IL: 'Israel',
  NG: 'Nigeria', ZA: 'South Africa', KE: 'Kenya', GH: 'Ghana',
  RU: 'Russia', UA: 'Ukraine',
};

export function getCountryName(countryCode: string): string {
  return COUNTRY_NAMES[countryCode.toUpperCase()] || '';
}

export async function fetchLiveRate(currencyCode: string): Promise<number | null> {
  if (currencyCode === 'USD') return 1;
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json`,
      { signal: controller.signal }
    );
    clearTimeout(tid);
    if (!res.ok) throw new Error('fail');
    const data = await res.json();
    const rate = data?.usd?.[currencyCode.toLowerCase()];
    if (typeof rate === 'number' && rate > 0) return rate;
    return null;
  } catch {
    return null;
  }
}

export async function detectCountry(): Promise<string> {
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(tid);
    if (!res.ok) throw new Error('fail');
    const data = await res.json();
    return data.country_code || 'US';
  } catch {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 3000);
      const res = await fetch('https://api.country.is/', { signal: controller.signal });
      clearTimeout(tid);
      if (!res.ok) throw new Error('fail');
      const data = await res.json();
      return data.country || 'US';
    } catch {
      return 'US';
    }
  }
}
