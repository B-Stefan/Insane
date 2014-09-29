
requirejs.config(
    {
        paths: {
            'phaser': './vendor/phaser',
            'jquery': './vendor/jQuery',
            '_': './vendor/underscore/underscore'
        },
        shim: {
            phaser: {
                exports: 'Phaser'
            },
            '_': {
                exports: '_'
            }
        }
    }
);
define(['jquery','phaser', 'app/Game'],function($,phaser, Game){

 var element = $('#game');
 window.game = new Game(element);

});