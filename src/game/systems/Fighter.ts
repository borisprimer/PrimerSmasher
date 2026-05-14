import type { Scene } from 'phaser';
import type { Fighter as FighterData } from '../data/roster';
import { SPECIALS } from '../data/specials';

export type FighterState = 'idle' | 'walk' | 'punch' | 'kick' | 'special' | 'hit' | 'ko';

export type Hitbox = {
  x: number; y: number; w: number; h: number;
  damage: number; durationMs: number;
};

export class Fighter {
  scene: Scene;
  data: FighterData;
  sprite: Phaser.Physics.Arcade.Sprite;
  head: Phaser.GameObjects.Image;
  maskShape: Phaser.GameObjects.Graphics;
  stickBody: Phaser.GameObjects.Graphics;
  nameText: Phaser.GameObjects.Text;

  health = 100;
  meter = 0;
  facing: 1 | -1 = 1;
  state: FighterState = 'idle';
  stateUntil = 0;
  hitFlashUntil = 0;
  walkTime = 0;

  constructor (scene: Scene, x: number, y: number, data: FighterData, facing: 1 | -1) {
    this.scene = scene;
    this.data = data;
    this.facing = facing;

    const key = 'fighter:' + data.id;

    this.sprite = scene.physics.add.sprite(x, y, key);
    this.sprite.setVisible(false);
    this.sprite.setDisplaySize(80, 160);
    this.sprite.body!.setSize(80, 160);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setMaxVelocity(220, 800);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setGravityY(900);

    this.stickBody = scene.add.graphics();

    this.head = scene.add.image(x, y - 60, key);
    this.head.setDisplaySize(80, 80);

    this.maskShape = scene.add.graphics();
    this.maskShape.setVisible(false);
    this.maskShape.fillStyle(0xffffff, 1);
    this.maskShape.fillCircle(x, y - 60, 40);
    this.head.setMask(this.maskShape.createGeometryMask());

    this.nameText = scene.add.text(x, y - 115, data.name + ' ' + data.flag, {
      fontFamily: 'Arial Black', fontSize: 14, color: '#ffffff', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);
  }

  update (): void {
    const s = this.sprite;
    const t = this.scene.time.now;
    const cx = s.x, cy = s.y;
    const body = s.body as Phaser.Physics.Arcade.Body;

    if (Math.abs(body.velocity.x) > 10 && this.state !== 'ko') this.walkTime += 16;

    if ((this.state === 'punch' || this.state === 'kick' || this.state === 'special' || this.state === 'hit') && t > this.stateUntil) {
      this.state = 'idle';
    }
    if (this.state === 'walk' && Math.abs(body.velocity.x) < 10) this.state = 'idle';

    this.stickBody.setPosition(cx, cy);
    const rot = this.stickBody.rotation;
    const headX = cx + 60 * Math.sin(rot);
    const headY = cy - 60 * Math.cos(rot);

    this.head.setPosition(headX, headY);
    this.head.setRotation(rot);

    this.maskShape.clear();
    this.maskShape.fillStyle(0xffffff, 1);
    this.maskShape.fillCircle(headX, headY, 40);

    this.nameText.setPosition(headX, headY - 55);
    this.nameText.setRotation(rot);

    this.stickBody.clear();
    const color = t < this.hitFlashUntil
      ? 0xffff00
      : this.state === 'ko' ? 0xff8888 : 0xffffff;
    this.stickBody.lineStyle(4, color);

    this.stickBody.lineBetween(0, -20, 0, 40);

    if (this.state === 'punch' || this.state === 'special') {
      this.stickBody.lineBetween(0, -20, this.facing * 65, -5);
      this.stickBody.lineBetween(0, -20, -this.facing * 25, 5);
    } else {
      const swing = this.state === 'walk' ? Math.sin(this.walkTime * 0.025) * 15 : 0;
      this.stickBody.lineBetween(0, -20, 22 + swing, 15);
      this.stickBody.lineBetween(0, -20, -22 - swing, 15);
    }

    if (this.state === 'kick') {
      this.stickBody.lineBetween(0, 40, this.facing * 65, 45);
      this.stickBody.lineBetween(0, 40, -this.facing * 15, 80);
    } else {
      const swing = this.state === 'walk' ? Math.sin(this.walkTime * 0.025) * 15 : 0;
      this.stickBody.lineBetween(0, 40, 16 + swing, 80);
      this.stickBody.lineBetween(0, 40, -16 - swing, 80);
    }
  }

  private spawnDamageNumber (damage: number): void {
    const big = damage >= 25;
    const dmg = this.scene.add.text(this.sprite.x, this.sprite.y - 80, '-' + damage, {
      fontFamily: 'Arial Black', fontSize: big ? 44 : 32,
      color: big ? '#ff2222' : '#ffaa44',
      stroke: '#000000', strokeThickness: 5
    }).setOrigin(0.5).setDepth(50);
    this.scene.tweens.add({
      targets: dmg,
      y: dmg.y - 80,
      alpha: 0,
      scale: big ? 1.4 : 1.1,
      duration: 900,
      ease: 'Cubic.easeOut',
      onComplete: () => dmg.destroy()
    });
  }

  moveLeft (): void {
    if (this.state === 'ko' || this.state === 'punch' || this.state === 'kick' || this.state === 'special') return;
    this.sprite.setVelocityX(-200);
    this.facing = -1;
    if (this.state === 'idle') this.state = 'walk';
  }

  moveRight (): void {
    if (this.state === 'ko' || this.state === 'punch' || this.state === 'kick' || this.state === 'special') return;
    this.sprite.setVelocityX(200);
    this.facing = 1;
    if (this.state === 'idle') this.state = 'walk';
  }

  stopMove (): void {
    if (this.state === 'ko') return;
    this.sprite.setVelocityX(0);
    if (this.state === 'walk') this.state = 'idle';
  }

  jump (): void {
    if (this.state === 'ko') return;
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.down || body.touching.down) this.sprite.setVelocityY(-520);
  }

