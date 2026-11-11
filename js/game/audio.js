/**
 * Neon Racing - Audio Manager Module
 * Handles background music playback, looping, and volume control.
 */
window.NeonGame = window.NeonGame || {};

(function (exports) {
    'use strict';

    class AudioManager {
        constructor(config) {
            this.config = config || (NeonGame.Config && NeonGame.Config.AUDIO) || {
                MUSIC_SRC: 'music.mp3',
                VOLUME: 0.5,
                LOOP: true
            };

            this.bgMusic = null;
            this.isInitialized = false;
            this.init();
        }

        init() {
            try {
                this.bgMusic = new Audio(this.config.MUSIC_SRC);
                this.bgMusic.loop = Boolean(this.config.LOOP);
                this.bgMusic.volume = typeof this.config.VOLUME === 'number' ? this.config.VOLUME : 0.5;
                this.isInitialized = true;
            } catch (err) {
                console.warn('AudioManager: Could not initialize audio element', err);
            }
        }

        play() {
            if (!this.bgMusic) return;
            const playPromise = this.bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    // Browser policy may require interaction before playing
                    console.warn('AudioManager: Autoplay was prevented or audio failed to load', err);
                });
            }
        }

        pause() {
            if (!this.bgMusic) return;
            this.bgMusic.pause();
        }

        stop() {
            if (!this.bgMusic) return;
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }

        setVolume(vol) {
            if (!this.bgMusic) return;
            this.bgMusic.volume = Math.max(0, Math.min(1, vol));
        }

        getVolume() {
            return this.bgMusic ? this.bgMusic.volume : 0;
        }
    }

    exports.AudioManager = AudioManager;
})(window.NeonGame);
