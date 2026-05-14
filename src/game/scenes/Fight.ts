import { Scene, Input } from 'phaser';
import { BY_ID } from '../data/roster';
import { Fighter, Hitbox } from '../systems/Fighter';
import { tickAI } from '../systems/EnemyAI';
import { playSpecial } from '../systems/Specials';
import { SPECIALS } from '../data/specials';

type FightInit = { playerId: string; opponentId: string; fightIndex: number };

type FightKeys = {
    A: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    W: Phaser.Input.Keyboard.Key;
    F: Phaser.Input.Keyboard.Key;
    G: Phaser.Input.Keyboard.Key;
    SPACE: Phaser.Input.Keyboard.Key;
};

export class Fight extends Scene
{
    private player!: Fighter;
    private enemy!: Fighter;
    private playerId!: string;
    private opponentId!: string;
    private fightIndex!: number;

    private playerHpBar!: Phaser.GameObjects.Rectangle;
    private enemyHpBar!: Phaser.GameObjects.Rectangle;
    private playerMeterBar!: Phaser.GameObjects.Rectangle;
    private enemyMeterBar!: Phaser.GameObjects.Rectangle;

    private keys!: FightKeys;
    private resolved = false;
    private started = false;

    constructor ()
    {
        super('Fight');
    }

    init (data: FightInit)
    {
        this.playerId = data.playerId;
        this.opponentId = data.opponentId;
        this.fightIndex = data.fightIndex;
        this.resolved = false;
        this.started = false;
    }

    create ()
    {
        this.physics.world.setBounds(0, 0, 1024, 680);

        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a0d2e, 0x1a0d2e, 0x3a1d5e, 0x3a1d5e, 1);
        bg.fillRect(0, 0, 1024, 768);

        this.add.text(512, 410, 'PRIMER', {
            fontFamily: 'Arial Black', fontSize: 220, color: '#1f0d3c'
        }).setOrigin(0.5);

        for (let i = 0; i < 5; i++) {
            const wx = 112 + i * 200;
            const wy = 240;
            this.add.rectangle(wx, wy, 120, 90, 0x0d0820).setStrokeStyle(4, 0x4a3d7e);
            this.add.rectangle(wx, wy, 112, 84, 0x6644aa, 0.4);
            this.add.rectangle(wx, wy, 3, 84, 0x4a3d7e);
            this.add.rectangle(wx, wy, 112, 3, 0x4a3d7e);
            this.add.circle(wx + 30, wy - 20, 6, 0xffee88, 0.5);
        }

        this.add.text(512, 50, '— PRIMER OFFICE —', {
            fontFamily: 'Arial Black', fontSize: 22, color: '#8866cc'
        }).setOrigin(0.5);

        for (let i = 0; i < 3; i++) {
            const dx = 180 + i * 320;
            this.add.rectangle(dx, 658, 130, 18, 0x0e0820).setStrokeStyle(1, 0x33256b);
            this.add.rectangle(dx, 644, 60, 12, 0x222244).setStrokeStyle(1, 0x44336b);
        }

        this.add.rectangle(512, 700, 1024, 40, 0x0a0518);
        this.add.rectangle(512, 680, 1024, 3, 0x7755bb);

        const pData = BY_ID[this.playerId];
        const eData = BY_ID[this.opponentId];
        this.player = new Fighter(this, 250, 500, pData, 1);
        this.enemy = new Fighter(this, 774, 500, eData, -1);

        this.add.text(20, 80, pData.name + ' ' + pData.flag, {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff'
        });
        this.add.text(1004, 80, eData.name + ' ' + eData.flag, {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff'
        }).setOrigin(1, 0);

        this.add.rectangle(220, 115, 400, 22, 0x441111).setStrokeStyle(2, 0xffffff);
        this.playerHpBar = this.add.rectangle(20, 104, 400, 22, 0xff3333).setOrigin(0, 0);

        this.add.rectangle(804, 115, 400, 22, 0x441111).setStrokeStyle(2, 0xffffff);
        this.enemyHpBar = this.add.rectangle(1004, 104, 400, 22, 0xff3333).setOrigin(1, 0);

        this.add.rectangle(170, 142, 300, 10, 0x222200).setStrokeStyle(1, 0xffff00);
        this.playerMeterBar = this.add.rectangle(20, 137, 0, 10, 0xffff00).setOrigin(0, 0);

        this.add.rectangle(854, 142, 300, 10, 0x222200).setStrokeStyle(1, 0xffff00);
        this.enemyMeterBar = this.add.rectangle(1004, 137, 0, 10, 0xffff00).setOrigin(1, 0);

