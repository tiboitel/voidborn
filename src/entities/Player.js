export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene,x,y){
    super(scene,x,y);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.hp=100; this.maxHp=100;
    this.speed=220;
    this.lastShot=0; this.fireRate=200;
    this.lastDash=0; this.dashCooldown=1000;

    // procedural style
    const g=scene.add.graphics();
    g.fillStyle(0x220033).fillCircle(0,0,16);
    g.lineStyle(2,0x7a00ff).strokeCircle(0,0,18);
    this.setTexture(g.generateTexture("player",36,36));
    g.destroy();
    this.setDisplaySize(36,36);
  }

  update(time){
    const keys=this.scene.input.keyboard.addKeys("W,A,S,D,SPACE");
    let vx=0,vy=0;
    if(keys.W.isDown) vy-=1;
    if(keys.S.isDown) vy+=1;
    if(keys.A.isDown) vx-=1;
    if(keys.D.isDown) vx+=1;
    const len=Math.hypot(vx,vy)||1;
    this.setVelocity((vx/len)*this.speed,(vy/len)*this.speed);
    if(vx||vy){ this.rotation=Math.atan2(vy,vx); this.tryShoot(time); }
    if(keys.SPACE.isDown) this.tryDash(time);
  }

  tryShoot(time){
    if(time-this.lastShot<this.fireRate) return;
    this.lastShot=time;
    this.scene.spawnBullet(this.x,this.y,this.rotation);
  }

  tryDash(time){
    if(time-this.lastDash<this.dashCooldown) return;
    this.lastDash=time;
    const dx=Math.cos(this.rotation),dy=Math.sin(this.rotation);
    this.setVelocity(dx*800,dy*800);
    this.scene.time.delayedCall(150,()=>this.setVelocity(0,0));
  }

  takeDamage(dmg){ this.hp-=dmg; if(this.hp<=0) this.scene.playerDie(); }
}

