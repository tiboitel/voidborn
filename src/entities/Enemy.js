// FILE: src/entities/Enemy.js
import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = "melee", wave = 1) {
    super(scene, x, y);

    // Add to scene & enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Stats
    const base = {
      melee: { hp: 20, spd: 80, dmg: 20 },
      ranged: { hp: 15, spd: 60, dmg: 12 },
      fast: { hp: 10, spd: 140, dmg: 10 },
      boss: { hp: 300, spd: 40, dmg: 25 }
    };

    this.kind = type;
    this.stats = base[type] || base.melee;
    this.maxHp = this.stats.hp * (1 + (wave - 1) * 0.05);
    this.hp = this.maxHp;
    this.speed = this.stats.spd;
    this.dmg = this.stats.dmg * (1 + (wave - 1) * 0.04);

    // Procedural texture key per type (generate only once)
    const key = `enemy-${type}`;
    if (!scene.textures.exists(key)) {
      const g = scene.add.graphics();
      const color = type === "boss" ? 0xff55aa : 0x00ffff;
      g.fillStyle(color, 1).fillCircle(12, 12, 12);
      g.generateTexture(key, 24, 24);
      g.destroy();
    }
    this.setTexture(key);
    this.setDisplaySize(24, 24);

    // Physics tuning
    if (this.body) {
      this.body.setCollideWorldBounds(false);
      this.body.setCircle(12);
      this.body.setAllowGravity(false);
    }
  }

  // Proper preUpdate signature and call to super
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    const p = this.scene.player;
    if (!p || !p.active) return;

    const dx = p.x - this.x;
    const dy = p.y - this.y;
    const ang = Math.atan2(dy, dx);
    const vx = Math.cos(ang) * this.speed;
    const vy = Math.sin(ang) * this.speed;

    if (this.body) this.body.setVelocity(vx, vy);
    else this.setVelocity(vx, vy);
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) this.die();
  }

  die() {
    this.scene.enemyDie(this);
    this.destroy();
  }
}

