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
        } else if (fightIndex === 2) {
            title = 'You beat PE!';
            subtitle = `Final boss: Gab 🇮🇹\nPress SPACE to face the CEO`;
            action = () => this.scene.start('Fight', {
                playerId,
                opponentId: 'Gab',
                fightIndex: 3
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
}
