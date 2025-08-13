/**
 * Gestionnaire des patterns et presets
 * Contient la logique des rythmes et des presets euclidiens
 */

import { APP_CONFIG } from './config.js';

class PatternManager {
    constructor() {
        this.patterns = this.createEmptyPatterns();
        this.trackStates = this.createDefaultTrackStates();
        this.initDefaultPattern();
    }

    createEmptyPatterns() {
        const patterns = {};
        APP_CONFIG.TRACK_NAMES.forEach(track => {
            patterns[track] = new Array(APP_CONFIG.STEP_COUNT).fill(0);
        });
        return patterns;
    }

    createDefaultTrackStates() {
        const trackStates = {};
        APP_CONFIG.TRACK_NAMES.forEach(track => {
            trackStates[track] = true;
        });
        return trackStates;
    }

    initDefaultPattern() {
        // Preset P1 par défaut
        this.loadPreset('P1');
    }

    loadPreset(presetName) {
        const presets = {
            'P1': {
                // Pattern techno basique
                kick: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
                snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
                hihat: [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
                bass: [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0]
            },
            'P2': {
                // Pattern breakbeat
                kick: [1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
                snare: [0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0],
                hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
                bass: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0]
            },
            'P3': {
                // Pattern house
                kick: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
                snare: [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                hihat: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
                bass: [1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0]
            }
        };

        if (presets[presetName]) {
            this.patterns = { ...presets[presetName] };
            console.log(`Preset ${presetName} chargé`);
        } else {
            this.patterns = this.createEmptyPatterns();
            console.log('Pattern vide chargé');
        }
    }

    toggleStep(track, stepIndex) {
        if (this.patterns[track]) {
            this.patterns[track][stepIndex] = this.patterns[track][stepIndex] ? 0 : 1;
            return this.patterns[track][stepIndex];
        }
        return 0;
    }

    toggleTrack(track) {
        if (this.trackStates.hasOwnProperty(track)) {
            this.trackStates[track] = !this.trackStates[track];
            return this.trackStates[track];
        }
        return false;
    }

    getActiveSteps(stepIndex) {
        const activeSteps = [];
        Object.keys(this.patterns).forEach(track => {
            if (this.patterns[track][stepIndex] && this.trackStates[track]) {
                activeSteps.push(track);
            }
        });
        return activeSteps;
    }

    getAllPatterns() {
        return this.patterns;
    }

    getAllTrackStates() {
        return this.trackStates;
    }
}

// Instance singleton
export const patternManager = new PatternManager();