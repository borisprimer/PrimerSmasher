import type { SpecialId } from './specials';

export type Tier = 'easy' | 'medium' | 'hard';

export type Fighter = {
  id: string;
  name: string;
  photo: string | null;
  nationality: string;
  flag: string;
  special: SpecialId;
  tier: Tier;
};

export const ROSTER: Fighter[] = [
  { id: 'Achim',     name: 'Achim',     photo: 'acceptance-team/Achim.jpg',     nationality: 'South Africa',     flag: '🇿🇦', special: 'braai-burner',      tier: 'easy' },
  { id: 'Adem',      name: 'Adem',      photo: 'acceptance-team/Adem.jpg',      nationality: 'Bosnia',           flag: '🇧🇦', special: 'cevapi-grenade',    tier: 'easy' },
  { id: 'Boris',     name: 'Boris',     photo: 'acceptance-team/Boris.jpg',     nationality: 'Serbia',           flag: '🇷🇸', special: 'rakija-roundhouse', tier: 'easy' },
  { id: 'Dan',       name: 'Dan',       photo: 'acceptance-team/Dan.jpg',       nationality: 'Romania',          flag: '🇷🇴', special: 'sarmale-slam',      tier: 'easy' },
  { id: 'Danny',     name: 'Danny',     photo: 'acceptance-team/Danny.jpg',     nationality: 'Scotland',         flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', special: 'haggis-hurl',       tier: 'easy' },
  { id: 'Darius',    name: 'Darius',    photo: 'acceptance-team/Darius.jpg',    nationality: 'Romania',          flag: '🇷🇴', special: 'mamaliga-mash',     tier: 'easy' },
  { id: 'Dimitris',  name: 'Dimitris',  photo: 'acceptance-team/Dimitris.jpg',  nationality: 'Greece',           flag: '🇬🇷', special: 'souvlaki-skewer',   tier: 'easy' },
  { id: 'Euler',     name: 'Euler',     photo: 'acceptance-team/Euler.png',     nationality: 'Portugal',         flag: '🇵🇹', special: 'bacalhau-bomb',     tier: 'easy' },
  { id: 'Francisco', name: 'Francisco', photo: 'acceptance-team/Francisco.jpg', nationality: 'Portugal',         flag: '🇵🇹', special: 'nata-whirl',        tier: 'easy' },
  { id: 'Gabor',     name: 'Gabor',     photo: 'acceptance-team/Gabor.jpg',     nationality: 'Hungary',          flag: '🇭🇺', special: 'goulash-geyser',    tier: 'easy' },
  { id: 'HJ',        name: 'HJ',        photo: 'acceptance-team/HJ.jpg',        nationality: 'South Africa',     flag: '🇿🇦', special: 'biltong-blast',     tier: 'easy' },
  { id: 'Inna',      name: 'Inna',      photo: 'acceptance-team/Inna.png',      nationality: 'England',          flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', special: 'tea-hurricane',     tier: 'easy' },
  { id: 'JJ',        name: 'JJ',        photo: 'acceptance-team/JJ.png',        nationality: 'Netherlands',      flag: '🇳🇱', special: 'stroopwafel-spin',  tier: 'easy' },
  { id: 'Joao',      name: 'João',      photo: 'acceptance-team/Joao.png',      nationality: 'Portugal',         flag: '🇵🇹', special: 'bifana-bash',       tier: 'easy' },
  { id: 'Mate',      name: 'Máté',      photo: 'acceptance-team/Mate.png',      nationality: 'Hungary',          flag: '🇭🇺', special: 'langos-launch',     tier: 'easy' },
  { id: 'Mike',      name: 'Mike',      photo: 'acceptance-team/Mike.jpg',      nationality: 'England',          flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', special: 'crumpet-catapult',  tier: 'easy' },
  { id: 'Niall',     name: 'Niall',     photo: 'acceptance-team/Niall.jpg',     nationality: 'Italy',            flag: '🇮🇹', special: 'pasta-punch',       tier: 'easy' },
  { id: 'Onur',      name: 'Onur',      photo: 'acceptance-team/Onur.png',      nationality: 'Turkey',           flag: '🇹🇷', special: 'doner-spin',        tier: 'easy' },
  { id: 'Paul',      name: 'Paul',      photo: 'acceptance-team/Paul.png',      nationality: 'Romania',          flag: '🇷🇴', special: 'mititei-missile',   tier: 'easy' },
  { id: 'Salma',     name: 'Salma',     photo: 'acceptance-team/Salma.png',     nationality: 'Egypt',            flag: '🇪🇬', special: 'pyramid-trap',      tier: 'easy' },
  { id: 'Tai',       name: 'Tai',       photo: 'acceptance-team/Tai.jpg',       nationality: 'South Africa',     flag: '🇿🇦', special: 'vuvuzela-blast',    tier: 'easy' },
  { id: 'Tom',       name: 'Tom',       photo: 'acceptance-team/Tom.png',       nationality: 'England',          flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', special: 'fish-chips-fury',   tier: 'easy' },
  { id: 'Yuriy',     name: 'Yuriy',     photo: 'acceptance-team/Yuriy.jpg',     nationality: 'Ukraine',          flag: '🇺🇦', special: 'cossack-kick',      tier: 'easy' },
  { id: 'Zsofia',    name: 'Zsófia',    photo: 'acceptance-team/Zsofia.png',    nationality: 'Hungary',          flag: '🇭🇺', special: 'tokaji-twister',    tier: 'easy' },
  { id: 'PE',        name: 'PE',        photo: 'acceptance-team/PE.jpg',        nationality: 'France',           flag: '🇫🇷', special: 'baguette-lance',    tier: 'medium' },
  { id: 'Gab',       name: 'Gab',       photo: 'acceptance-team/Gab.png',       nationality: 'Italy',            flag: '🇮🇹', special: 'pizza-discus',      tier: 'hard' },
];

export const PLAYABLE: Fighter[] = ROSTER.filter(f => f.tier === 'easy');
export const BY_ID: Record<string, Fighter> = Object.fromEntries(ROSTER.map(f => [f.id, f]));
