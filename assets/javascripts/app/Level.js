define(['phaser', 'jquery','./Game', './Cat'], function(phaser, $ , Game,Cat){

    /**
     * Klasse für ein Level
     * @param game
     * @constructor
     */
    Level = function(game, name){

        /**
         * Lvel name
         * @type {string}
         */
        this.levelName = name

        /**
         * gravity: Gravitation des Levels
         * jumpVelocity: Geschwindigkeit fürs springen
         * runVelocity: Geschwindigkeit fürs hin und her laufen
         * @type {{gravity: number, jumpVelocity: number, runVelocity: number}}
         */
        this.settings = {
            gravity: 600,
            jumpVelocity: -400,
            runVelocity: 400,
            rotationProbability: 0.999
        }

    };

    /**
     * Statische Methode zum laden der Sprites
     */
    /**
     *
     * @param {Game} game
     */
    Level.prototype.preload =  function(game){
        Cat.preload(game);
        game.load.image('bg',game.normalizeUrl(game.defaults.images+'bg2.png'));
        game.load.image('spits', game.normalizeUrl(game.defaults.images+ "spits" +'.png')); // loading the tileset image
        game.load.image('fire', game.normalizeUrl(game.defaults.images+ 'fire.png')); // loading the tileset image
        game.load.image('fire1', game.normalizeUrl(game.defaults.images+ 'Fire.gif')); // loading the tileset image
        //game.load.image('tiles', game.normalizeUrl(game.defaults.images+ 'tiles.png')); // loading the tileset image
        game.load.image('ForrestSprites', game.normalizeUrl(game.defaults.images+ 'ForestSprites.png')); // loading the tileset image
        game.load.image('PokeSprites', game.normalizeUrl(game.defaults.images+ 'PokeSprites.png')); // loading the tileset image
        //game.load.image('half_tiles', game.normalizeUrl(game.defaults.images+ 'half_tiles.png')); // loading the tileset image
        game.load.image('full_tiles', game.normalizeUrl(game.defaults.images+ 'full_tiles.png')); // loading the tileset image
        game.load.image('redCityBackground', game.normalizeUrl(game.defaults.images+ 'bg.jpg')); // loading the tileset image
        game.load.image('clouds', game.normalizeUrl(game.defaults.images+ 'clouds.png')); // ng the tileset image
        game.load.tilemap('map', game.normalizeUrl(game.defaults.levels+ this.levelName +'.json'), null, Phaser.Tilemap.TILED_JSON);
        game.load.audio("bg_jungle", game.normalizeUrl(game.defaults.sounds + 'Background_jungle.ogg'), true);
        game.load.audio("bg_song", game.normalizeUrl(game.defaults.sounds + 'song.ogg'), true);
    };

    Level.prototype.create = function(game){

        beachSound = game.sound.play("bg_jungle", 1, true);
        beachSong = game.sound.play("bg_song", 0.5, true);

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = this.settings.gravity;

        this.bg = game.add.tileSprite(0, 0,1046, 351,'redCityBackground');
        this.bg.fixedToCamera = true;
        this.bg.scale.setTo(1.6,1.62)
        this.cat = new Cat(game, this.settings);
        this.map = this.add.tilemap('map'); // Preloaded tilemap
        //this.map.addTilesetImage('half_tiles','half_tiles'); // Preloaded tileset
        this.map.addTilesetImage('tiles','tiles'); // Preloaded tileset
        this.map.addTilesetImage('spits','spits'); // Preloaded tileset
        this.map.addTilesetImage('ForestSprites','ForrestSprites'); // Preloaded tileset
        this.map.addTilesetImage('PokeSprites','PokeSprites'); // Preloaded tileset
        this.map.addTilesetImage('Fire','fire'); // Preloaded tileset
        this.map.addTilesetImage('full_tiles','full_tiles'); // Preloaded tileset
        this.map.addTilesetImage('clouds','clouds'); // Preloaded tileset

        
        this.layer = this.map.createLayer('Foreground'); // This is the default name of the first layer in Tiled
		this.layerBackground = this.map.createLayer('Background');
        this.layerDead = this.map.createLayer('Deadzone'); // This is the default name of the first layer in Tiled


        this.layer.resizeWorld();
        this.layerDead.resizeWorld();
		this.layerBackground.resizeWorld();

        //this.layerDead.debug = true
        //this.layer.debug = true

        game.camera.follow(this.cat);
        this.cursors = game.input.keyboard.createCursorKeys();
        this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        game.physics.enable([this.cat,this.layer], Phaser.Physics.ARCADE);
        game.physics.enable([this.cat,this.layerDead], Phaser.Physics.ARCADE);
        this.map.setCollisionByExclusion([0],true, this.layer);
        this.map.setCollisionByExclusion([1],true, this.layerDead);


         this.cat.startRandomAnimation()
        //  This gets it moving



    };
    Level.prototype.update = function(game){
        game.physics.arcade.collide(this.layer,this.cat)
        game.physics.arcade.collide(this.layerDead,this.cat, function(cat, tilte){
           console.log('Death')
            cat.kill()
        });

        if (Math.random()> this.settings.rotationProbability){
            $('canvas').toggleClass('flip')
        }


        //window.setTimeout(game.camera.visible = false;300);

        if (this.spacebar.isDown && this.cat.body.onFloor() )
        {
            this.wasDown = true
            this.cat.startMove(Cat.directons.TOP)
            //window.setTimeout(function(){game.camera.visible = false} ,300);
        }
        else if (this.cursors.left.isDown)
        {
            this.wasDown = true
            this.cat.startMove(Cat.directons.LEFT)
            this.bg.tilePosition.x += .75;
        }
        else if (this.cursors.right.isDown)
        {
            this.wasDown = true
            this.cat.startMove(Cat.directons.RIGHT)
            this.bg.tilePosition.x -= .75;
        }
        else if ((this.cursors.right.isUp || this.cursors.left.isUp)&& this.wasDown){

           this.cat.stopMove()
           this.wasDown = false
           this.bg.tilePosition.x += 0;
        }


    };
    return Level;

});
