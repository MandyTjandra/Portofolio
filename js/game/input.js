/**
 * Neon Racing - Input Manager Module
 * Manages keyboard controls and virtual touch joystick for mobile/touch devices.
 */
window.NeonGame = window.NeonGame || {};

(function (exports) {
    'use strict';

    class InputManager {
        constructor(options = {}) {
            this.joystickZone = options.joystickZone || document.getElementById('joystick-zone');
            this.joystickKnob = options.joystickKnob || document.getElementById('joystick-knob');
            this.controlHint = options.controlHint || document.getElementById('control-text');
            this.subtitleText = options.subtitleText || document.getElementById('subtitle-text');

            this.keys = {
                ArrowUp: false,
                ArrowDown: false,
                ArrowLeft: false,
                ArrowRight: false,
                w: false,
                a: false,
                s: false,
                d: false,
                W: false,
                A: false,
                S: false,
                D: false
            };

            this.joyActive = false;
            this.joyX = 0;
            this.joyY = 0;
            this.isTouchDevice = false;

            this.interactionCallbacks = [];

            this.init();
        }

        init() {
            this.setupKeyboardListeners();
            this.checkTouchSupport();
            this.setupTouchListeners();
        }

        onInteraction(callback) {
            if (typeof callback === 'function') {
                this.interactionCallbacks.push(callback);
            }
        }

        notifyInteraction() {
            this.interactionCallbacks.forEach(cb => cb());
            if (this.controlHint) {
                this.controlHint.style.opacity = '0';
            }
        }

        setupKeyboardListeners() {
            this.onKeyDown = (e) => {
                if (this.keys.hasOwnProperty(e.key)) {
                    this.keys[e.key] = true;
                    this.notifyInteraction();
                }
            };

            this.onKeyUp = (e) => {
                if (this.keys.hasOwnProperty(e.key)) {
                    this.keys[e.key] = false;
                }
            };

            window.addEventListener('keydown', this.onKeyDown);
            window.addEventListener('keyup', this.onKeyUp);
        }

        checkTouchSupport() {
            this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

            if (this.isTouchDevice) {
                if (this.joystickZone) {
                    this.joystickZone.style.display = 'block';
                }
                if (this.controlHint) {
                    this.controlHint.innerText = 'Use Joystick to Steer';
                }
                if (this.subtitleText) {
                    this.subtitleText.innerText = 'Tap to Start Engine';
                }
            }
        }

        setupTouchListeners() {
            if (!this.joystickZone || !this.joystickKnob) return;

            this.handleTouch = (e) => {
                e.preventDefault();
                this.joyActive = true;
                this.notifyInteraction();

                const touch = e.targetTouches[0];
                if (!touch) return;

                const rect = this.joystickZone.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const dx = touch.clientX - centerX;
                const dy = touch.clientY - centerY;

                const maxRadius = rect.width / 2;
                const distance = Math.min(Math.hypot(dx, dy), maxRadius);
                const angle = Math.atan2(dy, dx);

                const knobX = distance * Math.cos(angle);
                const knobY = distance * Math.sin(angle);

                this.joystickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;

                this.joyX = knobX / maxRadius;
                this.joyY = -(knobY / maxRadius);
            };

            this.resetJoystick = (e) => {
                if (e) e.preventDefault();
                this.joyActive = false;
                this.joyX = 0;
                this.joyY = 0;
                this.joystickKnob.style.transform = 'translate(-50%, -50%)';
            };

            this.joystickZone.addEventListener('touchstart', this.handleTouch, { passive: false });
            this.joystickZone.addEventListener('touchmove', this.handleTouch, { passive: false });
            this.joystickZone.addEventListener('touchend', this.resetJoystick, { passive: false });
            this.joystickZone.addEventListener('touchcancel', this.resetJoystick, { passive: false });
        }

        getMovement() {
            let moveX = 0;
            let moveY = 0;

            if (this.keys.ArrowLeft || this.keys.a || this.keys.A) moveX = -1;
            if (this.keys.ArrowRight || this.keys.d || this.keys.D) moveX = 1;
            if (this.keys.ArrowUp || this.keys.w || this.keys.W) moveY = 1;
            if (this.keys.ArrowDown || this.keys.s || this.keys.S) moveY = -1;

            if (this.joyActive) {
                moveX = this.joyX;
                moveY = this.joyY;
            }

            return { x: moveX, y: moveY };
        }

        reset() {
            Object.keys(this.keys).forEach(k => { this.keys[k] = false; });
            this.resetJoystick();
        }

        destroy() {
            window.removeEventListener('keydown', this.onKeyDown);
            window.removeEventListener('keyup', this.onKeyUp);
            if (this.joystickZone) {
                this.joystickZone.removeEventListener('touchstart', this.handleTouch);
                this.joystickZone.removeEventListener('touchmove', this.handleTouch);
                this.joystickZone.removeEventListener('touchend', this.resetJoystick);
                this.joystickZone.removeEventListener('touchcancel', this.resetJoystick);
            }
        }
    }

    exports.InputManager = InputManager;
})(window.NeonGame);
