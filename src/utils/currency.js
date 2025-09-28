/**
 * Format amount to Ghana Cedis currency
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format amount to Ghana Cedis with custom symbol
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string with GH₵ symbol
 */
export const formatGhanaCedis = (amount) => {
  const formatted = new Intl.NumberFormat('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  return `GH₵ ${formatted}`;
};