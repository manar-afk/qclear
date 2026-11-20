export interface HouseholdProfile {
  id: string;
  nameEn: string;
  nameHi: string;
  locationName: string;
  lat: number;
  lon: number;
  members: {
    hasToddler: boolean;
    hasElderly: boolean;
    hasRespiratorySensitivity: boolean;
  };
  commuteMode: 'two_wheeler' | 'car' | 'transit' | 'remote';
  commuteMinutes: number;
  homeSetup: {
    hasPurifier: boolean;
    crossVentilation: boolean;
    cookingFuel: 'lpg_gas' | 'electric_induction' | 'biomass';
  };
  communityRole: 'family' | 'school' | 'rwa';
}

export const DEMO_PRESETS: HouseholdProfile[] = [
  {
    id: 'toddler_elderly_family',
    nameEn: 'Family with Toddler & Elderly',
    nameHi: 'छोटे बच्चे और बुजुर्गों वाला परिवार',
    locationName: 'Anand Vihar, New Delhi',
    lat: 28.6469,
    lon: 77.3160,
    members: {
      hasToddler: true,
      hasElderly: true,
      hasRespiratorySensitivity: true,
    },
    commuteMode: 'two_wheeler',
    commuteMinutes: 45,
    homeSetup: {
      hasPurifier: false,
      crossVentilation: true,
      cookingFuel: 'lpg_gas',
    },
    communityRole: 'family',
  },
  {
    id: 'school_rwa_community',
    nameEn: 'School / RWA Administrator',
    nameHi: 'स्कूल एवं आरडब्ल्यूए (RWA) प्रबंधक',
    locationName: 'Dwarka Sector 10, New Delhi',
    lat: 28.5823,
    lon: 77.0500,
    members: {
      hasToddler: false,
      hasElderly: false,
      hasRespiratorySensitivity: false,
    },
    commuteMode: 'transit',
    commuteMinutes: 30,
    homeSetup: {
      hasPurifier: true,
      crossVentilation: true,
      cookingFuel: 'lpg_gas',
    },
    communityRole: 'school',
  },
  {
    id: 'remote_worker_purifier',
    nameEn: 'Remote Worker with Purifier',
    nameHi: 'रिमोट वर्कर (प्यूरीफायर युक्त फ्लैट)',
    locationName: 'Greater Kailash, New Delhi',
    lat: 28.5482,
    lon: 77.2426,
    members: {
      hasToddler: false,
      hasElderly: false,
      hasRespiratorySensitivity: false,
    },
    commuteMode: 'remote',
    commuteMinutes: 0,
    homeSetup: {
      hasPurifier: true,
      crossVentilation: false,
      cookingFuel: 'electric_induction',
    },
    communityRole: 'family',
  },
];