        this.add.text(512, 102, `FIGHT ${this.fightIndex} / 3`, {
            fontFamily: 'Arial Black', fontSize: 22, color: '#ffffff',
            stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(20, 158, SPECIALS[pData.special].name + ' (SPACE)', {
            fontFamily: 'Arial', fontSize: 12, color: '#ffff88'
        });
        this.add.text(1004, 158, SPECIALS[eData.special].name, {
            fontFamily: 'Arial', fontSize: 12, color: '#ffff88'
        }).setOrigin(1, 0);

        this.keys = this.input.keyboard!.addKeys('A,D,W,F,G,SPACE') as FightKeys;

        this.add.text(512, 750, 'A/D move • W jump • F punch • G kick • SPACE special', {
            fontFamily: 'Arial', fontSize: 13, color: '#888888'
        }).setOrigin(0.5);

        this.showCountdown();
    }

    private showCountdown ()
    {
        const steps: { label: string; color: string; big: boolean }[] = [
            { label: '3',      color: '#ffffff', big: false },
            { label: '2',      color: '#ffffff', big: false },
            { label: '1',      color: '#ffffff', big: false },
            { label: 'FIGHT!', color: '#ffff00', big: true },
        ];
        let i = 0;
        const next = () => {
            if (i >= steps.length) {
                this.started = true;
                return;
            }
            const step = steps[i];
            const text = this.add.text(512, 360, step.label, {
                fontFamily: 'Arial Black', fontSize: step.big ? 140 : 130,
                color: step.color, stroke: '#000000', strokeThickness: 10
            }).setOrigin(0.5).setScale(0.3).setAlpha(0).setDepth(100);

            this.tweens.add({
                targets: text, scale: 1, alpha: 1, duration: 180, ease: 'Back.easeOut',
                onComplete: () => {
                    this.tweens.add({
                        targets: text, alpha: 0, scale: step.big ? 2 : 1.5,
                        duration: 320, delay: 120,
                        onComplete: () => { text.destroy(); i++; next(); }
                    });
                }
            });
        };
        next();
    }

    update (t: number)
    {
        if (!this.player || !this.enemy) return;

        if (this.player.sprite.x < this.enemy.sprite.x) {
            this.player.facing = 1;
            this.enemy.facing = -1;
        } else {
            this.player.facing = -1;
            this.enemy.facing = 1;
        }

        this.playerHpBar.width = (this.player.health / 100) * 400;
        this.enemyHpBar.width = (this.enemy.health / 100) * 400;
        this.playerMeterBar.width = (this.player.meter / 100) * 300;
        this.enemyMeterBar.width = (this.enemy.meter / 100) * 300;

        if (!this.started) {
            this.player.update();
            this.enemy.update();
            return;
        }

        if (!this.resolved && this.player.isAlive()) {
            if (this.keys.A.isDown) this.player.moveLeft();
            else if (this.keys.D.isDown) this.player.moveRight();
            else this.player.stopMove();

            if (Input.Keyboard.JustDown(this.keys.W)) this.player.jump();

            if (Input.Keyboard.JustDown(this.keys.F)) {
                const hb = this.player.punch();
                if (hb) this.spawnHitbox(hb, this.player, this.enemy);
            }
            if (Input.Keyboard.JustDown(this.keys.G)) {
                const hb = this.player.kick();
                if (hb) this.spawnHitbox(hb, this.player, this.enemy);
            }
            if (Input.Keyboard.JustDown(this.keys.SPACE)) {
                if (this.player.startSpecial()) playSpecial(this, this.player, this.enemy);
            }
        }

        if (!this.resolved && this.enemy.isAlive()) {
            const ai = tickAI(this.enemy, this.player, t);
            if (ai.hitbox) this.spawnHitbox(ai.hitbox, this.enemy, this.player);
            if (ai.specialTriggered) playSpecial(this, this.enemy, this.player);
        }

        this.player.update();
        this.enemy.update();

        if (!this.resolved && (!this.player.isAlive() || !this.enemy.isAlive())) {
            this.resolved = true;
            const winnerId = this.player.isAlive() ? this.player.data.id : this.enemy.data.id;
            const loserId = this.player.isAlive() ? this.enemy.data.id : this.player.data.id;
            const playerWon = winnerId === this.playerId;

            this.add.text(512, 360, playerWon ? 'K.O.' : 'YOU LOST', {
                fontFamily: 'Arial Black', fontSize: 80,
                color: playerWon ? '#ffff00' : '#ff3333',
                stroke: '#000', strokeThickness: 8
            }).setOrigin(0.5);

            this.time.delayedCall(1700, () => {
                this.scene.start('Result', {
                    winnerId, loserId,
                    fightIndex: this.fightIndex,
                    playerId: this.playerId
                });
            });
        }
    }

    private spawnHitbox (hb: Hitbox, attacker: Fighter, defender: Fighter): void
    {
        const rect = this.add.rectangle(hb.x, hb.y, hb.w, hb.h, 0xffff00, 0.18).setVisible(false);
        let landed = false;
        const tick = () => {
            if (landed) return;
            const dx = Math.abs(rect.x - defender.sprite.x);
            const dy = Math.abs(rect.y - defender.sprite.y);
            if (defender.isAlive() && dx < (hb.w / 2 + 40) && dy < (hb.h / 2 + 80)) {
                defender.takeHit(hb.damage);
                attacker.addMeter(20);
                landed = true;
                rect.destroy();
            }
        };
        const interval = this.time.addEvent({ delay: 30, loop: true, callback: tick });
        this.time.delayedCall(hb.durationMs, () => {
            interval.remove();
            if (!landed) rect.destroy();
        });
    }
}
