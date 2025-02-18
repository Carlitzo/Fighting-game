import Phaser from "https://esm.sh/phaser";

export function startGame() {
    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        physics: {
            default: "arcade",
            arcade: { gravity: { y: 0}, debug: false}
        },
        scene: { preload, create, update}
    }
    
    function preload() {
        this.load.image("background", "./../assets/background/background.png");
    }
    
    let player;

    function create() {
        this.add.image(window.innerWidth / 2, window.innerHeight / 2, "background")
        .setDisplaySize(window.innerWidth, window.innerHeight);

        player = this.physics.add.sprite(100,100, "playerSprite");
        player.setCollideWorldBounds(true);
    }

    function update() {
        // Lyssna på input från piltangenterna
        const leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        const rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        const upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        const downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    
        // Rörelse åt vänster om vänsterpil trycks
        if (leftKey.isDown) {
            player.setVelocityX(-160);  // Sätt hastigheten åt vänster (negativ riktning på X-axeln)
        }
        // Rörelse åt höger om högerpil trycks
        else if (rightKey.isDown) {
            player.setVelocityX(160);  // Sätt hastigheten åt höger (positiv riktning på X-axeln)
        }
        else {
            player.setVelocityX(0); // Stoppa rörelse om ingen pil är nedtryckt
        }
    
        // Låt spelaren hoppa när upp-pilen trycks (och spelaren är på marken)
        if (upKey.isDown && player.body.touching.down) {
            player.setVelocityY(-330);  // Ge ett hopp genom att sätta en negativ hastighet på Y-axeln
        }
    
        // Stanna karaktären om ned-pil trycks (eller om du vill lägga till någon annan funktionalitet)
        if (downKey.isDown) {
            player.setVelocityY(0);  // Stoppa vertikal rörelse om ned-pilen trycks
        }
    }
    
    const game = new Phaser.Game(config);
}