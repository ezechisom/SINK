// Delivery configuration, motor park locations, and discount rules

export const STATE_MOTOR_PARKS: Record<string, string[]> = {
  'Abuja': ['Utako', 'Gwagwalada'],
  'Federal Capital Territory (Abuja)': ['Utako', 'Gwagwalada'],
  'Abia': ['Umuahia', 'Aba'],
  'Anambra': ['Onitsha', 'Awka'],
  'Cross River': ['Calabar'],
  'Delta': ['Warri', 'Sapele', 'Ughelli', 'Asaba', 'Abraka'],
  'Imo': ['Owerri'],
  'Oyo': ['Challenge', 'Iwo Road', 'Ojoo'],
  'Oyo (Ibadan)': ['Challenge', 'Iwo Road', 'Ojoo'],
  'Rivers': ['Rumuokoro', 'Waterline'],
};

/**
 * Returns predefined commercial motor parks for a given Nigerian state.
 * Always returns a list of terminals so users never need to enter an address.
 */
export function getMotorParksForState(stateName: string): string[] {
  if (!stateName) return ['Central Motor Park Terminal'];
  const normalized = stateName.toLowerCase().trim();

  if (normalized.includes('abuja') || normalized.includes('fct') || normalized.includes('federal capital')) {
    return ['Utako', 'Gwagwalada'];
  }
  if (normalized.includes('abia')) {
    return ['Umuahia', 'Aba'];
  }
  if (normalized.includes('anambra')) {
    return ['Onitsha', 'Awka'];
  }
  if (normalized.includes('cross river')) {
    return ['Calabar'];
  }
  if (normalized.includes('delta')) {
    return ['Warri', 'Sapele', 'Ughelli', 'Asaba', 'Abraka'];
  }
  if (normalized.includes('imo')) {
    return ['Owerri'];
  }
  if (normalized.includes('oyo') || normalized.includes('ibadan')) {
    return ['Challenge', 'Iwo Road', 'Ojoo'];
  }
  if (normalized.includes('rivers') || normalized.includes('port harcourt')) {
    return ['Rumuokoro', 'Waterline'];
  }
  if (normalized.includes('lagos')) {
    return ['Ojota Central Park', 'Mazamaza Park', 'Iyana Ipaja Park', 'Jibowu Terminal'];
  }
  if (normalized.includes('kano')) {
    return ['Sabon Gari Central Park', 'Naibawa Park'];
  }
  if (normalized.includes('kaduna')) {
    return ['Mando Park', 'Command Junction Terminal'];
  }
  if (normalized.includes('enugu')) {
    return ['Holy Ghost Park', 'Old Park', 'Gariki Park'];
  }
  if (normalized.includes('edo')) {
    return ['Ring Road Central Park', 'Oluku Terminal'];
  }
  // Fallback for any other state in Nigeria:
  return [`${stateName.trim()} Central State Park`, `${stateName.trim()} Main Commercial Terminal`];
}

/**
 * Checks if the state is Lagos
 */
export function isLagosState(stateName: string): boolean {
  if (!stateName) return false;
  return stateName.toLowerCase().trim().includes('lagos');
}

/**
 * Calculates Doorstep Delivery Extra Fee
 * - ₦0 for Lagos residents (Free Home Delivery!)
 * - ₦5,000 for Doorstep Delivery outside Lagos
 * - ₦0 for Motor Park Delivery anywhere in Nigeria
 */
export function calculateDoorstepFee(stateName: string, deliveryMethod: string): number {
  if (deliveryMethod !== 'Doorstep Delivery') return 0;
  if (isLagosState(stateName)) return 0; // Not applicable to people in Lagos
  return 5000;
}

/**
 * Multi-Unit Discount for customers buying more than 1 smart lock:
 * User requirement: "THE DISCOUNT FOR MULTIPLE ITEM IS 5K NOT 15K"
 * - 1 unit: ₦0 discount
 * - 2 units: ₦5,000 discount
 * - 3 units: ₦10,000 discount (₦5,000 per additional unit)
 * - N units: (N - 1) * ₦5,000 discount
 */
export function calculateMultiUnitDiscount(quantity: number): number {
  if (quantity <= 1) return 0;
  return (quantity - 1) * 5000;
}
