import { CONST } from '../helpers/const'

export class Lava extends Phaser.GameObjects.Particles.ParticleEmitterManager {
  private currentScene: Phaser.Scene

  constructor(scene) {
    super(scene, 'lava')
    this.currentScene = scene

    this.init()
  }

  init(): void {
    let numberOfEmitters = 28
    for (let i = 0; i < numberOfEmitters + 1; i++) {
      let emitterX = CONST.GAME.WIDTH / numberOfEmitters * i
      this.createEmitter({
        x: emitterX,
        y: CONST.GAME.HEIGHT,
        angle: 270,
        blendMode: 'SCREEN',
        gravityY: 200,
        lifespan: 200,
        scale: {
          start: 0.4,
          end: 0.1
        },
        speed: {
          min: -100,
          max: 500
        },
        tint: 0xff0000
      })
    }
    this.setDepth(1)
    this.currentScene.add.existing(this)
  }
}
