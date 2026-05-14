import type { Scene } from 'phaser';
import { SPECIALS, Special } from '../data/specials';
import type { Fighter } from './Fighter';

const EMOJI_FONT = 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif';

const SUPER_DAMAGE = 50;

export function playSpecial (scene: Scene, attacker: Fighter, defender: Fighter): void {
  const s = SPECIALS[attacker.data.special];
  const ax = attacker.sprite.x;
  const ay = attacker.sprite.y;

  // Big banner with emoji + name across screen
  const banner = scene.add.text(512, 220, `${s.emoji}  ${s.name.toUpperCase()}  ${s.emoji}`, {
    fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
    stroke: '#000000', strokeThickness: 6,
    backgroundColor: rgba(s.color, 0.6),
    padding: { left: 16, right: 16, top: 8, bottom: 8 }
  }).setOrigin(0.5).setAlpha(0).setScale(0.4);

  scene.tweens.add({
    targets: banner, alpha: 1, scale: 1, duration: 180, ease: 'Back.easeOut',
    yoyo: true, hold: 700,
    onComplete: () => banner.destroy()
  });

  // Screen flash tint
  const flash = scene.add.rectangle(512, 384, 1024, 768, s.color, 0.18);
  scene.tweens.add({ targets: flash, alpha: 0, duration: 400, onComplete: () => flash.destroy() });

  if (s.shape === 'projectile') {
    playProjectile(scene, attacker, defender, s, ax, ay);
  } else if (s.shape === 'aoe') {
    playAoe(scene, attacker, defender, s, ax, ay);
  } else {
    playDash(scene, attacker, defender, s);
  }
}

function playProjectile (scene: Scene, attacker: Fighter, defender: Fighter, s: Special, ax: number, ay: number): void {
  const proj = scene.add.text(ax + attacker.facing * 60, ay - 10, s.emoji, {
    fontFamily: EMOJI_FONT, fontSize: 64
  }).setOrigin(0.5);
  const glow = scene.add.circle(proj.x, proj.y, 38, s.color, 0.45);

  let landed = false;
  scene.tweens.add({
    targets: [proj, glow],
    x: ax + attacker.facing * 950,
    duration: s.durationMs,
    onUpdate: () => {
      glow.setPosition(proj.x, proj.y);
      if (landed) return;
      if (defender.isAlive() &&
          Math.abs(proj.x - defender.sprite.x) < 55 &&
          Math.abs(proj.y - defender.sprite.y) < 95) {
        defender.takeHit(SUPER_DAMAGE);
        landed = true;
        flashImpact(scene, defender.sprite.x, defender.sprite.y, s.color, s.emoji);
        proj.destroy();
        glow.destroy();
      }
    },
    onComplete: () => { if (!landed) { proj.destroy(); glow.destroy(); } }
  });
  scene.tweens.add({ targets: proj, angle: attacker.facing * 720, duration: s.durationMs });
}

function playAoe (scene: Scene, attacker: Fighter, defender: Fighter, s: Special, ax: number, ay: number): void {
  const center = scene.add.text(ax, ay - 30, s.emoji, {
    fontFamily: EMOJI_FONT, fontSize: 80
  }).setOrigin(0.5);
  const ring = scene.add.circle(ax, ay - 30, 25, s.color, 0.55).setStrokeStyle(4, 0xffffff);

  scene.tweens.add({ targets: ring, radius: 200, alpha: 0, duration: s.durationMs, onComplete: () => ring.destroy() });
  scene.tweens.add({ targets: center, scale: 2.2, alpha: 0, duration: s.durationMs, onComplete: () => center.destroy() });

  let landed = false;
  scene.time.delayedCall(s.durationMs * 0.35, () => {
    if (landed || !defender.isAlive()) return;
    const dx = defender.sprite.x - ax;
    const dy = defender.sprite.y - (ay - 30);
    if (Math.sqrt(dx * dx + dy * dy) < 230) {
      defender.takeHit(s.damage);
      landed = true;
      flashImpact(scene, defender.sprite.x, defender.sprite.y, s.color, s.emoji);
    }
  });
}

function playDash (scene: Scene, attacker: Fighter, defender: Fighter, s: Special): void {
  const trail = scene.add.rectangle(attacker.sprite.x, attacker.sprite.y, 90, 170, s.color, 0.4).setStrokeStyle(3, 0xffffff);
  const aura = scene.add.text(attacker.sprite.x, attacker.sprite.y - 20, s.emoji, {
    fontFamily: EMOJI_FONT, fontSize: 64
  }).setOrigin(0.5);

  const targetX = defender.sprite.x - attacker.facing * 100;
  let landed = false;

  scene.tweens.add({
    targets: attacker.sprite,
    x: targetX,
    duration: s.durationMs,
    onUpdate: () => {
      trail.setPosition(attacker.sprite.x, attacker.sprite.y);
      aura.setPosition(attacker.sprite.x, attacker.sprite.y - 20);
      if (landed) return;
      if (defender.isAlive() && Math.abs(attacker.sprite.x - defender.sprite.x) < 90) {
        defender.takeHit(SUPER_DAMAGE);
        landed = true;
        flashImpact(scene, defender.sprite.x, defender.sprite.y, s.color, s.emoji);
      }
    },
    onComplete: () => { trail.destroy(); aura.destroy(); }
  });
}

function flashImpact (scene: Scene, x: number, y: number, color: number, emoji: string): void {
  const ring = scene.add.circle(x, y, 50, color, 0.7);
  const burst = scene.add.text(x, y, emoji, { fontFamily: EMOJI_FONT, fontSize: 72 }).setOrigin(0.5);
  scene.tweens.add({ targets: ring,  scale: 2.6, alpha: 0, duration: 360, onComplete: () => ring.destroy() });
  scene.tweens.add({ targets: burst, scale: 1.8, alpha: 0, duration: 360, onComplete: () => burst.destroy() });
}

function rgba (color: number, alpha: number): string {
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;
  return `rgba(${r},${g},${b},${alpha})`;
}
