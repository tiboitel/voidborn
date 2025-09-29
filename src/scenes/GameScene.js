// FILE: src/scenes/GameScene.js
import Player from "../entities/Player.js";
import Enemy from "../entities/Enemy.js";
import Bullet from "../entities/Bullet.js";
import WaveSpawner from "../systems/WaveSpawner.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    // Player
    this.player = new Player(this, this.scale.width / 2, this.scale.height / 2);

    // Groups
    this.enemies = this.physics.add.group();
    // We'll manually instantiate bullets but keep them in a physics group for collisions.
    this.bullets = this.physics.add.group({ runChildUpdate: true });

    // Spawner
    this.waveSpawner = new WaveSpawner(this);

    // Collisions: bullet vs enemy
    this.physics.add.collider(this.bullets, this.enemies, (bullet, enemy) => {
      if (!bullet.active || !enemy.active) return;
      // Apply damage and destroy bullet
      if (typeof bullet.damage === "number") enemy.takeDamage(bullet.damage);
      bullet.destroy();
    });

    // Player vs enemy
    this.physics.add.overlap(this.player, this.enemies, (p, e) => {
      if (!p.active || !e.active) return;
      p.takeDamage(e.dmg);
    });

    // optional: camera center convenience
    this.center = { x: Math.round(this.scale.width / 2), y: Math.round(this.scale.height / 2) };
  }

  // spawnBullet creates a brand-new Bullet instance, fires it, and adds to bullets group.
  spawnBullet(x, y, rot, dmg = 15) {
    // pick closest enemy snapshot
    let targetPoint = null;
    const enemies = this.enemies.getChildren();
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
      if (closest) targetPoint = new Phaser.Math.Vector2(closest.x, closest.y);
    }

    // Create bullet explicitly (constructor ensures body exists)
    const bullet = new Bullet(this, x, y);
    this.bullets.add(bullet);
    bullet.fire(x, y, targetPoint, rot, dmg);
  }

  update(t, dt) {
    if (this.player && this.player.update) this.player.update(t);
    if (this.waveSpawner) this.waveSpawner.update(t, dt);
  }

  enemyDie(enemy) {
    this.events.emit("enemy-dead", { xp: 10 });
  }

  playerDie() {
    this.scene.pause();
    this.scene.get("UIScene").events.emit("player-dead", { wave: this.waveSpawner?.currentWave || 0 });
  }
}

