import { format } from 'date-fns';
import { format as formatTz } from 'date-fns-tz';
import { enUS as en, es, ptBR, fr, de, ja, ko } from 'date-fns/locale';

let currentLocale = 'en';

function init(locale) {
  // Intl API requires locales to use hyphens instead of underscores eg. en-US, pt-BR
  currentLocale = locale?.replace('_', '-');
}

function getCurrentDateLocale() {
  switch (currentLocale) {
    case 'en':
      return en;
    case 'es':
      return es;
    case 'fr':
      return fr;
    case 'de':
      return de;
    case 'pt-BR':
      return ptBR;
    case 'kr':
      return ko;
    case 'ja':
      return ja;
    default:
      return en;
  }
}

function formatCurrency(
  value,
  {
    currency = 'USD',
    maximumFractionDigits = null,
    locale,
    removeCurrencyCodeFormatting = false,
  } = {}
) {
  const options = { style: 'currency', currency };
  if (Number.isInteger(maximumFractionDigits)) {
    options.maximumFractionDigits = maximumFractionDigits;
    if (maximumFractionDigits === 0)
      options.minimumFactionDigits = maximumFractionDigits;
  }
  if (removeCurrencyCodeFormatting) {
    options.currencyDisplay = 'narrowSymbol';
  }
  return Intl.NumberFormat(locale || currentLocale, options).format(value);
}

function formatPercentage(value) {
  return Intl.NumberFormat(currentLocale, { style: 'percent' }).format(value);
}

function formatNumber(value = 0, { notation, compactDisplay } = {}) {
  const options = { notation, compactDisplay };
  return Intl.NumberFormat(currentLocale, {
    style: 'decimal',
    ...options,
  }).format(value);
}

function formatDate(date, formatString = 'MMM dd') {
  return format(date, formatString, { locale: getCurrentDateLocale() });
}

function formatTimezone(date, timeZone) {
  const currentTimezone =
    timeZone || Intl?.DateTimeFormat().resolvedOptions().timeZone;
  return formatTz(date, 'zzz', {
    locale: getCurrentDateLocale(),
    timeZone: currentTimezone,
  });
}

const I18NFormatter = {
  init,
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatDate,
  formatTimezone,
};

export default I18NFormatter;
