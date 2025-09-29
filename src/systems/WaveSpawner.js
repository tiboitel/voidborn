// FILE: src/systems/WaveSpawner.js
import Phaser from "phaser";
import Enemy from "../entities/Enemy.js";

export default class WaveSpawner {
  constructor(scene) {
    this.scene = scene;
    this.currentWave = 0;
    this.nextWaveAt = 0;
    this.waveInterval = 4000;
    this.active = true;
  }

  spawnWave() {
    this.currentWave++;
    const count = 3 + Math.floor(this.currentWave * 1.2);

    // compute center of playfield from scene scale (no external dependencies)
    const cx = Math.round(this.scene.scale.width / 2);
    const cy = Math.round(this.scene.scale.height / 2);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 300 + Math.random() * 200 + this.currentWave * 10;
      const x = Math.round(cx + Math.cos(angle) * r);
      const y = Math.round(cy + Math.sin(angle) * r);
      const type = Math.random() < 0.6 ? "melee" : Math.random() < 0.8 ? "ranged" : "fast";
      const e = new Enemy(this.scene, x, y, type, this.currentWave);
      this.scene.enemies.add(e);
    }

    if (this.currentWave % 5 === 0) {
      const bossX = Math.round(cx + 400);
      const bossY = cy;
      const boss = new Enemy(this.scene, bossX, bossY, "boss", this.currentWave);
      this.scene.enemies.add(boss);
    }
  }

  update(time, dt) {
    if (!this.active) return;
    if (time > this.nextWaveAt) {
      this.spawnWave();
      this.nextWaveAt = time + this.waveInterval;
    }
  }
}

