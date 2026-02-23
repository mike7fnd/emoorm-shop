/**
 * Philippine Standard Geographic Code (PSGC) API service
 * Uses the free PSGC API at https://psgc.gitlab.io/api/
 * Provides regions, provinces, cities/municipalities, and barangays
 */

const BASE_URL = 'https://psgc.gitlab.io/api';

export interface PsgcRegion {
  code: string;
  name: string;
  regionName: string;
  islandGroupCode: string;
}

export interface PsgcProvince {
  code: string;
  name: string;
  regionCode: string;
  islandGroupCode: string;
}

export interface PsgcCityMunicipality {
  code: string;
  name: string;
  oldName: string;
  isCapital: boolean;
  isCity: boolean;
  isMunicipality: boolean;
  provinceCode: string | false;
  districtCode: string | false;
  regionCode: string;
  islandGroupCode: string;
}

export interface PsgcBarangay {
  code: string;
  name: string;
  oldName: string;
  cityCode: string | false;
  municipalityCode: string | false;
  districtCode: string | false;
  provinceCode: string;
  regionCode: string;
  islandGroupCode: string;
}

// Simple in-memory cache to avoid re-fetching
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`PSGC API error: ${response.status}`);
  }

  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data as T;
}

export const phAddressApi = {
  /**
   * Get all Philippine regions
   */
  getRegions: async (): Promise<PsgcRegion[]> => {
    const regions = await fetchWithCache<PsgcRegion[]>(`${BASE_URL}/regions/`);
    return regions.sort((a, b) => a.name.localeCompare(b.name));
  },

  /**
   * Get provinces for a given region.
   * NCR has no provinces — returns empty array.
   */
  getProvinces: async (regionCode: string): Promise<PsgcProvince[]> => {
    const provinces = await fetchWithCache<PsgcProvince[]>(
      `${BASE_URL}/regions/${regionCode}/provinces/`
    );
    return provinces.sort((a, b) => a.name.localeCompare(b.name));
  },

  /**
   * Get cities/municipalities for a province.
   */
  getCitiesMunicipalities: async (provinceCode: string): Promise<PsgcCityMunicipality[]> => {
    const cities = await fetchWithCache<PsgcCityMunicipality[]>(
      `${BASE_URL}/provinces/${provinceCode}/cities-municipalities/`
    );
    return cities.sort((a, b) => a.name.localeCompare(b.name));
  },

  /**
   * Get cities/municipalities directly from a region (for NCR and other regions without provinces).
   */
  getCitiesMunicipalitiesByRegion: async (regionCode: string): Promise<PsgcCityMunicipality[]> => {
    const cities = await fetchWithCache<PsgcCityMunicipality[]>(
      `${BASE_URL}/regions/${regionCode}/cities-municipalities/`
    );
    return cities.sort((a, b) => a.name.localeCompare(b.name));
  },

  /**
   * Get barangays for a city/municipality.
   */
  getBarangays: async (cityMunicipalityCode: string): Promise<PsgcBarangay[]> => {
    const barangays = await fetchWithCache<PsgcBarangay[]>(
      `${BASE_URL}/cities-municipalities/${cityMunicipalityCode}/barangays/`
    );
    return barangays.sort((a, b) => a.name.localeCompare(b.name));
  },

  /**
   * Check if a region is NCR (has no provinces, uses districts instead).
   */
  isNCR: (regionCode: string): boolean => {
    return regionCode === '130000000';
  },
};
