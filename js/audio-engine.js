/**
 * Moteur audio basé sur Web Audio API
 * Gère le chargement et la lecture des samples
 */

import { AUDIO_CONFIG } from './config.js';

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.samples = {};
        this.isInitialized = false;
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            await this.loadAllSamples();
            this.isInitialized = true;
            console.log('🎵 AudioEngine initialisé');
        } catch (error) {
            console.error('❌ Erreur AudioEngine:', error);
        }
    }

    async loadAllSamples() {
        const loadPromises = Object.entries(AUDIO_CONFIG.SAMPLE_PATHS).map(
            ([name, path]) => this.loadSample(name, path)
        );
        await Promise.all(loadPromises);
    }

    async loadSample(name, path) {
        try {
            const response = await fetch(path);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.samples[name] = audioBuffer;
            console.log(`✅ Sample ${name} chargé`);
        } catch (error) {
            console.warn(`⚠️ Erreur chargement ${name}:`, error);
        }
    }

    play(trackName) {
        if (!this.isInitialized || !this.samples[trackName]) {
            console.warn(`⚠️ Sample ${trackName} non disponible`);
            return;
        }

        try {
            // Reprendre le contexte si suspendu (Chrome/Safari)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();

            source.buffer = this.samples[trackName];
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            gainNode.gain.value = AUDIO_CONFIG.DEFAULT_GAIN;

            source.start(0);
            console.log(`🔊 Playing ${trackName}`);
        } catch (error) {
            console.error(`❌ Erreur lecture ${trackName}:`, error);
        }
    }
}

// Instance singleton
export const audioEngine = new AudioEngine();