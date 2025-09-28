// FILE: src/entities/Player.js
import Phaser from "phaser";
import config from "../config.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.hp = config.player.hp;
    this.speed = config.player.speed;
    this.fireRate = config.player.fireRate;
    this.bulletDamage = config.player.bulletDamage;
    this.dashCooldown = config.player.dashCooldown;

    this.lastShot = 0;
    this.lastDash = 0;

    this.pad = null;

    // Keyboard controls
    this.keys = scene.input.keyboard.addKeys("W,A,S,D,SPACE");

    // Safely enable gamepad if plugin exists
    if (scene.input && scene.input.gamepad) {
      scene.input.gamepad.once("connected", pad => { this.pad = pad; });
    }

    // Procedural graphics
    const g = scene.add.graphics();
    g.fillStyle(0x220033).fillCircle(0, 0, 16);
    g.lineStyle(2, 0x7a00ff).strokeCircle(0, 0, 18);
    this.setTexture(g.generateTexture("player-shape", 36, 36));
    g.destroy();
    this.setDisplaySize(36, 36);
  }

  update(time) {
    this.handleKeyboard();
    this.handleGamepad();

    if (this.body.velocity.lengthSq() > 0) {
      this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
      this.tryShoot(time);
    }

    if (this.keys.SPACE.isDown || this.isGamepadDash()) {
      this.tryDash(time);
    }
  }

  handleKeyboard() {
    let vx = 0, vy = 0;
    if (this.keys.W.isDown) vy -= 1;
    if (this.keys.S.isDown) vy += 1;
    if (this.keys.A.isDown) vx -= 1;
    if (this.keys.D.isDown) vx += 1;

    const len = Math.hypot(vx, vy) || 1;
    this.setVelocity((vx / len) * this.speed, (vy / len) * this.speed);
  }

  handleGamepad() {
    if (!this.pad) return;

    const x = this.pad.axes[0]?.getValue() || 0;
    const y = this.pad.axes[1]?.getValue() || 0;

    if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1) {
      const len = Math.hypot(x, y) || 1;
      this.setVelocity((x / len) * this.speed, (y / len) * this.speed);
    }
  }

  isGamepadDash() {
    return this.pad?.buttons[0]?.pressed || false;
  }

  tryShoot(time) {
    if (time - this.lastShot < this.fireRate) return;
    this.lastShot = time;
    this.scene.spawnBullet(this.x, this.y, this.rotation);
  }

  tryDash(time) {
    if (time - this.lastDash < this.dashCooldown) return;
    this.lastDash = time;
    const dx = Math.cos(this.rotation);
    const dy = Math.sin(this.rotation);
    this.setVelocity(dx * 800, dy * 800);
    this.scene.time.delayedCall(150, () => this.setVelocity(0, 0));
  }

  takeDamage(dmg) {
    this.hp -= dmg;
    if (this.hp <= 0) this.scene.playerDie();
  }
}

