/**
 * Configuration globale de DevoRythmer
 * Centralise toutes les constantes et paramètres
 */

export const APP_CONFIG = {
    BPM: 120,
    STEP_COUNT: 16,
    TRACK_NAMES: ['kick', 'snare', 'hihat', 'bass']
};

export const AUDIO_CONFIG = {
    SAMPLE_PATHS: {
        kick: 'samples/Kick_01.wav',
        snare: 'samples/Clap_07.wav', 
        hihat: 'samples/Hi_Hat_02.wav',
        bass: 'samples/Ride_01.wav'
    },
    DEFAULT_GAIN: 0.7
};

export const UI_CONFIG = {
    SELECTORS: {
        playBtn: '#playBtn',
        stopBtn: '#stopBtn',
        steps: '.step',
        trackToggles: '.track-toggle',
        presetBtns: '.preset-btn'
    },
    CLASSES: {
        active: 'active',
        playing: 'playing'
    }
};