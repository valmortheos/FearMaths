/**
 * helpers.js — Utility Helper Functions
 */

/**
 * Formats a number to max 2 decimal places if needed.
 * @param {number} num
 * @returns {string}
 */
export function formatNumberDisplay(num) {
  if (Number.isInteger(num)) return num.toString();
  return num.toFixed(2);
}

/**
 * Formats date string to local Indonesian format.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
