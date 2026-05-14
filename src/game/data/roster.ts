import type { SpecialId } from './specials';

export type Tier = 'easy' | 'medium' | 'hard';

export type Fighter = {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  flag: string;
  special: SpecialId;
  tier: Tier;
};

export const ROSTER: Fighter[] = [
  { id: 'Achim',     name: 'Achim',     photo: 'acceptance-team/Achim.jpg',     nationality: 'Germany',        flag: '🇩🇪', special: 'currywurst-boomerang', tier: 'easy' },
  { id: 'Adem',      name: 'Adem',      photo: 'acceptance-team/Adem.jpg',      nationality: 'Bosnia',         flag: '🇧🇦', special: 'cevapi-grenade',       tier: 'easy' },
  { id: 'Chris',     name: 'Chris',     photo: 'acceptance-team/Chris.jpg',     nationality: 'United Kingdom', flag: '🇬🇧', special: 'tea-hurricane',        tier: 'easy' },
  { id: 'Dan',       name: 'Dan',       photo: 'acceptance-team/Dan.jpg',       nationality: 'United Kingdom', flag: '🇬🇧', special: 'fish-chips-fury',      tier: 'easy' },
  { id: 'Danny',     name: 'Danny',     photo: 'acceptance-team/Danny.jpg',     nationality: 'Ireland',        flag: '🇮🇪', special: 'guinness-splash',      tier: 'easy' },
  { id: 'Darius',    name: 'Darius',    photo: 'acceptance-team/Darius.jpg',    nationality: 'Lithuania',      flag: '🇱🇹', special: 'cepelinai-slam',       tier: 'easy' },
  { id: 'Dimitris',  name: 'Dimitris',  photo: 'acceptance-team/Dimitris.jpg',  nationality: 'Greece',         flag: '🇬🇷', special: 'souvlaki-skewer',      tier: 'easy' },
  { id: 'Euler',     name: 'Euler',     photo: 'acceptance-team/Euler.png',     nationality: 'Brazil',         flag: '🇧🇷', special: 'samba-strike',         tier: 'easy' },
  { id: 'Francisco', name: 'Francisco', photo: 'acceptance-team/Francisco.jpg', nationality: 'Portugal',       flag: '🇵🇹', special: 'nata-whirl',           tier: 'easy' },
  { id: 'HJ',        name: 'HJ',        photo: 'acceptance-team/HJ.jpg',        nationality: 'United Kingdom', flag: '🇬🇧', special: 'pudding-pile',         tier: 'easy' },
  { id: 'Inna',      name: 'Inna',      photo: 'acceptance-team/Inna.png',      nationality: 'Ukraine',        flag: '🇺🇦', special: 'borscht-wave',         tier: 'easy' },
  { id: 'JJ',        name: 'JJ',        photo: 'acceptance-team/JJ.png',        nationality: 'USA',            flag: '🇺🇸', special: 'burger-bomb',          tier: 'easy' },
  { id: 'Joao',      name: 'João',      photo: 'acceptance-team/Joao.png',      nationality: 'Portugal',       flag: '🇵🇹', special: 'bacalhau-slap',        tier: 'easy' },
  { id: 'Mate',      name: 'Mate',      photo: 'acceptance-team/Mate.png',      nationality: 'Hungary',        flag: '🇭🇺', special: 'goulash-geyser',       tier: 'easy' },
  { id: 'Mike',      name: 'Mike',      photo: 'acceptance-team/Mike.jpg',      nationality: 'USA',            flag: '🇺🇸', special: 'apple-pie-cannon',     tier: 'easy' },
  { id: 'Niall',     name: 'Niall',     photo: 'acceptance-team/Niall.jpg',     nationality: 'Ireland',        flag: '🇮🇪', special: 'shamrock-spin',        tier: 'easy' },
  { id: 'Onur',      name: 'Onur',      photo: 'acceptance-team/Onur.png',      nationality: 'Turkey',         flag: '🇹🇷', special: 'cay-slip',             tier: 'easy' },
  { id: 'Salma',     name: 'Salma',     photo: 'acceptance-team/Salma.png',     nationality: 'Egypt',          flag: '🇪🇬', special: 'pyramid-trap',         tier: 'easy' },
  { id: 'Sameh',     name: 'Sameh',     photo: 'acceptance-team/Sameh.png',     nationality: 'Egypt',          flag: '🇪🇬', special: 'pharaoh-curse',        tier: 'easy' },
  { id: 'Sebby',     name: 'Sebby',     photo: 'acceptance-team/Sebby.png',     nationality: 'United Kingdom', flag: '🇬🇧', special: 'crumpet-toss',         tier: 'easy' },
  { id: 'Tai',       name: 'Tai',       photo: 'acceptance-team/Tai.jpg',       nationality: 'Vietnam',        flag: '🇻🇳', special: 'pho-fog',              tier: 'easy' },
  { id: 'Tom',       name: 'Tom',       photo: 'acceptance-team/Tom.png',       nationality: 'United Kingdom', flag: '🇬🇧', special: 'bangers-mash',         tier: 'easy' },
  { id: 'Yuriy',     name: 'Yuriy',     photo: 'acceptance-team/Yuriy.jpg',     nationality: 'Ukraine',        flag: '🇺🇦', special: 'cossack-kick',         tier: 'easy' },
  { id: 'Zsofia',    name: 'Zsófia',    photo: 'acceptance-team/Zsofia.png',    nationality: 'Hungary',        flag: '🇭🇺', special: 'paprika-blaze',        tier: 'easy' },
  { id: 'PE',        name: 'PE',        photo: 'acceptance-team/PE.jpg',        nationality: 'France',         flag: '🇫🇷', special: 'baguette-lance',       tier: 'medium' },
  { id: 'Gab',       name: 'Gab',       photo: 'acceptance-team/Gab.png',       nationality: 'Italy',          flag: '🇮🇹', special: 'pizza-discus',         tier: 'hard' },
];

export const PLAYABLE: Fighter[] = ROSTER.filter(f => f.tier === 'easy');
export const BY_ID: Record<string, Fighter> = Object.fromEntries(ROSTER.map(f => [f.id, f]));
