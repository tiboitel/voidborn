export default {
  game: {
    width: 1280,
    height: 720,
    background: "#110022"
  },
  player: {
    hp: 100,
    speed: 220,
    fireRate: 200,
    bulletDamage: 15,
    dashCooldown: 1000
  },
  enemies: {
    melee: { hp: 30, speed: 80, damage: 10 },
    ranged: { hp: 20, speed: 60, damage: 6 },
    fast: { hp: 12, speed: 140, damage: 6 },
    boss: { hp: 300, speed: 40, damage: 25 }
  },
  talents: {
    maxPassives: 6,
    maxActives: 2,
    xpThresholds: [100, 300, 600, 1200, 2000],
    rarity: { common: 0.7, rare: 0.25, epic: 0.05 }
  }
};

