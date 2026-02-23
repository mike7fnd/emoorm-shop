// Philippine address data is now fetched from the PSGC API.
// See src/lib/ph-address-api.ts for the live API integration.
// These exports are kept for backward compatibility but are empty —
// all address dropdowns now use the API directly.

export const regions: { key: string; name: string }[] = [];
export const provinces: { key: string; name: string; region: string }[] = [];
export const cities: { key: string; name: string; province: string }[] = [];
