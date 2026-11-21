import countries from 'world-countries';

export interface CountryOption {
  name: string;
  code: string; // cca2, e.g. "TN" — فريد لكل دولة
  dialCode: string; // e.g. "+216" — ممكن يتكرر بين أكتر من دولة
}

export const countryList: CountryOption[] = countries
  .map((c) => {
    const root = c.idd?.root || '';
    const suffix = c.idd?.suffixes?.[0] || '';
    return {
      name: c.name.common,
      code: c.cca2,
      dialCode: root ? `${root}${suffix}` : ''
    };
  })
  .filter((c) => c.dialCode)
  .sort((a, b) => a.name.localeCompare(b.name));