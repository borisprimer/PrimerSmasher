import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { CharSelect } from './scenes/CharSelect';
import { Fight } from './scenes/Fight';
import { Result } from './scenes/Result';
import { AUTO, Game } from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#1a0d2e',
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: [Boot, Preloader, CharSelect, Fight, Result]
};

const StartGame = (parent: string) => new Game({ ...config, parent });

export default StartGame;
