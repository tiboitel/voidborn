import Phaser from "phaser";
import BootScene from "./scenes/BootScene.js";
import GameScene from "./scenes/GameScene.js";
import UIScene from "./scenes/UIScene.js";

const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: 1280,
  height: 720,
  backgroundColor: "#110022",
  physics: { default: "arcade" },
  scene: [BootScene, GameScene, UIScene]
};

new Phaser.Game(config);

