// FILE: src/scenes/GameScene.js (spawnBullet fixed)
import Player from "../entities/Player.js";
import Enemy from "../entities/Enemy.js";
import Bullet from "../entities/Bullet.js";
import WaveSpawner from "../systems/WaveSpawner.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.player = new Player(this, this.scale.width / 2, this.scale.height / 2);

    this.enemies = this.physics.add.group();
    this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

    this.waveSpawner = new WaveSpawner(this);

    // Collisions
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
    let targetPoint = null;
    let minDistSq = Infinity;

    this.enemies.getChildren().forEach(e => {
      const d = Phaser.Math.Distance.Squared(x, y, e.x, e.y);
      if (d < minDistSq) {
        minDistSq = d;
        targetPoint = new Phaser.Math.Vector2(e.x, e.y);
      }
    });

    // 🔥 Use group.get to create with Arcade body
    const bullet = this.bullets.get(x, y, "bullet");
    if (bullet) {
      bullet.fire(this, targetPoint, rot, dmg);
    }
  }

  update(t, dt) {
    this.player.update(t);
    this.waveSpawner.update(t, dt);
  }


  enemyDie(enemy) {
    this.events.emit("enemy-dead", { xp: 10 });
  }

  playerDie() {
    this.scene.pause();
    this.scene.get("UIScene").events.emit("player-dead", { wave: this.wave });
  }

}

