const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  backgroundColor: "#87ceeb",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 600 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let player;
let cursors;
let platforms;
let enemies;

function preload() {
  this.load.image('bg', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('platform-ice', 'assets/platform-ice.png');
  this.load.image('tree', 'assets/tree.png');
  this.load.image('enemy', 'assets/enemy.png');
  this.load.json('levels', 'assets/levels.json');
}

function create() {
  this.add.image(0, 0, 'bg').setOrigin(0).setScrollFactor(0);

  this.cameras.main.setBounds(0, 0, 2000, 450);
  this.physics.world.setBounds(0, 0, 2000, 450);

  platforms = this.physics.add.staticGroup();
  const levelData = this.cache.json.get('levels').level1;

  levelData.platforms.forEach(pos => {
    const type = pos.type === 'ice' ? 'platform-ice' : 'ground';
    platforms.create(pos.x, pos.y, type);
  });

  // Dekor
  levelData.decor.forEach(item => {
    this.add.image(item.x, item.y, item.key).setScrollFactor(1);
  });

  player = this.physics.add.sprite(100, 300, 'player').setBounce(0.2);
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, platforms);
  this.cameras.main.startFollow(player);

  cursors = this.input.keyboard.createCursorKeys();

  // Fiender
  enemies = this.physics.add.group();
  const enemy = enemies.create(800, 200, 'enemy');
  enemy.setVelocityX(100);
  enemy.setBounce(1);
  enemy.setCollideWorldBounds(true);
  this.physics.add.collider(enemies, platforms);
  this.physics.add.collider(player, enemies, hitEnemy, null, this);
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
  } else {
    player.setVelocityX(0);
  }

  if (cursors.up.isDown && player.body.blocked.down) {
    player.setVelocityY(-400);
  }
}

function hitEnemy(player, enemy) {
  this.physics.pause();
  player.setTint(0xff0000);
  player.setVelocity(0, 0);
  this.time.delayedCall(1000, () => {
    this.scene.restart();
  });
}
