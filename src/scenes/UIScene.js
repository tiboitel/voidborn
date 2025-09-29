export default class UIScene extends Phaser.Scene{
	constructor(){ super("UIScene"); }
	create(){
		this.hpText=this.add.text(10,10,"HP:100",{fill:"#fff"});
		this.xp=0;this.level=1;
		this.xpText=this.add.text(10,30,"XP:0 Lv1",{fill:"#0ff"});

		this.scene.get("GameScene").events.on("enemy-dead",d=>this.addXp(d.xp));
		this.scene.get("GameScene").events.on("player-dead",d=>this.showDeath(d.wave));
	}

	// FILE: src/scenes/UIScene.js (safe level-up)
	addXp(x) {
		this.xp += x;
		const thresholds = this.level * 100;
		if (this.xp >= thresholds) {
			this.xp -= thresholds;
			this.level++;
			// safe prompt stub
			setTimeout(() => alert("Level Up! Pick talent (stub)"), 50);
		}
		this.xpText.setText(`XP:${this.xp} Lv${this.level}`);
	}


	showDeath(wave){
		this.add.text(400,300,`You died at wave ${wave}\nPress R to restart`,
			{fill:"#f0f"}).setOrigin(0.5);
		this.input.keyboard.once("keydown-R",()=>location.reload());
	}
}

