import { CONST } from '../helpers/const'
import { Platform } from '../objects/platform'
import { Player } from '../objects/player'

export class GameScene extends Phaser.Scene {
  public platformGroup: Phaser.GameObjects.Group // active platforms
  public platformPool: Phaser.GameObjects.Group // inactive platforms

  private nextPlatformDistance: number
  private player: Player

  constructor() {
    super({
      key: "GameScene"
    })
  }

  init(): void { }

  create(): void {
    this.platformGroup = new Phaser.GameObjects.Group(this)
    this.platformGroup.removeCallback = platform => {
      this.platformPool.add(platform)
      console.log(`moved platform from platformgroup (${this.platformGroup.getLength()}) to platformpool (${this.platformPool.getLength()})`)
    }

    this.platformPool = new Phaser.GameObjects.Group(this)
    this.platformPool.removeCallback = platform => {
      this.platformGroup.add(platform)
      console.log(`moved platform from platformpool (${this.platformPool.getLength()}) to platformgroup (${this.platformGroup.getLength()})`)
    }

    let lava = new Phaser.GameObjects.Rectangle(this, 0, CONST.GAME.HEIGHT - 20, CONST.GAME.WIDTH, 20, 0xff0000)
    lava.setOrigin(0, 0)
    this.add.existing(lava)

    this.addPlatform(CONST.GAME.WIDTH, CONST.GAME.WIDTH / 2, CONST.GAME.HEIGHT * 0.8)

    this.player = new Player({
      scene: this,
      x: CONST.PLAYER_START_POSITION,
      y: CONST.GAME.HEIGHT / 2,
      key: 'player'
    })

    this.physics.add.collider(this.player, this.platformGroup)
  }

  private addPlatform(platformWidth, posX, posY) {
    let platform
    if (this.platformPool.getLength()) {
      // reuse a platform from the pool
      platform = this.platformPool.getFirst()
      platform.x = posX
      platform.active = true
      platform.visible = true
      this.platformPool.remove(platform)
    } else {
      // make a new platform to get reused later
      platform = new Platform({
        scene: this,
        x: posX,
        y: posY,
        key: 'platform'
      })
      this.platformGroup.add(platform)
    }
    platform.displayWidth = platformWidth
    this.nextPlatformDistance = Phaser.Math.Between(CONST.SPAWN_RANGE[0], CONST.SPAWN_RANGE[1])
  }

  update(): void {
    if (this.player.y > CONST.GAME.HEIGHT) {
      this.gameLost()
    }
    this.player.x = CONST.PLAYER_START_POSITION

    let minDistance = CONST.GAME.WIDTH
    this.platformGroup.getChildren().forEach(platform => {
      // @ts-ignore
      let platformDistance = CONST.GAME.WIDTH - platform.x - platform.displayWidth / 2
      minDistance = Math.min(minDistance, platformDistance)
      // @ts-ignore
      if (platform.x < - platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform)
        this.platformGroup.remove(platform)
      }
    }, this)

    if (minDistance > this.nextPlatformDistance) {
      let nextPlatformWidth = Phaser.Math.Between(CONST.PLATFORM_SIZE_RANGE[0], CONST.PLATFORM_SIZE_RANGE[1])
      let nextPlatformY = Phaser.Math.Between(60, CONST.GAME.HEIGHT - 30)
      this.addPlatform(nextPlatformWidth, CONST.GAME.WIDTH + nextPlatformWidth, nextPlatformY)
    }

    // this.player.update()
  }

  private restartScene(): void {
    this.scene.restart()
  }

  private setObjectsInactive(): void {
    this.player.setActive(false)
  }

  private gameLost(): void {
    this.player.active = false
    this.scene.pause()

    this.add.text(
      this.player.x,
      this.player.y - 60,
      'Oh no!\nYou lost!', {
        align: 'center'
      }
    ).setOrigin(0.5, 0.5)
  }

  private exitToWinScene(): void {
    this.setObjectsInactive()
    this.scene.stop()
    this.scene.get('WinScene').scene.start()
  }
}
