// Mock data for Philippine addresses.
// In a real application, this would come from an API.

export const regions = [
  { key: 'NCR', name: 'National Capital Region (NCR)' },
  { key: 'VII', name: 'Central Visayas (Region VII)' },
];

export const provinces = [
  { key: 'Metro Manila', name: 'Metro Manila', region: 'NCR' },
  { key: 'Cebu', name: 'Cebu', region: 'VII' },
];

export const cities = [
  // NCR
  { key: 'Quezon City', name: 'Quezon City', province: 'Metro Manila' },
  { key: 'Manila', name: 'Manila', province: 'Metro Manila' },
  { key: 'Makati', name: 'Makati', province: 'Metro Manila' },
  // Cebu
  { key: 'Cebu City', name: 'Cebu City', province: 'Cebu' },
  { key: 'Mandaue', name: 'Mandaue', province: 'Cebu' },
  { key: 'Lapu-Lapu', name: 'Lapu-Lapu', province: 'Cebu' },
];
