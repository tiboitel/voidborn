// FILE: src/entities/Bullet.js
import Phaser from "phaser";

export default class Bullet extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, targetPoint, rotation, damage) {
    super(scene, x, y, "bullet");  // it’s an Arcade.Image with built-in body support
    scene.add.existing(this);
    scene.physics.add.existing(this); // **enable dynamic body**

    this.damage = damage;
    this.speed = 500;
    this.targetPoint = targetPoint ? targetPoint.clone() : null;

    // Generate texture once
    if (!scene.textures.exists("bullet")) {
      const g = scene.add.graphics();
      g.fillStyle(0x00ffff, 1).fillCircle(5, 5, 5);
      g.generateTexture("bullet", 10, 10);
      g.destroy();
    }
    this.setTexture("bullet");
    this.setDisplaySize(10, 10);

    // Now the body is enabled — apply velocity
    if (this.targetPoint) {
      const dir = this.targetPoint.clone().subtract(this).normalize();
      this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
    } else {
      this.body.setVelocity(Math.cos(rotation) * this.speed, Math.sin(rotation) * this.speed);
    }

    console.log(this.body.velocity);
    this.lifespan = 2000;
    scene.time.delayedCall(this.lifespan, () => {
      if (this.active) this.destroy();
    });
  }

  update(time, delta) {
    if (!this.active || !this.targetPoint) return;

    const distSq = Phaser.Math.Distance.Squared(
      this.x,
      this.y,
      this.targetPoint.x,
      this.targetPoint.y
    );
    if (distSq < 16) {
      this.destroy();
    }
  }
}

