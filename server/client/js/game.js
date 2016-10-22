(function () {
    'use strict';

    window.gameFactory = function () {
        var game  = new Phaser.Game(800, 600, Phaser.CANVAS, 'game-wrapper', { preload: preload, create: create, update: update, render: render });

        function preload() {
            game.load.image('space', 'assets/skies/deep-space.jpg');
            game.load.image('bullet', 'assets/games/asteroids/bullets.png');
            game.load.image('ship', 'assets/games/asteroids/ship.png');
            game.load.image('planet', 'assets/games/asteroids/planet.png');
            game.load.image('targetPlanet', 'assets/games/asteroids/targetPlanet.png');
        }

        var sprite;
        var planetSprite;
        var targetPlanetSprite;
        var cursors;

        var bullet;
        var bullets;
        var bulletTime = 0;

        function create() {

            //  This will run in Canvas mode, so let's gain a little speed and display
            game.renderer.clearBeforeRender = false;
            game.renderer.roundPixels = true;

            //  We need arcade physics
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //  A spacey background
            game.add.tileSprite(0, 0, game.width, game.height, 'space');

            //  Our ships bullets
            bullets = game.add.group();
            bullets.enableBody = true;
            bullets.physicsBodyType = Phaser.Physics.ARCADE;

            //  All 40 of them
            bullets.createMultiple(40, 'bullet');
            bullets.setAll('anchor.x', 0.5);
            bullets.setAll('anchor.y', 0.5);

            //  Our player ship
            sprite = game.add.sprite(400, 300, 'ship');
            sprite.anchor.set(0.5);


            //  NPM planet
            planetSprite = game.add.sprite(60, 300, 'planet');
            planetSprite.anchor.set(0.5);

            //  Target planet
            targetPlanetSprite = game.add.sprite(700, 300, 'targetPlanet');
            targetPlanetSprite.anchor.set(0.5);

            //  and its physics settings
            game.physics.enable(sprite, Phaser.Physics.ARCADE);
            game.physics.enable(planetSprite, Phaser.Physics.ARCADE);
            game.physics.enable(targetPlanetSprite, Phaser.Physics.ARCADE);

            sprite.body.collideWorldBounds = true;
            sprite.body.checkCollision.up = true;
            sprite.body.checkCollision.down = true;


            planetSprite.body.collideWorldBounds = true;
            planetSprite.body.checkCollision.up = true;
            planetSprite.body.checkCollision.down = true;
            planetSprite.body.immovable = true;

            targetPlanetSprite.body.collideWorldBounds = true;
            targetPlanetSprite.body.checkCollision.up = true;
            targetPlanetSprite.body.checkCollision.down = true;
            targetPlanetSprite.body.immovable = true;

            sprite.body.drag.set(100);
            sprite.body.maxVelocity.set(200);

            //  Game input
            cursors = game.input.keyboard.createCursorKeys();
            game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        }

        function update() {

            if (cursors.up.isDown)
            {
                game.physics.arcade.accelerationFromRotation(sprite.rotation, 200, sprite.body.acceleration);
            }
            else
            {
                sprite.body.acceleration.set(0);
            }

            if (cursors.left.isDown)
            {
                sprite.body.angularVelocity = -300;
            }
            else if (cursors.right.isDown)
            {
                sprite.body.angularVelocity = 300;
            }
            else
            {
                sprite.body.angularVelocity = 0;
            }

            // if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
            // {
            //     fireBullet();
            // }

            screenWrap(sprite);


            game.physics.arcade.collide(sprite, planetSprite);
            game.physics.arcade.collide(sprite, targetPlanetSprite);

            bullets.forEachExists(screenWrap, this);

        }



        function screenWrap (sprite) {

            if (sprite.x < 0)
            {
                sprite.x = game.width;
            }
            else if (sprite.x > game.width)
            {
                sprite.x = 0;
            }

            if (sprite.y < 0)
            {
                sprite.y = game.height;
            }
            else if (sprite.y > game.height)
            {
                sprite.y = 0;
            }

        }

        function render() {
        }

        return game;
    }

})();