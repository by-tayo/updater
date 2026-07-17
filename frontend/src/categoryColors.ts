// Fixed categorical order matching config.py's CATEGORIES dict -- never
// reassigned/cycled per-render, per the dataviz color-formula rule.
const ORDER = ['cybersecurity', 'cloud', 'devsecops', 'sysadmin', 'ai', 'finance-personal', 'finance-markets'];

const SLOT_VARS = ['--cat-1', '--cat-2', '--cat-3', '--cat-4', '--cat-5', '--cat-6', '--cat-7'];

export function categoryColorVar(key: string): string {
  const idx = ORDER.indexOf(key);
  return `var(${SLOT_VARS[idx >= 0 ? idx : 0]})`;
}
