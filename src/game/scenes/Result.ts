import { Scene } from 'phaser';
import { BY_ID } from '../data/roster';

type ResultInit = {
    winnerId: string;
    loserId: string;
    fightIndex: number;
    playerId: string;
};

export class Result extends Scene
{
    private payload!: ResultInit;

    constructor ()
    {
        super('Result');
    }

    init (data: ResultInit)
    {
        this.payload = data;
    }

    create ()
    {
        const { winnerId, loserId, fightIndex, playerId } = this.payload;
        const playerWon = winnerId === playerId;

        if (playerWon && fightIndex === 3) {
            this.showChampion(playerId);
            return;
        }

        if (playerWon && fightIndex === 2) {
            this.showBossIntro(playerId);
            return;
        }

        let title: string;
        let subtitle: string;
        let action: () => void;

        if (!playerWon) {
            const w = BY_ID[winnerId];
            title = 'K.O.';
            subtitle = `${w.name} ${w.flag} smashed you.\nPress SPACE to retry`;
            action = () => this.scene.start('Fight', {
                playerId,
                opponentId: winnerId,
                fightIndex
            });
        } else if (fightIndex === 1) {
            const l = BY_ID[loserId];
            title = `You beat ${l.name}!`;
            subtitle = `Next: PE 🇫🇷 — Semi-final\nPress SPACE to continue`;
            action = () => this.scene.start('Fight', {
                playerId,
                opponentId: 'PE',
                fightIndex: 2
            });
        } else {
            title = '???';
            subtitle = '';
            action = () => this.scene.start('CharSelect');
        }

        this.add.text(512, 260, title, {
            fontFamily: 'Arial Black', fontSize: 64,
            color: playerWon ? '#ffff00' : '#ff3333',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(512, 380, subtitle, {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff', align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 600, '[ SPACE ]', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffff00'
        }).setOrigin(0.5);

        this.input.keyboard!.once('keydown-SPACE', action);
        this.input.once('pointerdown', action);
    }

    private showBossIntro (playerId: string): void
    {
        const overlay = this.add.rectangle(512, 384, 1024, 768, 0x440000, 0.3);
        this.tweens.add({ targets: overlay, alpha: 0.45, duration: 700, yoyo: true, repeat: -1 });

        const final = this.add.text(512, 110, 'FINAL BOSS', {
            fontFamily: 'Arial Black', fontSize: 76, color: '#ff2222',
            stroke: '#000000', strokeThickness: 10
        }).setOrigin(0.5);
        this.tweens.add({ targets: final, alpha: 0.35, duration: 480, yoyo: true, repeat: -1 });

        const photoBg = this.add.circle(512, 380, 165, 0xff2222, 0.4);
        this.tweens.add({ targets: photoBg, scale: 1.12, duration: 700, yoyo: true, repeat: -1 });
        this.add.image(512, 380, 'fighter:Gab').setDisplaySize(300, 300);

        this.add.text(512, 580, 'GAB IS COMING 🇨🇭', {
            fontFamily: 'Arial Black', fontSize: 56, color: '#ffff00',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(512, 640, 'Fondue Fountain 🫕 — 50 damage', {
            fontFamily: 'Arial', fontSize: 22, color: '#ffaaaa'
        }).setOrigin(0.5);

        const prompt = this.add.text(512, 720, '[ PRESS SPACE TO FACE THE CEO ]', {
            fontFamily: 'Arial Black', fontSize: 22, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);
        this.tweens.add({ targets: prompt, alpha: 0.4, duration: 600, yoyo: true, repeat: -1 });

        const go = () => this.scene.start('Fight', { playerId, opponentId: 'Gab', fightIndex: 3 });
        this.input.keyboard!.once('keydown-SPACE', go);
        this.input.once('pointerdown', go);
    }

    private showChampion (playerId: string): void
    {
        const player = BY_ID[playerId];

        const startedAt = (this.registry.get('tournamentStartAt') as number | undefined) ?? this.time.now;
        const elapsedSec = Math.max(0, Math.round((this.time.now - startedAt) / 1000));
        const m = Math.floor(elapsedSec / 60);
        const s = elapsedSec % 60;
        const timeStr = `${m}m ${s.toString().padStart(2, '0')}s`;

        const bgGlow = this.add.circle(512, 320, 200, 0xffff00, 0.18);
        this.tweens.add({ targets: bgGlow, scale: 1.25, alpha: 0.32, duration: 900, yoyo: true, repeat: -1 });

        const title = this.add.text(512, 90, '🏆  CHAMPION  🏆', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffff00',
            stroke: '#000000', strokeThickness: 10
        }).setOrigin(0.5);
        this.tweens.add({ targets: title, scale: 1.04, duration: 700, yoyo: true, repeat: -1 });

        this.add.image(512, 320, 'fighter:' + playerId).setDisplaySize(240, 240);

        this.add.text(512, 470, player.name + '  ' + player.flag, {
            fontFamily: 'Arial Black', fontSize: 44, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(512, 530, 'smashed Gab and the entire Acceptance team', {
            fontFamily: 'Arial', fontSize: 20, color: '#cccccc'
        }).setOrigin(0.5);

        this.add.text(512, 580, '⏱  Tournament time: ' + timeStr, {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffaa44'
        }).setOrigin(0.5);

        const prompt = this.add.text(512, 720, '[ SPACE to play again ]', {
            fontFamily: 'Arial Black', fontSize: 22, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);
        this.tweens.add({ targets: prompt, alpha: 0.4, duration: 600, yoyo: true, repeat: -1 });

        this.spawnConfetti(80);
        this.time.addEvent({
            delay: 900, loop: true,
            callback: () => this.spawnConfetti(40)
        });

        const go = () => this.scene.start('CharSelect');
        this.input.keyboard!.once('keydown-SPACE', go);
        this.input.once('pointerdown', go);
    }

    private spawnConfetti (count: number): void
    {
        const palette = [0xff3333, 0x33ff66, 0x3399ff, 0xffff33, 0xff66cc, 0xff9933, 0xaa66ff];
        for (let i = 0; i < count; i++) {
            const color = palette[Math.floor(Math.random() * palette.length)];
            const piece = this.add.rectangle(
                Math.random() * 1024, -30,
                6 + Math.random() * 6, 10 + Math.random() * 8,
                color
            ).setDepth(90);
            piece.angle = Math.random() * 360;
            this.tweens.add({
                targets: piece,
                y: 820,
                angle: piece.angle + 360 + Math.random() * 540,
                duration: 1800 + Math.random() * 2200,
                delay: Math.random() * 600,
                onComplete: () => piece.destroy()
            });
        }
    }
}
