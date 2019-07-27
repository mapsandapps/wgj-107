import { CONST } from '../helpers/const'

export class Platform extends Phaser.GameObjects.Image {
  private currentScene: Phaser.Scene

  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame)

    this.currentScene = params.scene

    this.init()
    this.currentScene.add.existing(this)
  }

  init(): void {
    this.currentScene.physics.add.existing(this)
    this.body.setAllowGravity(false)
    this.body.setImmovable(true)
    this.body.setVelocityX(CONST.PLATFORM_START_SPEED * -1)
  }
}
