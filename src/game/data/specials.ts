export type SpecialId =
  | 'currywurst-boomerang' | 'cevapi-grenade' | 'tea-hurricane' | 'fish-chips-fury'
  | 'guinness-splash' | 'cepelinai-slam' | 'souvlaki-skewer' | 'samba-strike'
  | 'nata-whirl' | 'pudding-pile' | 'borscht-wave' | 'burger-bomb'
  | 'bacalhau-slap' | 'goulash-geyser' | 'apple-pie-cannon' | 'shamrock-spin'
  | 'cay-slip' | 'pyramid-trap' | 'pharaoh-curse' | 'crumpet-toss'
  | 'pho-fog' | 'bangers-mash' | 'cossack-kick' | 'paprika-blaze'
  | 'baguette-lance' | 'pizza-discus';

export type SpecialShape = 'projectile' | 'aoe' | 'dash';

export type Special = {
  id: SpecialId;
  name: string;
  color: number;
  shape: SpecialShape;
  damage: number;
  durationMs: number;
};

export const SPECIALS: Record<SpecialId, Special> = {
  'currywurst-boomerang': { id: 'currywurst-boomerang', name: 'Currywurst Boomerang', color: 0xff7733, shape: 'projectile', damage: 35, durationMs: 700 },
  'cevapi-grenade':       { id: 'cevapi-grenade',       name: 'Ćevapi Grenade',       color: 0x885522, shape: 'aoe',        damage: 38, durationMs: 700 },
  'tea-hurricane':        { id: 'tea-hurricane',        name: 'Tea-cup Hurricane',    color: 0x66ccff, shape: 'aoe',        damage: 32, durationMs: 700 },
  'fish-chips-fury':      { id: 'fish-chips-fury',      name: 'Fish & Chips Fury',    color: 0xffcc44, shape: 'projectile', damage: 30, durationMs: 600 },
  'guinness-splash':      { id: 'guinness-splash',      name: 'Guinness Splash',      color: 0x1a1a0a, shape: 'aoe',        damage: 34, durationMs: 650 },
  'cepelinai-slam':       { id: 'cepelinai-slam',       name: 'Cepelinai Slam',       color: 0xaaaaaa, shape: 'dash',       damage: 40, durationMs: 500 },
  'souvlaki-skewer':      { id: 'souvlaki-skewer',      name: 'Souvlaki Skewer',      color: 0xffaa22, shape: 'projectile', damage: 36, durationMs: 550 },
  'samba-strike':         { id: 'samba-strike',         name: 'Samba Strike',         color: 0x33cc33, shape: 'dash',       damage: 38, durationMs: 500 },
  'nata-whirl':           { id: 'nata-whirl',           name: 'Pastel de Nata Whirl', color: 0xeebb22, shape: 'projectile', damage: 32, durationMs: 650 },
  'pudding-pile':         { id: 'pudding-pile',         name: 'Sticky Pudding Pile',  color: 0x885511, shape: 'aoe',        damage: 30, durationMs: 700 },
  'borscht-wave':         { id: 'borscht-wave',         name: 'Borscht Wave',         color: 0xcc2266, shape: 'aoe',        damage: 36, durationMs: 700 },
  'burger-bomb':          { id: 'burger-bomb',          name: 'Burger Bomb',          color: 0xff4422, shape: 'projectile', damage: 35, durationMs: 600 },
  'bacalhau-slap':        { id: 'bacalhau-slap',        name: 'Bacalhau Slap',        color: 0xeeeedd, shape: 'dash',       damage: 38, durationMs: 500 },
  'goulash-geyser':       { id: 'goulash-geyser',       name: 'Goulash Geyser',       color: 0xdd3322, shape: 'aoe',        damage: 38, durationMs: 700 },
  'apple-pie-cannon':     { id: 'apple-pie-cannon',     name: 'Apple Pie Cannon',     color: 0xddbb66, shape: 'projectile', damage: 34, durationMs: 600 },
  'shamrock-spin':        { id: 'shamrock-spin',        name: 'Shamrock Spin',        color: 0x33aa33, shape: 'aoe',        damage: 32, durationMs: 650 },
  'cay-slip':             { id: 'cay-slip',             name: 'Çay Slip',             color: 0xcc8833, shape: 'projectile', damage: 30, durationMs: 600 },
  'pyramid-trap':         { id: 'pyramid-trap',         name: 'Pyramid Trap',         color: 0xddcc55, shape: 'aoe',        damage: 40, durationMs: 750 },
  'pharaoh-curse':        { id: 'pharaoh-curse',        name: "Pharaoh's Curse",      color: 0xffdd33, shape: 'projectile', damage: 38, durationMs: 700 },
  'crumpet-toss':         { id: 'crumpet-toss',         name: 'Crumpet Toss',         color: 0xeecc88, shape: 'projectile', damage: 28, durationMs: 600 },
  'pho-fog':              { id: 'pho-fog',              name: 'Pho Fog',              color: 0xbbaa77, shape: 'aoe',        damage: 34, durationMs: 700 },
  'bangers-mash':         { id: 'bangers-mash',         name: 'Bangers & Mash Bash',  color: 0xaa7733, shape: 'dash',       damage: 36, durationMs: 500 },
  'cossack-kick':         { id: 'cossack-kick',         name: 'Cossack Kick',         color: 0x3366ff, shape: 'dash',       damage: 38, durationMs: 480 },
  'paprika-blaze':        { id: 'paprika-blaze',        name: 'Paprika Blaze',        color: 0xff3322, shape: 'aoe',        damage: 36, durationMs: 700 },
  'baguette-lance':       { id: 'baguette-lance',       name: 'Baguette Lance',       color: 0xeeaa44, shape: 'projectile', damage: 42, durationMs: 600 },
  'pizza-discus':         { id: 'pizza-discus',         name: 'Pizza Discus',         color: 0xff5533, shape: 'projectile', damage: 50, durationMs: 550 },
};
