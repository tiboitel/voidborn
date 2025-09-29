// FILE: src/scenes/GameScene.js (spawnBullet fixed)
import Player from "../entities/Player.js";
import Enemy from "../entities/Enemy.js";
import Bullet from "../entities/Bullet.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.player = new Player(this, this.scale.width / 2, this.scale.height / 2);
    this.enemies = this.physics.add.group();
    this.bullets = this.physics.add.group({ classType: Bullet });

    this.physics.add.collider(this.bullets, this.enemies, (bullet, enemy) => {
      if (!bullet.active || !enemy.active) return;
      enemy.takeDamage(bullet.damage);
      bullet.destroy();
    });

    this.physics.add.overlap(this.player, this.enemies, (p, e) => {
      p.takeDamage(e.dmg);
    });
  }

  spawnBullet(x, y, rot, dmg = 15) {
    const enemies = this.enemies.getChildren();

    let targetPoint = null;
    if (enemies.length > 0) {
      let closest = null;
      let minDistSq = Infinity;
      for (let e of enemies) {
        const d = Phaser.Math.Distance.Squared(x, y, e.x, e.y);
        if (d < minDistSq) {
          minDistSq = d;
          closest = e;
        }
      }
      if (closest) {
        targetPoint = new Phaser.Math.Vector2(closest.x, closest.y);
      }
    }

    const bullet = new Bullet(this, x, y, targetPoint, rot, dmg);
    this.bullets.add(bullet);
  }

  spawnWave() {

    this.wave = (this.wave || 0) + 1;
    for (let i = 0; i < 5 + this.wave; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const e = new Enemy(this, x, y, "melee", this.wave);
      this.enemies.add(e);
    }
  }

  enemyDie(enemy) {
    this.events.emit("enemy-dead", { xp: 10 });
  }

  playerDie() {
    this.scene.pause();
    this.scene.get("UIScene").events.emit("player-dead", { wave: this.wave });
  }

  update(t) {
    this.player.update(t);
    if (!this.nextWave || t > this.nextWave) {
      this.spawnWave();
      this.nextWave = t + 5000;
    }
  }
}

