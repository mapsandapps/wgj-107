import 'phaser';
import { GameScene } from './scenes/game-scene';
import { MenuScene } from './scenes/menu-scene';
import { WinScene } from './scenes/win-scene';

import { CONST } from './helpers/const'

// main game configuration
const config: GameConfig = {
  width: CONST.GAME.WIDTH,
  height: CONST.GAME.HEIGHT,
  type: Phaser.AUTO,
  parent: 'game',
  scene: [MenuScene, GameScene, WinScene],
  backgroundColor: 0x444444,
  input: {
    keyboard: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: CONST.GRAVITY },
      debug: false
    }
  },
  render: {
    pixelArt: false,
    antialias: true
  }
};

// game class
export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }

  preload(): void {
    this.scene.start('MenuScene')
  }
}

// when the page is loaded, create our game instance
window.addEventListener('load', () => {
  var game = new Game(config);
});
