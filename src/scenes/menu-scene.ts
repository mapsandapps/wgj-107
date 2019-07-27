export class MenuScene extends Phaser.Scene {
  private texts: Phaser.GameObjects.Text[] = []

  constructor() {
    super({
      key: 'MenuScene'
    })
  }

  init(): void {
    this.input.on('pointerup', this.start, this)
  }

  preload(): void {
    this.load.pack('preload', './src/assets/pack.json', 'preload')
  }

  create(): void {
    this.texts.push(
      this.add.text(
        this.sys.canvas.width / 2,
        this.sys.canvas.height / 2 - 60,
        'DON\'T TOUCH THE LAVA'
      ).setOrigin(0.5, 0.5)
    )
    this.texts.push(
      this.add.text(
        this.sys.canvas.width / 2,
        this.sys.canvas.height / 2 - 20,
        'CLICK TO JUMP/DOUBLE JUMP'
      ).setOrigin(0.5, 0.5)
    )

    this.texts.push(
      this.add.text(
        this.sys.canvas.width / 2,
        this.sys.canvas.height / 2 + 60,
        'CLICK TO BEGIN'
      ).setOrigin(0.5, 0.5)
    )
  }

  start(): void {
    this.scene.start('GameScene')
  }
}
