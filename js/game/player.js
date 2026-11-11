/**
 * Neon Racing - Player Module
 * Builds the player vehicle 3D model and handles physics, boundary clamping, and roll/pitch banking.
 */
window.NeonGame = window.NeonGame || {};

(function (exports, THREE) {
    'use strict';

    class Player {
        constructor(config) {
            this.config = config || (NeonGame.Config && NeonGame.Config.PLAYER) || {
                COLOR: 0x38bdf8,
                INITIAL_POS: { x: 0, y: 0, z: 5 },
                MOVE_SPEED: 0.4,
                BOUNDS: { minX: -18, maxX: 18, minY: -2, maxY: 6 },
                ROLL_FACTOR: -0.6,
                PITCH_FACTOR: 0.2,
                ROTATION_SMOOTHING: 0.1,
                HIT_RADIUS: 1.2
            };

            this.hitRadius = this.config.HIT_RADIUS || 1.2;
            this.mesh = this.createMesh();
            this.reset();
        }

        createMesh() {
            const playerGroup = new THREE.Group();
            const playerMat = new THREE.MeshBasicMaterial({
                color: this.config.COLOR,
                wireframe: true
            });

            // Fuselage / body
            const bodyGeo = new THREE.CylinderGeometry(0.1, 0.6, 3, 6);
            bodyGeo.rotateX(Math.PI / 2);
            const body = new THREE.Mesh(bodyGeo, playerMat);
            playerGroup.add(body);

            // Main wings
            const wingGeo = new THREE.BoxGeometry(5.0, 0.1, 0.8);
            const wing = new THREE.Mesh(wingGeo, playerMat);
            wing.position.set(0, 0, -0.4);
            playerGroup.add(wing);

            // Vertical stabilizer / tail
            const tailGeo = new THREE.BoxGeometry(0.1, 0.8, 0.8);
            const tail = new THREE.Mesh(tailGeo, playerMat);
            tail.position.set(0, 0.4, 1);
            playerGroup.add(tail);

            return playerGroup;
        }

        update(moveInput) {
            const moveSpeed = this.config.MOVE_SPEED;
            const bounds = this.config.BOUNDS;

            const moveX = moveInput.x;
            const moveY = moveInput.y;

            // X movement bounded
            if (moveX < 0 && this.mesh.position.x > bounds.minX) {
                this.mesh.position.x += moveX * moveSpeed;
            }
            if (moveX > 0 && this.mesh.position.x < bounds.maxX) {
                this.mesh.position.x += moveX * moveSpeed;
            }

            // Y movement bounded
            if (moveY > 0 && this.mesh.position.y < bounds.maxY) {
                this.mesh.position.y += moveY * moveSpeed;
            }
            if (moveY < 0 && this.mesh.position.y > bounds.minY) {
                this.mesh.position.y += moveY * moveSpeed;
            }

            // Banking roll animation (Z-axis rotation)
            const targetZRotation = moveX * this.config.ROLL_FACTOR;
            this.mesh.rotation.z += (targetZRotation - this.mesh.rotation.z) * this.config.ROTATION_SMOOTHING;

            // Pitch tilt animation (X-axis rotation)
            const targetXRotation = moveY * this.config.PITCH_FACTOR;
            this.mesh.rotation.x += (targetXRotation - this.mesh.rotation.x) * this.config.ROTATION_SMOOTHING;
        }

        reset() {
            const initialPos = this.config.INITIAL_POS;
            this.mesh.position.set(initialPos.x, initialPos.y, initialPos.z);
            this.mesh.rotation.set(0, 0, 0);
        }

        getMesh() {
            return this.mesh;
        }

        getPosition() {
            return this.mesh.position;
        }
    }

    exports.Player = Player;
})(window.NeonGame, window.THREE);
