import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { detectCountry, getCurrencyForCountry, fetchLiveRate, formatLocalPrice, getCountryName, CurrencyInfo } from '../services/currency';

interface CurrencyContextType {
  currency: CurrencyInfo;
  countryCode: string;
  countryName: string;
  formatPrice: (usdAmount: number) => string;
  isLoading: boolean;
}

const defaultCurrency: CurrencyInfo = { code: 'USD', symbol: '$', rate: 1, locale: 'en-US' };

const CurrencyContext = createContext<CurrencyContextType>({
  currency: defaultCurrency,
  countryCode: 'US',
  countryName: '',
  formatPrice: (amount: number) => `$${amount}`,
  isLoading: true,
});

export const useCurrency = () => useContext(CurrencyContext);

// Set to true to enable local currency conversion
const USE_LOCAL_CURRENCY = false;

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyInfo>(defaultCurrency);
  const [countryCode, setCountryCode] = useState('US');
  const [countryName, setCountryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const code = await detectCountry();
      setCountryCode(code);
      setCountryName(getCountryName(code));

      if (USE_LOCAL_CURRENCY) {
        const fallback = getCurrencyForCountry(code);
        const liveRate = await fetchLiveRate(fallback.code);
        if (liveRate !== null) {
          setCurrency({ ...fallback, rate: liveRate });
        } else {
          setCurrency(fallback);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const formatPrice = useCallback(
    (usdAmount: number) => formatLocalPrice(usdAmount, currency),
    [currency]
  );

  return (
    <CurrencyContext.Provider value={{ currency, countryCode, countryName, formatPrice, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
};
