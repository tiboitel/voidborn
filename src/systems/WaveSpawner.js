import Phaser from "phaser";
import Enemy from "../entities/Enemy.js";

export default class WaveSpawner {
  constructor(scene){
    this.scene = scene;
    this.currentWave = 0;
    this.nextWaveAt = 0;
    this.waveInterval = 4000;
    this.active = true;
  }

  spawnWave(){
    this.currentWave++;
    const count = 3 + Math.floor(this.currentWave * 1.2);
    for(let i=0;i<count;i++){
      const angle = Math.random()*Math.PI*2;
      const r = 300 + Math.random()*200 + this.currentWave*10;
      const x = this.scene.center.x + Math.cos(angle)*r;
      const y = this.scene.center.y + Math.sin(angle)*r;
      const type = (Math.random() < 0.6) ? 'melee' : (Math.random()<0.8 ? 'ranged' : 'fast');
      const e = new Enemy(this.scene, x, y, type, this.currentWave);
      this.scene.add.existing(e);
      this.scene.enemies.add(e);
    }
    if(this.currentWave % 5 === 0){
      // spawn mini-boss
      const boss = new Enemy(this.scene, this.scene.center.x + 400, this.scene.center.y, 'boss', this.currentWave);
      this.scene.add.existing(boss);
      this.scene.enemies.add(boss);
    }
  }

  update(time,dt){
    if(time > this.nextWaveAt){
      this.spawnWave();
      this.nextWaveAt = time + this.waveInterval;
    }
  }
}

