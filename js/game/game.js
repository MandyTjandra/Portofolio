/**
 * Neon Racing - Main Game Engine
 * Orchestrates the 3D scene, rendering loop, game state lifecycle, and UI bindings.
 */
window.NeonGame = window.NeonGame || {};

(function (exports, THREE) {
    'use strict';

    class Game {
        constructor() {
            this.config = NeonGame.Config;

            this.isPlaying = false;
            this.score = 0;
            this.highScore = 0;
            this.speed = this.config.OBSTACLES.INITIAL_SPEED;

            this.initDOM();
            this.initThree();
            this.initModules();
            this.bindEvents();

            // Start animation loop
            this.animate = this.animate.bind(this);
            requestAnimationFrame(this.animate);
        }

        initDOM() {
            this.canvas = document.getElementById(this.config.CANVAS_ID);
            this.uiStartScreen = document.getElementById('start-screen');
            this.uiScore = document.getElementById('score-display');
            this.uiHighScore = document.getElementById('high-score-display');
            this.titleText = document.getElementById('title-text');
            this.subtitleText = document.getElementById('subtitle-text');
            this.controlText = document.getElementById('control-text');
        }

        initThree() {
            // Scene & Fog
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.FogExp2(
                this.config.WORLD.FOG_COLOR,
                this.config.WORLD.FOG_DENSITY
            );

            // Camera
            const width = window.innerWidth;
            const height = window.innerHeight;
            const camCfg = this.config.CAMERA;
            this.camera = new THREE.PerspectiveCamera(camCfg.FOV, width / height, camCfg.NEAR, camCfg.FAR);
            this.camera.position.set(camCfg.POSITION.x, camCfg.POSITION.y, camCfg.POSITION.z);
            this.camera.lookAt(camCfg.LOOK_AT.x, camCfg.LOOK_AT.y, camCfg.LOOK_AT.z);

            // Renderer
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                alpha: true
            });
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(window.devicePixelRatio);

            // Ground Grid Helper
            const worldCfg = this.config.WORLD;
            this.gridHelper = new THREE.GridHelper(
                worldCfg.GRID_SIZE,
                worldCfg.GRID_DIVISIONS,
                worldCfg.GRID_PRIMARY_COLOR,
                worldCfg.GRID_SECONDARY_COLOR
            );
            this.gridHelper.position.y = worldCfg.GRID_Y;
            this.scene.add(this.gridHelper);
        }

        initModules() {
            // Audio Manager
            this.audio = new NeonGame.AudioManager(this.config.AUDIO);

            // Input Manager
            this.input = new NeonGame.InputManager({
                controlHint: this.controlText,
                subtitleText: this.subtitleText
            });

            // Player Vehicle
            this.player = new NeonGame.Player(this.config.PLAYER);
            this.scene.add(this.player.getMesh());

            // Obstacle Manager
            this.obstacles = new NeonGame.ObstacleManager(this.scene, this.config.OBSTACLES);
        }

        bindEvents() {
            // Window resize handler
            window.addEventListener('resize', () => {
                const w = window.innerWidth;
                const h = window.innerHeight;
                this.camera.aspect = w / h;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(w, h);
            });

            // Start screen click / tap to start
            if (this.uiStartScreen) {
                this.uiStartScreen.addEventListener('click', () => {
                    if (!this.isPlaying) {
                        this.start();
                    }
                });
            }
        }

        start() {
            this.isPlaying = true;
            this.score = 0;
            this.speed = this.config.OBSTACLES.INITIAL_SPEED;

            if (this.uiStartScreen) {
                this.uiStartScreen.style.display = 'none';
            }

            this.player.reset();
            this.input.reset();
            this.obstacles.clearAll();

            // Start obstacle spawner with live state callbacks
            this.obstacles.startSpawning(
                () => this.player.getPosition().x,
                () => this.score,
                () => this.isPlaying
            );

            this.audio.play();
        }

        gameOver() {
            this.isPlaying = false;
            this.obstacles.stopSpawning();
            this.audio.stop();

            if (this.uiStartScreen) {
                this.uiStartScreen.style.display = 'flex';
            }

            if (this.titleText) {
                this.titleText.innerText = 'CRASHED';
                this.titleText.style.color = '#ff003c';
                this.titleText.style.textShadow = '0 0 15px #ff003c';
            }

            if (this.subtitleText) {
                this.subtitleText.innerText = `Final Score: ${this.score} - Tap to Retry`;
            }

            if (this.controlText) {
                this.controlText.style.opacity = '1';
            }

            if (this.score > this.highScore) {
                this.highScore = this.score;
                if (this.uiHighScore) {
                    this.uiHighScore.innerText = `BEST: ${this.highScore}`;
                }
            }
        }

        animate() {
            requestAnimationFrame(this.animate);

            if (this.isPlaying) {
                // Increment score & difficulty
                this.score += 1;
                if (this.uiScore) {
                    this.uiScore.innerText = `SCORE: ${this.score}`;
                }
                this.speed += this.config.OBSTACLES.SPEED_INCREMENT;

                // Animate grid for sense of speed
                this.gridHelper.position.z += this.speed;
                if (this.gridHelper.position.z > this.config.WORLD.GRID_WRAP_Z) {
                    this.gridHelper.position.z = 0;
                }

                // Update player position and banking
                const moveInput = this.input.getMovement();
                this.player.update(moveInput);

                // Update obstacle movement and recycling
                this.obstacles.update(this.speed);

                // Check collision
                const hitObstacle = NeonGame.CollisionDetector.checkFirstCollision(
                    this.player.getPosition(),
                    this.obstacles.getObstacles(),
                    this.player.hitRadius
                );

                if (hitObstacle) {
                    this.gameOver();
                }
            }

            this.renderer.render(this.scene, this.camera);
        }
    }

    // Auto-bootstrap when document is loaded
    document.addEventListener('DOMContentLoaded', () => {
        NeonGame.instance = new Game();
    });

    exports.Game = Game;
})(window.NeonGame, window.THREE);
