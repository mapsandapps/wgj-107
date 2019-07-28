import { CONST } from '../helpers/const'
import { Lava } from '../objects/lava'
import { Platform } from '../objects/platform'
import { Player } from '../objects/player'

export class GameScene extends Phaser.Scene {
  public platformGroup: Phaser.GameObjects.Group // active platforms
  public platformPool: Phaser.GameObjects.Group // inactive platforms

  private highScore: number
  private nextPlatformDistance: number
  private player: Player
  private score: number
  private scoreText: Phaser.GameObjects.Text

  constructor() {
    super({
      key: "GameScene"
    })
  }

  init(): void {
    let storedHighScore = localStorage.getItem('runnerHighScore')
    this.highScore = storedHighScore ? parseInt(storedHighScore) : 0
    this.score = 0
    this.scoreText = new Phaser.GameObjects.Text(this, 10, 10, '', {})
    this.add.existing(this.scoreText)
  }

  create(): void {
    new Lava(this)

    this.platformGroup = new Phaser.GameObjects.Group(this)
    this.platformGroup.removeCallback = platform => {
      this.platformPool.add(platform)
    }

    this.platformPool = new Phaser.GameObjects.Group(this)
    this.platformPool.removeCallback = platform => {
      this.platformGroup.add(platform)
    }

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
    this.score++
    this.scoreText.setText(`Score: ${this.score}\nHigh Score: ${this.highScore}`)
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

    let loseText

    if (this.score > this.highScore) {
      this.highScore = this.score
      localStorage.setItem('runnerHighScore', `${this.highScore}`)
      loseText = '\nNew high score!!!'
    } else {
      loseText = 'Oh no!\nYou lost!'
    }

    this.add.text(
      this.player.x,
      this.player.y - 50,
      loseText, {
        align: 'center'
      }
    ).setOrigin(0.5, 1)
  }

  private exitToWinScene(): void {
    this.setObjectsInactive()
    this.scene.stop()
    this.scene.get('WinScene').scene.start()
  }
}
