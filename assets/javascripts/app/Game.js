define(['phaser', 'jquery', './Level'], function(phaser, $, Level){

    /**
     * Klasse für ein Spiel
     * @param $divDomElement
     * @constructor
     */
    function Game ($divDomElement) {
        self = this;

        /**
         *
         * @type {{images: string, sounds: string, levels: string}}
         */
        this.defaults = {
            images: 'assets/images/',
            sounds: 'assets/sounds/',
            levels: 'assets/levels/'
        };

        /**
         * Normalisiert URl für laden mit Phaser
         * @param relativeUrl - Url ohne prefix
         * @returns {string} - Komplette URL mit http://deineDomain.de/deineUrl
         */
        this.normalizeUrl = function (relativeUrl) {
            if (relativeUrl[0] != "/") {
                relativeUrl = "/" + relativeUrl
            }
            return window.location.href.replace('Game.html','') + relativeUrl;
        };

        /**
         * Root Element für Game
         * @type {*|HTMLElement}
         */
        this.$rootElement = $($divDomElement);


        /**
         * Docs unter http://docs.phaser.io/Phaser.Game.html
         * @type {Phaser.Game}
         */
        this.game  = new Phaser.Game(
                $(window).width(),
                $(window).height(),
                Phaser.CANVAS,
                this.$rootElement[0],
                this
        );
        this.game.defaults = this.defaults;
        this.game.normalizeUrl = this.normalizeUrl;

        /**
         * Preload FUnction für das gesamte Spiel
         */
        this.preload= function(){
            game.state.add('level1', new Level(game, "Level_2"))

        };
        /**
         * Funktion die zum Spielstart aufgerufen wird
         */
        this.create = function(){

            var screenShake = game.add.plugin(Phaser.Plugin.ScreenShake);

            this.game.screenShake = screenShake;

            this.game.state.start('level1');
            this.game.scale.setExactFit();
            this.game.scale.refresh()
        };
        /**
         * Loop Funktion für das Spiel
         */
        this.update =  function(){

        };




    }

    return Game

});