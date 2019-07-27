import { CONST } from '../helpers/const'

export class Player extends Phaser.GameObjects.Sprite {
  private currentScene: Phaser.Scene
  private jumps: number

  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame)

    this.currentScene = params.scene

    this.init()
    this.currentScene.add.existing(this)
  }

  private init() {
    this.jumps = 0

    this.setOrigin(0.5, 0.5)

    this.currentScene.input.on('pointerdown', this.jump, this)

    this.currentScene.physics.world.enable(this)
  }

  private jump(): void {
    if (this.body.touching.down || (this.jumps > 0 && this.jumps < CONST.JUMPS)) {
      if (this.body.touching.down) {
        this.jumps = 0
      }
      this.body.setVelocityY(CONST.JUMP_FORCE * -1)
      this.jumps++
    }
  }
}
