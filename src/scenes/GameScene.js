import Player from "../entities/Player.js";
import Enemy from "../entities/Enemy.js";

export default class GameScene extends Phaser.Scene {
  constructor(){ super("GameScene"); }

  create(){
    this.player=new Player(this,this.scale.width/2,this.scale.height/2);
    this.enemies=this.physics.add.group();
    this.bullets=this.physics.add.group();
    this.wave=0; this.nextWave=0;

    this.physics.add.collider(this.bullets,this.enemies,
      (b,e)=>{ e.takeDamage(15); b.destroy(); });

    this.physics.add.overlap(this.player,this.enemies,
      (p,e)=>{ p.takeDamage(e.dmg); });
  }

  spawnBullet(x,y,rot){
    const b=this.physics.add.image(x,y).setCircle(4).setTint(0x00ffff);
    b.setVelocity(Math.cos(rot)*600,Math.sin(rot)*600);
    this.bullets.add(b);
    this.time.delayedCall(1200,()=>b.destroy());
  }

  spawnWave(){
    this.wave++;
    for(let i=0;i<5+this.wave;i++){
      const x=Phaser.Math.Between(0,this.scale.width);
      const y=Phaser.Math.Between(0,this.scale.height);
      const e=new Enemy(this,x,y,"melee",this.wave);
      this.enemies.add(e);
    }
  }

  enemyDie(enemy){
    this.events.emit("enemy-dead",{xp:10});
  }

  playerDie(){
    this.scene.pause();
    this.scene.get("UIScene").events.emit("player-dead",{wave:this.wave});
  }

  update(t){ this.player.update(t); if(t>this.nextWave){ this.spawnWave(); this.nextWave=t+5000; } }
}

