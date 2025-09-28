export default class UIScene extends Phaser.Scene{
  constructor(){ super("UIScene"); }
  create(){
    this.hpText=this.add.text(10,10,"HP:100",{fill:"#fff"});
    this.xp=0;this.level=1;
    this.xpText=this.add.text(10,30,"XP:0 Lv1",{fill:"#0ff"});

    this.scene.get("GameScene").events.on("enemy-dead",d=>this.addXp(d.xp));
    this.scene.get("GameScene").events.on("player-dead",d=>this.showDeath(d.wave));
  }
  addXp(x){
    this.xp+=x;
    if(this.xp>=100*this.level){
      this.xp-=100*this.level; this.level++;
      // [KISS] simple talent selection popup
      alert("Level Up! Pick talent (stub)");
    }
    this.xpText.setText(`XP:${this.xp} Lv${this.level}`);
  }
  showDeath(wave){
    this.add.text(400,300,`You died at wave ${wave}\nPress R to restart`,
      {fill:"#f0f"}).setOrigin(0.5);
    this.input.keyboard.once("keydown-R",()=>location.reload());
  }
}

