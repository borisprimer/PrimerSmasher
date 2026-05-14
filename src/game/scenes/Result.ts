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
            title = 'CHAMPION!';
            subtitle = `You smashed Gab and the entire Acceptance team.\nPress SPACE to play again`;
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

        this.add.text(512, 580, 'GAB IS COMING 🇮🇹', {
            fontFamily: 'Arial Black', fontSize: 56, color: '#ffff00',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(512, 640, 'Pizza Discus 🍕 — 50 damage', {
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
}
