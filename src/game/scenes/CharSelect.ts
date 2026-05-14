import { Scene } from 'phaser';
import { PLAYABLE, BY_ID } from '../data/roster';
import { SPECIALS } from '../data/specials';

export class CharSelect extends Scene
{
    private selectedId: string | null = null;
    private highlight!: Phaser.GameObjects.Rectangle;
    private detailText!: Phaser.GameObjects.Text;
    private tilePositions: Record<string, { x: number; y: number }> = {};

    constructor ()
    {
        super('CharSelect');
    }

    create ()
    {
        this.selectedId = null;
        this.tilePositions = {};

        this.add.text(512, 36, 'PRIMER SMASHER', {
            fontFamily: 'Arial Black', fontSize: 44, color: '#ffffff',
            stroke: '#000', strokeThickness: 6
        }).setOrigin(0.5);
        this.add.text(512, 76, 'Pick your fighter', {
            fontFamily: 'Arial', fontSize: 20, color: '#bbbbbb'
        }).setOrigin(0.5);

        const cols = 7;
        const tileW = 100, tileH = 115;
        const gapX = 14, gapY = 10;
        const gridW = cols * tileW + (cols - 1) * gapX;
        const startX = (1024 - gridW) / 2 + tileW / 2;
        const startY = 140;

        this.highlight = this.add.rectangle(0, 0, tileW + 10, tileH + 10)
            .setStrokeStyle(4, 0xffff00).setVisible(false);

        PLAYABLE.forEach((f, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (tileW + gapX);
            const y = startY + row * (tileH + gapY);
            this.tilePositions[f.id] = { x, y };

            this.add.image(x, y - 14, 'fighter:' + f.id).setDisplaySize(70, 70);

            this.add.text(x, y + 36, f.name + ' ' + f.flag, {
                fontFamily: 'Arial', fontSize: 12, color: '#ffffff'
            }).setOrigin(0.5);

            const hit = this.add.rectangle(x, y, tileW, tileH, 0xffffff, 0)
                .setInteractive({ useHandCursor: true });
            hit.on('pointerdown', () => this.select(f.id));
        });

        this.detailText = this.add.text(512, 660, '', {
            fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center'
        }).setOrigin(0.5);

        const start = this.add.text(870, 730, '▶ START', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#000000',
            backgroundColor: '#ffff00', padding: { left: 14, right: 14, top: 8, bottom: 8 }
        }).setOrigin(0.5);
        start.setInteractive({ useHandCursor: true });
        start.on('pointerdown', () => {
            if (!this.selectedId) return;
            const others = PLAYABLE.filter(f => f.id !== this.selectedId);
            const opp = others[Math.floor(Math.random() * others.length)];
            this.scene.start('Fight', { playerId: this.selectedId, opponentId: opp.id, fightIndex: 1 });
        });

        this.add.text(512, 740, 'A/D move • W jump • F punch • G kick • SPACE special', {
            fontFamily: 'Arial', fontSize: 13, color: '#777777'
        }).setOrigin(0.5);

        if (PLAYABLE.length > 0) this.select(PLAYABLE[0].id);
    }

    private select (id: string): void
    {
        this.selectedId = id;
        const pos = this.tilePositions[id];
        if (pos) this.highlight.setPosition(pos.x, pos.y).setVisible(true);
        const f = BY_ID[id];
        const sp = SPECIALS[f.special];
        this.detailText.setText(`${f.name} (${f.nationality} ${f.flag})\nSpecial: ${sp.name}`);
    }
}
