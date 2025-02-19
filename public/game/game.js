import Phaser from "https://esm.sh/phaser";

export function startGame() {
    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        physics: {
            default: "arcade",
            arcade: { gravity: { y: 900}, debug: false}
        },
        scene: { preload, create, update}
    }
    
    function preload() {
        this.load.image("background", "./../assets/background/background.png");
        this.load.spritesheet("playerIdle", "./../assets/player/playerIdle.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("enemyIdle", "./../assets/enemy/enemyIdle.png", {
            frameWidth: 128,
            frameHeight: 128
        });
    }
    
    let player;
    let enemy;
    let ground;
    let playerJumpCount = 0;
    let enemyJumpCount = 0;

    function create() {
        this.add.image(window.innerWidth / 2, window.innerHeight / 2, "background")
        .setDisplaySize(window.innerWidth, window.innerHeight);

        player = this.physics.add.sprite(150,150, "playerIdle");
        player.setCollideWorldBounds(true);

        enemy = this.physics.add.sprite(600,150, "enemyIdle");
        enemy.setCollideWorldBounds(true);

        ground = this.physics.add.staticGroup();
        let groundHitbox = ground.create(400,580,null);
        groundHitbox.setSize(800, 20).refreshBody();
        groundHitbox.setVisible(false);

        this.physics.add.collider(player, ground, () => {
            if (player.body.touching.down) {
                playerJumpCount = 0;
            }
        })

        this.physics.add.collider(enemy, ground, () => {
            if (enemy.body.touching.down) {
                enemyJumpCount = 0;
            }
        })

        this.anims.create({
            key: "playerIdle",
            frames: this.anims.generateFrameNumbers("playerIdle", { start: 0, end: 4 }),
            frameRate: 8,  // Testa olika frameRate-värden (t.ex. 6, 8, 12)
            repeat: -1  // -1 gör att den loopar oändligt
        });

        this.anims.create({
            key: "enemyIdle",
            frames: this.anims.generateFrameNumbers("enemyIdle", { start: 0, end: 8 }),
            frameRate: 8,  // Testa olika frameRate-värden (t.ex. 6, 8, 12)
            repeat: -1  // -1 gör att den loopar oändligt
        });

        player.play("playerIdle");
        enemy.play("enemyIdle");
    }

    function update() {
        // Lyssna på input från piltangenterna
        const leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        const rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        const upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        const downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        const W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        const A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        const S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        const D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        if (player.body.blocked.down) {
            playerJumpCount = 0;
        }
    
        // Rörelse åt vänster om vänsterpil trycks
        if (leftKey.isDown) {
            player.setVelocityX(-200);  // Sätt hastigheten åt vänster (negativ riktning på X-axeln)
            player.setFlipX(true);
        }
        // Rörelse åt höger om högerpil trycks
        else if (rightKey.isDown) {
            player.setVelocityX(200);  // Sätt hastigheten åt höger (positiv riktning på X-axeln)
            player.setFlip(false);
        }
        else {
            player.setVelocityX(0); // Stoppa rörelse om ingen pil är nedtryckt
        }
    
        // Låt spelaren hoppa när upp-pilen trycks (och spelaren är på marken)
        if (Phaser.Input.Keyboard.JustDown(upKey) && playerJumpCount < 2) {
            player.setVelocityY(-300); // Hoppa uppåt
            playerJumpCount++; // Öka hopp-räknaren
        }

        // Stanna karaktären om ned-pil trycks
        if (downKey.isDown) {
            player.setVelocityY(0);  // Stoppa vertikal rörelse om ned-pilen trycks
        }

        if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
            player.play("playerIdle", true);  // Spela idle-animationen när spelaren står still
        }

        if (enemy.body.blocked.down) {
            enemyJumpCount = 0;
        }
    
        // Rörelse åt vänster om vänsterpil trycks
        if (A.isDown) {
            enemy.setVelocityX(-200);  // Sätt hastigheten åt vänster (negativ riktning på X-axeln)
            enemy.setFlipX(true);
        }
        // Rörelse åt höger om högerpil trycks
        else if (D.isDown) {
            enemy.setVelocityX(200);  // Sätt hastigheten åt höger (positiv riktning på X-axeln)
            enemy.setFlip(false);
        }
        else {
            enemy.setVelocityX(0); // Stoppa rörelse om ingen pil är nedtryckt
        }
    
        // Låt spelaren hoppa när upp-pilen trycks (och spelaren är på marken)
        if (Phaser.Input.Keyboard.JustDown(W) && enemyJumpCount < 2) {
            enemy.setVelocityY(-300); // Hoppa uppåt
            enemyJumpCount++; // Öka hopp-räknaren
        }

        // Stanna karaktären om ned-pil trycks
        if (S.isDown) {
            enemy.setVelocityY(0);  // Stoppa vertikal rörelse om ned-pilen trycks
        }

        if (enemy.body.velocity.x === 0 && enemy.body.velocity.y === 0) {
            enemy.play("enemyIdle", true);  // Spela idle-animationen när spelaren står still
        }

        
    }
    
    const game = new Phaser.Game(config);
}