  punch (): Hitbox | null {
    if (this.state !== 'idle' && this.state !== 'walk') return null;
    this.state = 'punch';
    this.stateUntil = this.scene.time.now + 220;
    return { x: this.sprite.x + this.facing * 55, y: this.sprite.y - 10, w: 60, h: 50, damage: 10, durationMs: 150 };
  }

  kick (): Hitbox | null {
    if (this.state !== 'idle' && this.state !== 'walk') return null;
    this.state = 'kick';
    this.stateUntil = this.scene.time.now + 300;
    return { x: this.sprite.x + this.facing * 65, y: this.sprite.y + 30, w: 70, h: 60, damage: 18, durationMs: 220 };
  }

  startSpecial (): boolean {
    if (this.meter < 100) return false;
    if (this.state !== 'idle' && this.state !== 'walk') return false;
    this.meter = 0;
    this.state = 'special';
    this.stateUntil = this.scene.time.now + SPECIALS[this.data.special].durationMs + 200;
    return true;
  }

  takeHit (damage: number): void {
    if (this.state === 'ko') return;
    this.health = Math.max(0, this.health - damage);
    this.hitFlashUntil = this.scene.time.now + 140;
    this.spawnDamageNumber(damage);

    if (this.health <= 0) {
      this.state = 'ko';
      this.sprite.setVelocityX(-this.facing * 260);
      this.sprite.setVelocityY(-380);
      this.scene.tweens.add({
        targets: this.stickBody,
        rotation: this.facing > 0 ? -Math.PI / 2 : Math.PI / 2,
        duration: 650,
        ease: 'Cubic.easeIn'
      });
    } else {
      this.state = 'hit';
      this.stateUntil = this.scene.time.now + 150;
    }
  }

  addMeter (amount: number): void {
    this.meter = Math.min(100, this.meter + amount);
  }

  isAlive (): boolean {
    return this.state !== 'ko' && this.health > 0;
  }

  destroy (): void {
    this.sprite.destroy();
    this.head.destroy();
    this.maskShape.destroy();
    this.stickBody.destroy();
    this.nameText.destroy();
  }
}
