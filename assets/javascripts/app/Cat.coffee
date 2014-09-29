define ['phaser','jquery'], (Phaser, $)->
  class Cat extends  Phaser.Sprite

    @catTypes:
      Default : 'dk.png'
      First: 'dk.png'#'catSheet_1.png'
      Second: 'dk.png'#'catSheet_2.png'
      Third: 'dk.png'#'catSheet_3.png'
      Four: 'dk.png'#'catSheet_4.png'
      Five: 'dk.png'#'catSheet_5.png'


    @getRandomCatType: ()->
      list = []
      for key,value of Cat.catTypes
        list.push(key: key, value: value)
      return list[Math.floor(Math.random()*list.length)]

    @preload: (game)->
      for key,value of Cat.catTypes
        game.load.spritesheet('cat'+key,game.normalizeUrl(game.defaults.images+ value),118,150)


    @defaultSettings:
      animationFrameRate: 10

    # Richtungen in die sich eine Kaze bewegen kann
    # @enum
    @directons:
      LEFT: 10
      RIGHT: 20
      TOP: 30
    #Erstellen einer Katze
    #@param {Phaser.Game} game
    constructor: (game, settings)->
      super(game,0,0,'catDefault')
      game.physics.enable(this,Phaser.Arcade)
      game.add.existing(this)
      this.settings = Phaser.Utils.mixin(settings,Phaser.Utils.extend(Cat.defaultSettings))
      this.anchor.setTo(0.5,0.5)
      this.scale.setTo(0.5,0.5)
      #Animations
      this.animations.add("runRight",[0,4,5]);
      this.animations.add("runLeft",[0,1,2]);
      this.animations.add("hideEar",[0,12,0]);
      this.animations.add("smile",[0,13,0]);
      this.animations.add("look",[0,14,0]);

      this.currentType = Cat.catTypes.Default

      this.body.immovable = true;

    changeCatType: (newCatType)=>
      this.currentType = newCatType


    #Startet die Bewegung in eine bestimmte Richtung
    #@member
    #@param {Cat.directions} direction - Richtung in die die Karze sich bwegen soll
    startMove:(direction)=>
      if this.health > 0
        switch direction
          when Cat.directons.LEFT
            this.body.velocity.x = this.settings.runVelocity*(-1)
            this.animations.play('runLeft', this.settings.animationFrameRate)

          when Cat.directons.RIGHT
            this.body.velocity.x = this.settings.runVelocity
            this.animations.play('runRight',this.settings.animationFrameRate)

          when Cat.directons.TOP
            this.body.velocity.y = this.settings.jumpVelocity
          else
            throw  new Error("Unexpected Direction pleas use Cat.direction" + Cat.directons)

    update: ()=>
      if Math.random() > 0.999
        this.changePersonality()
    kill: ()=>
      if this.health > 0
        this.body.destroy()
        console.log("Death")
        game.physics.enable(this,Phaser.Arcade)
        this.body.gravity.y = 100
        this.body.velocity.y = - 400
        this.body.velocity.x = 400
        this.body.checkCollision.up = false
        this.body.checkCollision.down = false
        this.body.checkCollision.right = false
        this.body.checkCollision.left = false
        $('canvas').addClass('kill')
      this.health = 0



    #Stopt den Move einer Karze
    stopMove: ()=>
      this.bringToTop()
      this.body.velocity.x = 0
      this.animations.stop()
      this.frame = 0

    changePersonality: ()=>
      self = @
      tween = this.game.add.tween(this.scale)
      tween.to(x: 0.1, y: 0.1,300)
      tween.onComplete.add(()->
        randomType =  Cat.getRandomCatType()

        switch randomType.value
          when Cat.catTypes.First
            self.game.add.tween(self.scale).to(x: 0.6,y: 0.6,100).start()
          when Cat.catTypes.Second
            self.game.add.tween(self.scale).to(x: 0.2,y: 0.2,100).start()
          when Cat.catTypes.Third
            tween2 = self.game.add.tween(self.scale).to(x: 0.5,y: 0.5,100).loop()
          else
            self.game.add.tween(self.scale).to(x: 0.5,y: 0.5,200).start()

        if tween2 then tween2.stop()
        self.loadTexture('cat'+randomType.key,0);
        self.currentType = randomType.value
      )
      tween.start()


    #Startet einen zufällige Animation
    #@return {Phaser.TimerEvent}
    startRandomAnimation: ()=>
        self = @
        if this.randomAnimationLoop == undefined
          this.randomAnimationLoop = game.time.events.loop(Phaser.Timer.SECOND * 5 , ()->
            console.log("HideEar");
            #this.animations.play('hideEar',this.settings.animationFrameRate)
            #this.animations.play('smile',this.settings.animationFrameRate / 2)
            window.setTimeout(()->
             console.log('')
             #self.animations.play('look',1)
            ,2000)
          , this);
        else
          this.randomAnimationLoop
    stopRandomAnimation: ()=>
      this.game.events.remove(this.randomAnimationTimer)



