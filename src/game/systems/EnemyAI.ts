import type { Fighter, Hitbox } from './Fighter';
import type { Tier } from '../data/roster';

export type AIResult = {
  hitbox?: Hitbox;
  specialTriggered?: boolean;
};

type AICfg = {
  speed: number;
  attackCooldownMs: number;
  specialMeter: number;
  aggression: number;
  jumpChance: number;
};

const TIER_CONFIG: Record<Tier, AICfg> = {
  easy:   { speed: 160, attackCooldownMs: 1300, specialMeter: 999, aggression: 0.55, jumpChance: 0.0008 },
  medium: { speed: 180, attackCooldownMs: 850,  specialMeter: 80,  aggression: 0.85, jumpChance: 0.004 },
  hard:   { speed: 210, attackCooldownMs: 600,  specialMeter: 60,  aggression: 0.95, jumpChance: 0.012 },
};

const nextAttackAt = new WeakMap<Fighter, number>();

export function tickAI (self: Fighter, target: Fighter, t: number): AIResult {
  if (!self.isAlive() || !target.isAlive()) return {};
  const cfg = TIER_CONFIG[self.data.tier];

  const dx = target.sprite.x - self.sprite.x;
  const dist = Math.abs(dx);
  const busy = self.state === 'punch' || self.state === 'kick' || self.state === 'special' || self.state === 'hit';

  if (!busy) {
    if (dist > 90) {
      if (Math.random() < cfg.aggression) {
        if (dx > 0) self.moveRight(); else self.moveLeft();
      } else {
        self.stopMove();
      }
    } else if (dist < 70) {
      if (dx > 0) self.moveLeft(); else self.moveRight();
    } else {
      self.stopMove();
    }
  }

  if (Math.random() < cfg.jumpChance) self.jump();

  if (self.meter >= cfg.specialMeter && dist < 700 && !busy) {
    if (self.startSpecial()) return { specialTriggered: true };
  }

  const ready = nextAttackAt.get(self) ?? 0;
  if (!busy && dist < 95 && t > ready) {
    nextAttackAt.set(self, t + cfg.attackCooldownMs + Math.random() * 400);
    if (Math.random() < 0.5) {
      const hb = self.punch();
      if (hb) return { hitbox: hb };
    } else {
      const hb = self.kick();
      if (hb) return { hitbox: hb };
    }
  }

  return {};
}
