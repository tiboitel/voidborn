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

		// Keyboard
		this.keys = scene.input.keyboard.addKeys("W,A,S,D,SPACE");

		// Enable gamepad safely
		this.pad = null;
		if (scene.input.gamepad) {
			scene.input.gamepad.once("connected", pad => {
				this.pad = pad;
			});
		}

		// Procedural graphics
		// Procedural player graphics
		const g = scene.add.graphics();
		g.fillStyle(0x7a00ff, 1);
		g.fillCircle(20, 20, 18); // draw circle at center of 40x40 canvas
		g.lineStyle(2, 0x00ffff);
		g.strokeCircle(20, 20, 18);
		g.generateTexture("player-shape", 40, 40); // creates texture key
		g.destroy();

		this.setTexture("player-shape"); // use the key
		this.setDisplaySize(40, 40);
	}

	update(time) {
		this.handleMovement();
		this.handleGamepad();

		if (this.body.velocity.lengthSq() > 0) {
			this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
			this.tryShoot(time);
		}

		if (this.keys.SPACE.isDown || this.isGamepadDash()) {
			this.tryDash(time);
		}
	}

	handleMovement() {
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
		this.scene.spawnBullet(this.x, this.y, this.rotation, this.bulletDamage);
	}

	tryDash(time) {
		if (time - this.lastDash < this.dashCooldown) return;
		this.lastDash = time;
		const dx = Math.cos(this.rotation), dy = Math.sin(this.rotation);
		this.setVelocity(dx * 1000, dy * 1000);
		this.scene.cameras.main.flash(50, 120, 0, 255);
		this.scene.time.delayedCall(200, () => this.setVelocity(0, 0));
	}

	takeDamage(dmg) {
		this.hp -= dmg;
		if (this.hp <= 0) this.scene.playerDie();
	}
}

