/**
 * Contrôleur d'interface utilisateur
 * Gère les interactions DOM et les événements
 */

import { UI_CONFIG } from './config.js';
import { sequencer } from './sequencer.js';
import { patternManager } from './pattern-manager.js';

class UIController {
    constructor() {
        this.setupEventListeners();
        this.setupSequencerListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        // Boutons transport
        document.getElementById('playBtn')?.addEventListener('click', () => sequencer.play());
        document.getElementById('stopBtn')?.addEventListener('click', () => sequencer.stop());
        
        // Steps clickables
        document.querySelectorAll(UI_CONFIG.SELECTORS.steps).forEach(step => {
            step.addEventListener('click', (e) => this.handleStepClick(e));
        });
        
        // Boutons track toggle
        document.querySelectorAll(UI_CONFIG.SELECTORS.trackToggles).forEach(toggle => {
            toggle.addEventListener('click', (e) => this.handleTrackToggle(e));
        });
        
        // Presets
        document.querySelectorAll(UI_CONFIG.SELECTORS.presetBtns).forEach(btn => {
            btn.addEventListener('click', (e) => this.handlePresetClick(e));
        });
    }

    setupSequencerListeners() {
        // Écouter les événements du séquenceur
        document.addEventListener('sequencer:play', () => this.onSequencerPlay());
        document.addEventListener('sequencer:stop', () => this.onSequencerStop());
        document.addEventListener('sequencer:stepStart', () => this.onStepStart());
        document.addEventListener('sequencer:stepPlay', (e) => this.onStepPlay(e));
    }

    handleStepClick(event) {
        const step = event.target;
        const track = step.dataset.track;
        const stepIndex = parseInt(step.dataset.step);
        
        const isActive = patternManager.toggleStep(track, stepIndex);
        step.classList.toggle(UI_CONFIG.CLASSES.active, isActive);
        
        console.log(`${track} step ${stepIndex}: ${isActive ? 'ON' : 'OFF'}`);
    }

    handleTrackToggle(event) {
        const button = event.target;
        const track = button.closest('.track').querySelector('.step').dataset.track;
        
        const isActive = patternManager.toggleTrack(track);
        button.classList.toggle(UI_CONFIG.CLASSES.active, isActive);
        button.textContent = isActive ? 'ON' : 'OFF';
        
        console.log(`${track} piste: ${isActive ? 'ON' : 'OFF'}`);
    }

    handlePresetClick(event) {
        const presetBtn = event.target;
        const presetName = presetBtn.textContent;
        
        // UI: désactiver l'ancien preset
        document.querySelectorAll(UI_CONFIG.SELECTORS.presetBtns).forEach(btn => {
            btn.classList.remove(UI_CONFIG.CLASSES.active);
        });
        
        // UI: activer le nouveau preset
        presetBtn.classList.add(UI_CONFIG.CLASSES.active);
        
        // Logique: charger le pattern
        patternManager.loadPreset(presetName);
        this.updateDisplay();
    }

    onSequencerPlay() {
        const playBtn = document.getElementById('playBtn');
        if (playBtn) playBtn.style.background = '#45a049';
    }

    onSequencerStop() {
        const playBtn = document.getElementById('playBtn');
        if (playBtn) playBtn.style.background = '#4CAF50';
        
        // Reset des indicateurs visuels
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove(UI_CONFIG.CLASSES.playing);
        });
    }

    onStepStart() {
        // Enlever tous les indicateurs de lecture
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove(UI_CONFIG.CLASSES.playing);
        });
    }

    onStepPlay(event) {
        const { step, activeTracks } = event.detail;
        
        // Ajouter indicateur visuel pour les pistes actives
        activeTracks.forEach(track => {
            const stepElement = document.querySelector(
                `.step[data-track="${track}"][data-step="${step}"]`
            );
            if (stepElement) {
                stepElement.classList.add(UI_CONFIG.CLASSES.playing);
            }
        });
    }

    updateDisplay() {
        const patterns = patternManager.getAllPatterns();
        
        Object.keys(patterns).forEach(track => {
            patterns[track].forEach((isActive, stepIndex) => {
                const stepElement = document.querySelector(
                    `.step[data-track="${track}"][data-step="${stepIndex}"]`
                );
                if (stepElement) {
                    stepElement.classList.toggle(UI_CONFIG.CLASSES.active, isActive);
                }
            });
        });
    }
}

export { UIController };