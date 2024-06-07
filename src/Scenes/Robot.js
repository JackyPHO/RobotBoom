class Robot extends Phaser.Scene {
    constructor() {
        super("robotScene");
        this.my = {sprite: {}, text: {}};
        this.my.sprite.bullet = []; 
        this.my.sprite.life = [];
        this.my.sprite.boost = [];
    }
    init() {
        this.counter = 0;
        this.temp = 0;
        this.lives = 3;
        this.maxBullets = 5;
        this.myScore = 0;
        this.my.sprite.red = [];
        this.my.sprite.blue = [];
        this.bl = [];
        this.my.sprite.yellow = [];
        this.playerSpeed = 5;
        this.robotSpeed = 0.6;
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.image("red", "robot_3Dred.png");
        this.load.image("blue", "robot_3Dblue.png");
        this.load.image("yellow", "robot_3Dyellow.png");
        this.load.image("soldier", "soldier1_machine.png");
        this.load.image("bullet", "tile_187.png");
        this.load.image("heart", "heart.png");
        this.load.image("life", "life.png");
        this.load.image("bg", "bg.png");
        this.load.image("end", "end.png");
        this.load.image("explode00", "explosion00.png");
        this.load.image("explode01", "explosion01.png");
        this.load.image("explode02", "explosion02.png");
        this.load.image("explode03", "explosion03.png");
        this.load.audio('shoot', ["laserSmall_000.ogg"]);
        this.load.audio('boom', ["explosionCrunch_000.ogg"]);
        this.load.audio('lose', ["laserLarge_000.ogg"]);
        this.load.audio('powerup', ["powerUp1.ogg"]);
        this.load.bitmapFont("MCtext", "Minecraftia_0.png", "Minecraftia.fnt");

    }
    create(){
        let my = this.my;
        this.add.image(400,300, "bg");
        this.shoot = this.sound.add('shoot').setVolume(0.5);
        this.boom = this.sound.add('boom').setVolume(0.5);
        this.lose = this.sound.add('lose').setVolume(0.5);
        this.powerup = this.sound.add('powerup').setVolume(0.5);

        this.boostMode = false;

        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "soldier");
        my.sprite.heart1 = this.add.sprite(740, 20, "heart");
        my.sprite.heart2 = this.add.sprite(760, 20, "heart");
        my.sprite.heart3 = this.add.sprite(780, 20, "heart");

        my.text.score = this.add.bitmapText(580, 0, "MCtext", "Score: " + this.myScore);

        document.getElementById('description').innerHTML = '<h2>Robot Boom</h2><br>A: left // D: right // Space: shoot // R: Restart Game<br>'

        this.anims.create({
            key: "explosion",
            frames: [
                { key: "explode00" },
                { key: "explode01" },
                { key: "explode02" },
                { key: "explode03" },
            ],
            frameRate: 20,    // Note: case sensitive (thank you Ivy!)
            repeat: 5,
            hideOnComplete: true
        });

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.rKey = this.input.keyboard.addKey("R");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }
    update(){
        let my = this.my;
        if(this.lives > 0){
            this.counter++;
            if (this.counter % 100 == 0) {
                my.sprite.red.push(this.add.sprite(Math.random()*config.width,80, "red").setScale(0.5))
            }
            else if( this.counter % 150 == 0){
                my.sprite.blue.push(this.add.sprite(Math.random()*config.width,80, "blue").setScale(0.5))
                this.bl.push(3);
            }
            else if( this.counter % 999 == 0){
                my.sprite.yellow.push(this.add.sprite(Math.random()*config.width,80, "yellow").setScale(0.5))
                my.sprite.life.push(this.add.sprite(Math.random()*config.width,game.config.height - 40, "life"))
            }
            else if( this.counter % 1999 == 0){
                this.robotSpeed += 0.2;
                this.playerSpeed += 1;
            }
            for (let rrobot of my.sprite.red) {
                rrobot.y += this.robotSpeed;
                if (rrobot.y > 460){
                    rrobot.destroy();
                    const i = my.sprite.red.indexOf(rrobot);
                    my.sprite.red.splice(i,1)
                    this.lose.play();
                    this.lives--;
                    
                }
            }
            for (let brobot of my.sprite.blue) {
                brobot.y += this.robotSpeed;
                if (brobot.y > 460){
                    brobot.destroy();
                    const i = my.sprite.blue.indexOf(brobot);
                    my.sprite.blue.splice(i,1)
                    this.bl.splice(i,1);
                    this.lose.play();
                    this.lives--;
                }
            }
            for (let yrobot of my.sprite.yellow) {
                yrobot.y += this.robotSpeed;
                if (yrobot.y > 460){
                    yrobot.destroy();
                    const i = my.sprite.yellow.indexOf(yrobot);
                    my.sprite.yellow.splice(i,1)
                }
            }
        }

        //Temporily let a life powerup showup then disappear
        if(my.sprite.life.length != 0){
            this.temp++;
            if( this.temp % 300 == 0){
                my.sprite.life[0].destroy()
                my.sprite.life.pop()
                this.temp = 0; 
            }
        }
        
        //Collision for player sprite and powerup
        for (let lives of my.sprite.life){
            if(this.collides(my.sprite.player,lives)){
                if(this.lives < 3){
                    this.lives+=1;
                }
                lives.destroy();
                my.sprite.life.pop()
                this.powerup.play();
            }
        }

        //Input Keyboard Controls
        if (this.left.isDown) {
            if (my.sprite.player.x > (my.sprite.player.displayWidth/2)) {
                my.sprite.player.x -= this.playerSpeed;
            }
        }
        if (this.right.isDown) {
            if (my.sprite.player.x < (game.config.width - (my.sprite.player.displayWidth/2))) {
                my.sprite.player.x += this.playerSpeed;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (my.sprite.bullet.length < this.maxBullets) {
                this.shoot.play();
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "bullet")
                );
            }
        }
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        // Collision bullet and enemy sprites
        for (let bullet of my.sprite.bullet) {
            bullet.y -= 5;
            for (let rrobot of my.sprite.red)
                if (this.collides(rrobot, bullet)) {
                    // start animation
                    this.explosion = this.add.sprite(rrobot.x, rrobot.y, "explode03").setScale(0.25).play("explosion");
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                    rrobot.destroy();
                    const i = my.sprite.red.indexOf(rrobot);
                    my.sprite.red.splice(i,1);

                    // Update score
                    this.myScore += 1;
                    this.updateScore();

                    // Play sound
                    this.boom.play();
                }
            for (let brobot of my.sprite.blue)
                if (this.collides(brobot, bullet)) {
                    bullet.y = -100;
                    const i = my.sprite.blue.indexOf(brobot);
                    this.bl[i]--;
                    if(this.bl[i] ==0){
                        this.explosion = this.add.sprite(brobot.x, brobot.y, "explode03").setScale(0.25).play("explosion");
                        brobot.destroy();
                        my.sprite.blue.splice(i,1);
                        this.bl.splice(i,1);

                        // Update score
                        this.myScore += 2;
                        this.updateScore();

                        // Play sound
                        this.boom.play();
                    }
                }
            for (let yrobot of my.sprite.yellow)
                if (this.collides(yrobot, bullet)) {
                    // start animation
                    this.explosion = this.add.sprite(yrobot.x, yrobot.y, "explode03").setScale(0.25).play("explosion");
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                    yrobot.destroy();
                    const i = my.sprite.yellow.indexOf(yrobot);
                    my.sprite.yellow.splice(i,1);

                    // Update lives
                    this.lives--;
                    this.lose.play();

                    // Play sound
                    this.boom.play();
                }
        }
        //Check lives
        if (this.lives == 3){
            my.sprite.heart1.visible = true;
            my.sprite.heart2.visible = true;
            my.sprite.heart3.visible = true;
        }
        else if (this.lives == 2){
            my.sprite.heart1.visible = false;
            my.sprite.heart2.visible = true;
            my.sprite.heart3.visible = true;
        }
        else if (this.lives == 1){
            my.sprite.heart1.visible = false;
            my.sprite.heart2.visible = false;
            my.sprite.heart3.visible = true;
        }
        else if (this.lives == 0){
            this.add.image(400,300, "end");
        }
    }
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }
}