import { getFlagEmoji } from './flagUtils';

export default function FlagEmoji({ countryCode, className = '', title }) {
  const emoji = getFlagEmoji(countryCode);
  if (!emoji) return null;

  const label = title || countryCode;

  return (
    <span className={className} title={label} aria-label={label}>
      {emoji}
    </span>
  );
}

