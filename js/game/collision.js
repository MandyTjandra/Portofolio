/**
 * Neon Racing - Collision Detection Module
 * Handles bounding box and spherical distance collision algorithms.
 */
window.NeonGame = window.NeonGame || {};

(function (exports) {
    'use strict';

    class CollisionDetector {
        static test(playerPos, obstacle, playerHitRadius = 1.2) {
            const obsPos = obstacle.position;
            const type = obstacle.userData && obstacle.userData.type;

            if (type === 'pillar') {
                const distanceX = Math.abs(playerPos.x - obsPos.x);
                const distanceY = Math.abs(playerPos.y - obsPos.y);
                const distanceZ = Math.abs(playerPos.z - obsPos.z);
                return (distanceX < 2.0 && distanceY < 10.5 && distanceZ < 2.0);
            }

            if (type === 'sphere') {
                const dist = playerPos.distanceTo(obsPos);
                const obsRadius = (obstacle.userData && obstacle.userData.hitRadius) || 1.5;
                return dist < (playerHitRadius + obsRadius);
            }

            if (type === 'smallcube') {
                const distanceX = Math.abs(playerPos.x - obsPos.x);
                const distanceY = Math.abs(playerPos.y - obsPos.y);
                const distanceZ = Math.abs(playerPos.z - obsPos.z);
                return (distanceX < 1.8 && distanceY < 1.5 && distanceZ < 1.5);
            }

            return false;
        }

        static checkFirstCollision(playerPos, obstacles, playerHitRadius = 1.2) {
            for (let i = 0; i < obstacles.length; i++) {
                if (CollisionDetector.test(playerPos, obstacles[i], playerHitRadius)) {
                    return obstacles[i];
                }
            }
            return null;
        }
    }

    exports.CollisionDetector = CollisionDetector;
})(window.NeonGame);
