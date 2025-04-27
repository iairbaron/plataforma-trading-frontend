/**
 * Formatea un número como precio con separador de miles y dos decimales
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Formatea cantidades de criptomonedas adaptando los decimales según la magnitud
 */
export const formatCryptoAmount = (amount: number, decimals = 8): string => {
  const num = Number(amount) || 0;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
    useGrouping: true,
  });
}; 