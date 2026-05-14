import { Scene } from 'phaser';
import { ROSTER } from '../data/roster';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.text(512, 280, 'PRIMER SMASHER', {
            fontFamily: 'Arial Black', fontSize: 56, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(512, 350, 'Loading the Acceptance team…', {
            fontFamily: 'Arial', fontSize: 22, color: '#cccccc'
        }).setOrigin(0.5);

        this.add.rectangle(512, 420, 468, 32).setStrokeStyle(2, 0xffffff);
        const bar = this.add.rectangle(512 - 230, 420, 4, 28, 0xffff00);

        this.load.on('progress', (progress: number) => {
            bar.width = 4 + (460 * progress);
        });
    }

    preload ()
    {
        for (const f of ROSTER) {
            if (f.photo) this.load.image('fighter:' + f.id, f.photo);
        }
    }

    create ()
    {
        for (const f of ROSTER) {
            const key = 'fighter:' + f.id;
            if (this.textures.exists(key)) continue;
            const canvas = document.createElement('canvas');
            canvas.width = 160;
            canvas.height = 160;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#553399';
            ctx.fillRect(0, 0, 160, 160);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 110px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(f.name.charAt(0).toUpperCase(), 80, 92);
            this.textures.addCanvas(key, canvas);
        }

        this.scene.start('CharSelect');
    }
}
