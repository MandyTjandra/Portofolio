/**
 * Neon Racing - Game Configuration & Constants
 */
window.NeonGame = window.NeonGame || {};

NeonGame.Config = Object.freeze({
    CANVAS_ID: 'gameCanvas',

    AUDIO: {
        MUSIC_SRC: 'music.mp3',
        VOLUME: 0.5,
        LOOP: true
    },

    WORLD: {
        FOG_COLOR: 0x0b0f19,
        FOG_DENSITY: 0.025,
        GRID_SIZE: 400,
        GRID_DIVISIONS: 150,
        GRID_PRIMARY_COLOR: 0x6366f1,
        GRID_SECONDARY_COLOR: 0x111827,
        GRID_Y: -3,
        GRID_WRAP_Z: 5
    },

    CAMERA: {
        FOV: 75,
        NEAR: 0.1,
        FAR: 1000,
        POSITION: { x: 0, y: 3, z: 12 },
        LOOK_AT: { x: 0, y: 0, z: -20 }
    },

    PLAYER: {
        COLOR: 0x38bdf8,
        INITIAL_POS: { x: 0, y: 0, z: 5 },
        MOVE_SPEED: 0.4,
        BOUNDS: {
            minX: -18,
            maxX: 18,
            minY: -2,
            maxY: 6
        },
        ROLL_FACTOR: -0.6,
        PITCH_FACTOR: 0.2,
        ROTATION_SMOOTHING: 0.1,
        HIT_RADIUS: 1.2
    },

    OBSTACLES: {
        INITIAL_SPEED: 0.5,
        SPEED_INCREMENT: 0.0001,
        FORWARD_SPEED_OFFSET: 0.5,
        SPAWN_Z: -100,
        DESPAWN_Z: 15,
        SPAWN_RANGE_X: 40,
        BASE_SPAWN_RATE: 1500,
        MIN_SPAWN_RATE: 400,
        SPAWN_RATE_SCORE_FACTOR: 1.5,
        ANTI_CAMP_CHANCE: 0.3, // 30% chance to target player's current X
        ANTI_CAMP_SPREAD: 6,

        TYPES: {
            PILLAR: {
                name: 'pillar',
                color: 0xec4899,
                size: { width: 2, height: 20, depth: 2 },
                fixedY: 7,
                hitbox: { x: 2.0, y: 10.5, z: 2.0 }
            },
            SPHERE: {
                name: 'sphere',
                color: 0xffeb3b,
                radius: 1.8,
                segments: 8,
                hitRadius: 1.5,
                yRange: { min: -2, max: 8 },
                rotationSpeed: { x: 0.02, y: 0.03 }
            },
            CUBE: {
                name: 'smallcube',
                color: 0x10b981,
                size: { width: 1.8, height: 1.8, depth: 1.8 },
                yRange: { min: -2, max: 8 },
                hitbox: { x: 1.8, y: 1.5, z: 1.5 },
                rotationSpeed: { x: 0.02, y: 0.03 }
            }
        }
    }
});
