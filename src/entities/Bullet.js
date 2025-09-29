import Phaser from "phaser";

export default class Bullet extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "bullet");

    if (!scene.textures.exists("bullet")) {
      const g = scene.add.graphics();
      g.fillStyle(0x00ffff, 1).fillCircle(5, 5, 5);
      g.generateTexture("bullet", 10, 10);
      g.destroy();
    }
  }

  fire(scene, targetPoint, rotation, damage) {
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.damage = damage;
    this.speed = 500;
    this.setActive(true);
    this.setVisible(true);
    this.setTexture("bullet");
    this.setDisplaySize(10, 10);
    this.setPosition(this.x, this.y);

    if (targetPoint) {
      const dir = new Phaser.Math.Vector2(targetPoint.x - this.x, targetPoint.y - this.y).normalize();
      this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
    } else {
      this.body.setVelocity(Math.cos(rotation) * this.speed, Math.sin(rotation) * this.speed);
    }

    this.scene.time.delayedCall(2000, () => this.destroy());
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta); // keep body synced
  }
}

