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

    this.setOrigin(1, 1)

    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(40, 54, 48, 53)
    })

    this.currentScene.anims.create({
      key: 'running',
      frames: this.currentScene.anims.generateFrameNumbers('running', {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      }),
      repeat: -1
    })
    this.currentScene.anims.create({
      key: 'death',
      frames: this.currentScene.anims.generateFrameNumbers('death', {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
      }),
      repeat: 0
    })
    this.anims.play('running', true)

    this.currentScene.input.on('pointerdown', this.jump, this)

    this.currentScene.physics.world.enable(this)

    this.body
      .setSize(48, 73)
      .setOffset(40, 34)
      .setGravity(0)
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

  public die(): void {
    console.log('die')
    this.body.setGravityY(-CONST.GRAVITY + 50)
    this.body.setVelocityY(0)
    this.body.setVelocityX(0)
    this.anims.play('death', true)
    // this.active = false
  }
}
