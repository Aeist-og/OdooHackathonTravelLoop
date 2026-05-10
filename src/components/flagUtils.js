const COUNTRY_CODE_TO_EMOJI = {
  // Common hackathon/demo subset (extend as needed)
  IN: '🇮🇳',
  US: '🇺🇸',
  GB: '',
  UK: '',

  FR: '🇫🇷',
  DE: '🇩🇪',
  ES: '🇪🇸',
  IT: '🇮🇹',
  NL: '🇳🇱',
  BE: '🇧🇪',
  PT: '🇵🇹',
  GR: '🇬🇷',
  TR: '🇹🇷',
  CA: '🇨🇦',
  MX: '🇲🇽',
  BR: '🇧🇷',
  AR: '🇦🇷',
  CL: '🇨🇱',
  CO: '🇨🇴',
  PE: '🇵🇪',
  AU: '🇦🇺',
  NZ: '🇳🇿',
  SG: '🇸🇬',
  MY: '🇲🇾',
  TH: '🇹🇭',
  ID: '🇮🇩',
  PH: '🇵🇭',
  VN: '🇻🇳',
  JP: '🇯🇵',
  CN: '🇨🇳',
  KR: '🇰🇷',
  TW: '🇹🇼',
  HK: '🇭🇰',
  AE: '',

  SA: '🇸🇦',
  IL: '🇮🇱',
  EG: '🇪🇬',
  ZA: '🇿🇦',
  NG: '🇳🇬',
  KE: '🇰🇪',
  ET: '🇪🇹',
  SE: '🇸🇪',
  NO: '🇳🇴',
  DK: '🇩🇰',
  FI: '🇫🇮',
  PL: '🇵🇱',
  CZ: '🇨🇿',
  HU: '🇭🇺',
  RO: '🇷🇴',
  BG: '🇧🇬',
  CH: '🇨🇭',
  AT: '🇦🇹',
  IE: '🇮🇪',
  IS: '🇮🇸',
  IE1: '🇮🇪'
};

function toFlagEmojiFromCountryCode(code) {
  if (!code || typeof code !== 'string') return '';
  const upper = code.toUpperCase();

  if (COUNTRY_CODE_TO_EMOJI[upper]) return COUNTRY_CODE_TO_EMOJI[upper];

  // Generic conversion: takes A-Z 2-letter ISO country codes.
  // Regional indicator symbols: Unicode offset 0x1F1E6 - 'A'
  if (upper.length !== 2) return '';

  const A = 0x1F1E6;
  const first = upper.charCodeAt(0) - 65;
  const second = upper.charCodeAt(1) - 65;
  if (first < 0 || first > 25 || second < 0 || second > 25) return '';

  return String.fromCodePoint(A + first, A + second);
}

export function getFlagEmoji(countryCode, fallback = '') {
  const emoji = toFlagEmojiFromCountryCode(countryCode);
  return emoji || fallback;
}



