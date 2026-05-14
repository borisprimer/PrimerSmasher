import type { Scene } from 'phaser';
import { SPECIALS } from '../data/specials';
import type { Fighter } from './Fighter';

export function playSpecial (scene: Scene, attacker: Fighter, defender: Fighter): void {
  const s = SPECIALS[attacker.data.special];
  const ax = attacker.sprite.x;
  const ay = attacker.sprite.y;

  const label = scene.add.text(ax, ay - 130, s.name, {
    fontFamily: 'Arial Black', fontSize: 16, color: '#ffffff',
    stroke: '#000000', strokeThickness: 4
  }).setOrigin(0.5);
  scene.tweens.add({ targets: label, y: label.y - 40, alpha: 0, duration: 900, onComplete: () => label.destroy() });

  if (s.shape === 'projectile') {
    const proj = scene.add.rectangle(ax + attacker.facing * 60, ay, 55, 35, s.color)
      .setStrokeStyle(2, 0xffffff);
    let landed = false;
    scene.tweens.add({
      targets: proj,
      x: ax + attacker.facing * 900,
      angle: attacker.facing * 720,
      duration: s.durationMs,
      onUpdate: () => {
        if (landed) return;
        if (defender.isAlive() &&
            Math.abs(proj.x - defender.sprite.x) < 55 &&
            Math.abs(proj.y - defender.sprite.y) < 95) {
          defender.takeHit(s.damage);
          landed = true;
          flash(scene, proj.x, proj.y, s.color);
          proj.destroy();
        }
      },
      onComplete: () => { if (!landed) proj.destroy(); }
    });
  } else if (s.shape === 'aoe') {
    const v = scene.add.circle(ax, ay - 20, 20, s.color, 0.55).setStrokeStyle(3, 0xffffff);
    scene.tweens.add({
      targets: v,
      radius: 180,
      alpha: 0,
      duration: s.durationMs,
      onComplete: () => v.destroy()
    });
    let landed = false;
    scene.time.delayedCall(s.durationMs * 0.35, () => {
      if (landed || !defender.isAlive()) return;
      const dx = defender.sprite.x - ax;
      const dy = defender.sprite.y - (ay - 20);
      if (Math.sqrt(dx * dx + dy * dy) < 220) {
        defender.takeHit(s.damage);
        landed = true;
        flash(scene, defender.sprite.x, defender.sprite.y, s.color);
      }
    });
  } else {
    const trail = scene.add.rectangle(ax, ay, 80, 160, s.color, 0.45).setStrokeStyle(2, 0xffffff);
    let landed = false;
    const targetX = defender.sprite.x - attacker.facing * 100;
    scene.tweens.add({
      targets: attacker.sprite,
      x: targetX,
      duration: s.durationMs,
      onUpdate: () => {
        trail.setPosition(attacker.sprite.x, attacker.sprite.y);
        if (landed) return;
        if (defender.isAlive() && Math.abs(attacker.sprite.x - defender.sprite.x) < 90) {
          defender.takeHit(s.damage);
          landed = true;
          flash(scene, defender.sprite.x, defender.sprite.y, s.color);
        }
      },
      onComplete: () => trail.destroy()
    });
  }
}

function flash (scene: Scene, x: number, y: number, color: number): void {
  const c = scene.add.circle(x, y, 50, color, 0.8);
  scene.tweens.add({ targets: c, scale: 2.4, alpha: 0, duration: 320, onComplete: () => c.destroy() });
}
