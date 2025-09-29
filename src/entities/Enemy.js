// FILE: src/entities/Enemy.js
import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, type, wave) {
		super(scene, x, y);
		scene.add.existing(this);
		scene.physics.add.existing(this);

		const base = {
			melee: { hp: 20, spd: 80, dmg: 20 },
			ranged: { hp: 15, spd: 60, dmg: 12 },
			fast: { hp: 10, spd: 140, dmg: 10 },
			boss: { hp: 300, spd: 40, dmg: 25 }
		};
		this.stats = base[type] || base.melee;
		this.hp = this.stats.hp * (1 + wave * 0.05);
		this.speed = this.stats.spd;
		this.dmg = this.stats.dmg * (1 + wave * 0.04);

		// Procedural shape

		const g = scene.add.graphics();
		g.fillStyle(0x00ffff, 1);
		g.fillCircle(12, 12, 12);
		g.generateTexture("enemy-melee", 24, 24);
		g.destroy();
		this.setTexture("enemy-melee");
		this.setDisplaySize(24, 24);

	}

	preUpdate(_, dt) {
		const p = this.scene.player;
		if (!p) return;
		const dx = p.x - this.x,
			dy = p.y - this.y;
		const ang = Math.atan2(dy, dx);
		this.setVelocity(Math.cos(ang) * this.speed, Math.sin(ang) * this.speed);
	}

	takeDamage(d) {
		this.hp -= d;
		if (this.hp <= 0) this.die();
	}

	die() {
		this.scene.enemyDie(this);
		this.destroy();
	}
}

