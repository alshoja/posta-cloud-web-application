import countries from 'world-countries'

export const COUNTRY_NAMES: string[] = countries
  .map((country) => country.name.common)
  .sort((a, b) => a.localeCompare(b))
