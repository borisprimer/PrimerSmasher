export type SpecialId =
  | 'braai-burner' | 'cevapi-grenade' | 'rakija-roundhouse' | 'sarmale-slam'
  | 'haggis-hurl' | 'mamaliga-mash' | 'souvlaki-skewer' | 'bacalhau-bomb'
  | 'nata-whirl' | 'goulash-geyser' | 'biltong-blast' | 'tea-hurricane'
  | 'stroopwafel-spin' | 'bifana-bash' | 'pierogi-pinwheel' | 'crumpet-catapult'
  | 'langos-launch' | 'pasta-punch' | 'doner-spin' | 'mititei-missile'
  | 'rooibos-rush' | 'pyramid-trap' | 'vuvuzela-blast' | 'fish-chips-fury'
  | 'cossack-kick' | 'tokaji-twister'
  | 'baguette-lance' | 'fondue-fountain';

export type SpecialShape = 'projectile' | 'aoe' | 'dash';

export type Special = {
  id: SpecialId;
  name: string;
  emoji: string;
  color: number;
  shape: SpecialShape;
  damage: number;
  durationMs: number;
};

export const SPECIALS: Record<SpecialId, Special> = {
  'braai-burner':      { id: 'braai-burner',      name: 'Braai Burner',         emoji: '🔥', color: 0xff6622, shape: 'projectile', damage: 35, durationMs: 650 },
  'cevapi-grenade':    { id: 'cevapi-grenade',    name: 'Ćevapi Grenade',       emoji: '🍖', color: 0x885522, shape: 'aoe',        damage: 38, durationMs: 750 },
  'rakija-roundhouse': { id: 'rakija-roundhouse', name: 'Rakija Roundhouse',    emoji: '🥃', color: 0xddaa44, shape: 'dash',       damage: 40, durationMs: 500 },
  'sarmale-slam':      { id: 'sarmale-slam',      name: 'Sarmale Slam',         emoji: '🥬', color: 0x44aa44, shape: 'aoe',        damage: 34, durationMs: 700 },
  'haggis-hurl':       { id: 'haggis-hurl',       name: 'Haggis Hurl',          emoji: '🥘', color: 0x886633, shape: 'projectile', damage: 36, durationMs: 650 },
  'mamaliga-mash':     { id: 'mamaliga-mash',     name: 'Mămăligă Mash',        emoji: '🌽', color: 0xeecc44, shape: 'aoe',        damage: 32, durationMs: 700 },
  'souvlaki-skewer':   { id: 'souvlaki-skewer',   name: 'Souvlaki Skewer',      emoji: '🍢', color: 0xffaa22, shape: 'projectile', damage: 36, durationMs: 550 },
  'bacalhau-bomb':     { id: 'bacalhau-bomb',     name: 'Bacalhau Bomb',        emoji: '🐟', color: 0x88ccdd, shape: 'projectile', damage: 34, durationMs: 600 },
  'nata-whirl':        { id: 'nata-whirl',        name: 'Pastel de Nata Whirl', emoji: '🥐', color: 0xeebb22, shape: 'projectile', damage: 32, durationMs: 650 },
  'goulash-geyser':    { id: 'goulash-geyser',    name: 'Goulash Geyser',       emoji: '🌶️', color: 0xdd3322, shape: 'aoe',        damage: 38, durationMs: 700 },
  'biltong-blast':     { id: 'biltong-blast',     name: 'Biltong Blast',        emoji: '🥩', color: 0xaa3333, shape: 'projectile', damage: 36, durationMs: 600 },
  'tea-hurricane':     { id: 'tea-hurricane',     name: 'Tea Hurricane',        emoji: '☕', color: 0x66ccff, shape: 'aoe',        damage: 32, durationMs: 700 },
  'stroopwafel-spin':  { id: 'stroopwafel-spin',  name: 'Stroopwafel Spin',     emoji: '🧇', color: 0xddaa55, shape: 'projectile', damage: 34, durationMs: 600 },
  'bifana-bash':       { id: 'bifana-bash',       name: 'Bifana Bash',          emoji: '🥪', color: 0xcc8844, shape: 'dash',       damage: 38, durationMs: 500 },
  'pierogi-pinwheel':  { id: 'pierogi-pinwheel',  name: 'Pierogi Pinwheel',     emoji: '🥟', color: 0xeedd99, shape: 'projectile', damage: 32, durationMs: 650 },
  'crumpet-catapult':  { id: 'crumpet-catapult',  name: 'Crumpet Catapult',     emoji: '🧈', color: 0xeecc88, shape: 'projectile', damage: 30, durationMs: 600 },
  'langos-launch':     { id: 'langos-launch',     name: 'Lángos Launch',        emoji: '🥞', color: 0xddbb55, shape: 'projectile', damage: 34, durationMs: 600 },
  'pasta-punch':       { id: 'pasta-punch',       name: 'Pasta Punch',          emoji: '🍝', color: 0xddaa22, shape: 'dash',       damage: 38, durationMs: 500 },
  'doner-spin':        { id: 'doner-spin',        name: 'Döner Spin',           emoji: '🌯', color: 0xcc8833, shape: 'dash',       damage: 36, durationMs: 500 },
  'mititei-missile':   { id: 'mititei-missile',   name: 'Mititei Missile',      emoji: '🌭', color: 0xaa6644, shape: 'projectile', damage: 36, durationMs: 600 },
  'rooibos-rush':      { id: 'rooibos-rush',      name: 'Rooibos Rush',         emoji: '🍵', color: 0xcc6633, shape: 'aoe',        damage: 32, durationMs: 700 },
  'pyramid-trap':      { id: 'pyramid-trap',      name: 'Pyramid Trap',         emoji: '🔺', color: 0xddcc55, shape: 'aoe',        damage: 40, durationMs: 750 },
  'vuvuzela-blast':    { id: 'vuvuzela-blast',    name: 'Vuvuzela Blast',       emoji: '📯', color: 0xffcc22, shape: 'projectile', damage: 34, durationMs: 550 },
  'fish-chips-fury':   { id: 'fish-chips-fury',   name: 'Fish & Chips Fury',    emoji: '🍟', color: 0xffcc44, shape: 'projectile', damage: 32, durationMs: 600 },
  'cossack-kick':      { id: 'cossack-kick',      name: 'Cossack Kick',         emoji: '🕺', color: 0x3366ff, shape: 'dash',       damage: 38, durationMs: 480 },
  'tokaji-twister':    { id: 'tokaji-twister',    name: 'Tokaji Twister',       emoji: '🍷', color: 0xaa2244, shape: 'aoe',        damage: 36, durationMs: 700 },
  'baguette-lance':    { id: 'baguette-lance',    name: 'Baguette Lance',       emoji: '🥖', color: 0xeeaa44, shape: 'projectile', damage: 42, durationMs: 600 },
  'fondue-fountain':   { id: 'fondue-fountain',   name: 'Fondue Fountain',      emoji: '🫕', color: 0xeecc44, shape: 'aoe',        damage: 50, durationMs: 750 },
};
