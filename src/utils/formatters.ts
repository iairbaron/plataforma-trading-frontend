/**
 * Formatea un número como precio con separador de miles y dos decimales
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Formatea cantidades de criptomonedas adaptando los decimales según la magnitud
 */
export const formatCryptoAmount = (amount: number): string => {
  // Para cantidades enteras o muy pequeñas
  if (amount >= 1) {
    return amount.toFixed(2);
  } else if (amount >= 0.001) {
    return amount.toFixed(3);
  } else if (amount >= 0.00001) {
    return amount.toFixed(4); // Máximo 4 decimales como solicitado
  } else {
    // Para valores extremadamente pequeños, usamos notación científica
    return amount.toExponential(2);
  }
}; 