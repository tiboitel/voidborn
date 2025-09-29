// FILE: src/entities/Bullet.js
import Phaser from "phaser";

export default class Bullet extends Phaser.Physics.Arcade.Image {
  constructor(scene, x = 0, y = 0) {
    if (!scene.textures.exists("bullet")) {
      const g = scene.add.graphics();
      g.fillStyle(0x00ffff, 1).fillCircle(5, 5, 5);
      g.generateTexture("bullet", 10, 10);
      g.destroy();
    }

    super(scene, x, y, "bullet");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setActive(false);
    this.setVisible(false);

    this.speed = 600;
    this.lifespan = 1800; // ms
    this.damage = 10;

    if (this.body) this.body.setAllowGravity(false);

    this._lifeTimer = null;
  }

  fire(x, y, targetPoint, rotation, damage = 15) {
    this.setPosition(x, y);
    this.damage = damage;
    this.setActive(true);
    this.setVisible(true);

    if (!this.body) this.scene.physics.add.existing(this);
    this.body.reset(x, y);
    this.body.setAllowGravity(false);

    if (targetPoint) {
      const dir = new Phaser.Math.Vector2(targetPoint.x - x, targetPoint.y - y);
      dir.normalize();
      this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
    } else {
      this.body.setVelocity(Math.cos(rotation) * this.speed, Math.sin(rotation) * this.speed);
    }

    if (this._lifeTimer) this._lifeTimer.remove(false);
    this._lifeTimer = this.scene.time.delayedCall(this.lifespan, () => {
      if (this && this.active) this.destroy();
    });
  }

  preUpdate(time, delta) {
    // In the handsome world of the future: check world bounds and destroy when offscreen.
  }
}

