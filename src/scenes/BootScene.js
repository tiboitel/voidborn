export default class BootScene extends Phaser.Scene {
  constructor(){ super("BootScene"); }
  create(){
    this.scene.start("GameScene");
    this.scene.launch("UIScene");
  }
}

