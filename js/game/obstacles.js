/**
 * Neon Racing - Obstacle Manager Module
 * Handles obstacle pooling, anti-camping procedural spawning, movement, and recycling.
 */
window.NeonGame = window.NeonGame || {};

(function (exports, THREE) {
    'use strict';

    class ObstacleManager {
        constructor(scene, config) {
            this.scene = scene;
            this.config = config || (NeonGame.Config && NeonGame.Config.OBSTACLES) || {};
            this.obstacles = [];
            this.spawnTimerId = null;

            this.initResources();
        }

        initResources() {
            const types = this.config.TYPES;

            // 1. Pillar (Pink)
            const pConfig = types.PILLAR;
            this.pillarGeo = new THREE.BoxGeometry(pConfig.size.width, pConfig.size.height, pConfig.size.depth);
            this.pillarMat = new THREE.MeshBasicMaterial({ color: pConfig.color, wireframe: true });

            // 2. Sphere (Yellow)
            const sConfig = types.SPHERE;
            this.sphereGeo = new THREE.SphereGeometry(sConfig.radius, sConfig.segments, sConfig.segments);
            this.sphereMat = new THREE.MeshBasicMaterial({ color: sConfig.color, wireframe: true });

            // 3. Cube (Green)
            const cConfig = types.CUBE;
            this.cubeGeo = new THREE.BoxGeometry(cConfig.size.width, cConfig.size.height, cConfig.size.depth);
            this.cubeMat = new THREE.MeshBasicMaterial({ color: cConfig.color, wireframe: true });
        }

        startSpawning(getPlayerX, getScore, isGameRunning) {
            this.stopSpawning();

            const spawnLoop = () => {
                if (!isGameRunning()) return;

                this.spawnSingle(getPlayerX());

                const score = getScore();
                const spawnRate = Math.max(
                    this.config.MIN_SPAWN_RATE,
                    this.config.BASE_SPAWN_RATE - (score * this.config.SPAWN_RATE_SCORE_FACTOR)
                );

                this.spawnTimerId = setTimeout(spawnLoop, spawnRate);
            };

            // Spawn first obstacle
            spawnLoop();
        }

        stopSpawning() {
            if (this.spawnTimerId !== null) {
                clearTimeout(this.spawnTimerId);
                this.spawnTimerId = null;
            }
        }

        spawnSingle(playerX) {
            const rand = Math.random();
            const spawnZ = this.config.SPAWN_Z;

            // Anti-Camping System: 30% chance obstacle tracks towards player X coordinate
            let spawnX;
            if (Math.random() < this.config.ANTI_CAMP_CHANCE) {
                const spread = this.config.ANTI_CAMP_SPREAD;
                spawnX = playerX + (Math.random() * spread - spread / 2);
            } else {
                spawnX = (Math.random() - 0.5) * this.config.SPAWN_RANGE_X;
            }

            let obstacle;

            if (rand < 0.33) {
                // Pillar
                obstacle = new THREE.Mesh(this.pillarGeo, this.pillarMat);
                obstacle.position.set(spawnX, this.config.TYPES.PILLAR.fixedY, spawnZ);
                obstacle.userData = { type: 'pillar' };
            } else if (rand < 0.66) {
                // Sphere
                obstacle = new THREE.Mesh(this.sphereGeo, this.sphereMat);
                const spawnY = (Math.random() * 10) - 2;
                obstacle.position.set(spawnX, spawnY, spawnZ);
                obstacle.userData = {
                    type: 'sphere',
                    hitRadius: this.config.TYPES.SPHERE.hitRadius
                };
            } else {
                // Cube
                obstacle = new THREE.Mesh(this.cubeGeo, this.cubeMat);
                const spawnY = (Math.random() * 10) - 2;
                obstacle.position.set(spawnX, spawnY, spawnZ);
                obstacle.userData = { type: 'smallcube' };
            }

            this.scene.add(obstacle);
            this.obstacles.push(obstacle);
        }

        update(speed) {
            const forwardDelta = speed + this.config.FORWARD_SPEED_OFFSET;
            const despawnZ = this.config.DESPAWN_Z;

            for (let i = this.obstacles.length - 1; i >= 0; i--) {
                const obs = this.obstacles[i];
                obs.position.z += forwardDelta;

                // Rotate floating obstacles
                if (obs.userData.type === 'sphere' || obs.userData.type === 'smallcube') {
                    obs.rotation.x += 0.02;
                    obs.rotation.y += 0.03;
                }

                // Recycle obstacles that pass behind camera
                if (obs.position.z > despawnZ) {
                    this.scene.remove(obs);
                    this.obstacles.splice(i, 1);
                }
            }
        }

        clearAll() {
            this.stopSpawning();
            for (let i = 0; i < this.obstacles.length; i++) {
                this.scene.remove(this.obstacles[i]);
            }
            this.obstacles = [];
        }

        getObstacles() {
            return this.obstacles;
        }
    }

    exports.ObstacleManager = ObstacleManager;
})(window.NeonGame, window.THREE);
