export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene,x,y,type,wave){
    super(scene,x,y);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const base={melee:{hp:15,spd:80,dmg:10},
                ranged:{hp:10,spd:60,dmg:6},
                fast:{hp:6,spd:140,dmg:6}};
    this.stats=base[type]||base.melee;
    this.hp=this.stats.hp*(1+wave*0.05);
    this.speed=this.stats.spd;
    this.dmg=this.stats.dmg*(1+wave*0.04);

    const g=scene.add.graphics();
    g.fillStyle(0x00ffff).fillCircle(0,0,12);
    this.setTexture(g.generateTexture("enemy"+type,24,24));
    g.destroy();
    this.setDisplaySize(24,24);
  }

  preUpdate(_,dt){
    const p=this.scene.player; if(!p) return;
    const dx=p.x-this.x,dy=p.y-this.y;
    const ang=Math.atan2(dy,dx);
    this.setVelocity(Math.cos(ang)*this.speed,Math.sin(ang)*this.speed);
  }

  takeDamage(d){ this.hp-=d; if(this.hp<=0) this.die(); }
  die(){ this.scene.enemyDie(this); this.destroy(); }
}

