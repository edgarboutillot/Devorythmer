/**
 * Moteur de séquence
 * Gère la lecture temporelle et la synchronisation
 */

import { APP_CONFIG } from './config.js';
import { audioEngine } from './audio-engine.js';
import { patternManager } from './pattern-manager.js';

class Sequencer {
    constructor() {
        this.isPlaying = false;
        this.currentStep = 0;
        this.interval = null;
        this.stepTime = this.calculateStepTime();
    }

    calculateStepTime() {
        // Calcul du temps entre les steps (16ème de note)
        return (60 / APP_CONFIG.BPM / 4) * 1000;
    }

    play() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.currentStep = 0;
        
        console.log('▶️ PLAY - BPM:', APP_CONFIG.BPM);
        
        // Démarrer la boucle du séquenceur
        this.interval = setInterval(() => this.playStep(), this.stepTime);
        
        // Émettre un événement pour l'UI
        this.dispatchEvent('play');
    }

    stop() {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        clearInterval(this.interval);
        
        console.log('⏹️ STOP');
        
        // Émettre un événement pour l'UI
        this.dispatchEvent('stop');
    }

    playStep() {
        // Émettre événement pour l'UI (enlever indicateurs précédents)
        this.dispatchEvent('stepStart', { step: this.currentStep });

        // Récupérer les pistes actives pour ce step
        const activeSteps = patternManager.getActiveSteps(this.currentStep);
        
        // Jouer les samples
        activeSteps.forEach(track => {
            audioEngine.play(track);
        });

        // Émettre événement pour l'UI (ajouter indicateurs visuels)
        this.dispatchEvent('stepPlay', { 
            step: this.currentStep, 
            activeTracks: activeSteps 
        });

        // Passer au step suivant
        this.currentStep = (this.currentStep + 1) % APP_CONFIG.STEP_COUNT;
        
        console.log('Step:', this.currentStep);
    }

    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(`sequencer:${eventName}`, { 
            detail: { ...data, sequencer: this } 
        });
        document.dispatchEvent(event);
    }

    // Getters
    get playing() {
        return this.isPlaying;
    }

    get step() {
        return this.currentStep;
    }
}

// Instance singleton
export const sequencer = new Sequencer();