/**
 * DevoRythmer - Version bundle temporaire
 * Tous les modules dans un seul fichier pour test rapide
 */

// ============= CONFIG =============
const APP_CONFIG = {
    BPM: 120,
    STEP_COUNT: 16,
    TRACK_NAMES: ['kick', 'snare', 'hihat', 'bass']
};

const AUDIO_CONFIG = {
    SAMPLE_PATHS: {
        kick: 'samples/Kick_01.wav',
        snare: 'samples/Clap_07.wav', 
        hihat: 'samples/Hi_Hat_02.wav',
        bass: 'samples/Ride_01.wav'
    },
    DEFAULT_GAIN: 0.7
};

const UI_CONFIG = {
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

// ============= AUDIO ENGINE =============
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

// ============= PATTERN MANAGER =============
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
        this.loadPreset('P1');
    }

    // ============= ALGORITHME EUCLIDIEN =============
    generateEuclideanRhythm(steps, pulses) {
        if (pulses === 0) return new Array(steps).fill(0);
        if (pulses >= steps) return new Array(steps).fill(1);
        
        const pattern = new Array(steps).fill(0);
        const interval = steps / pulses;
        
        for (let i = 0; i < pulses; i++) {
            const position = Math.round(i * interval) % steps;
            pattern[position] = 1;
        }
        
        return pattern;
    }

    loadPreset(presetName) {
        const presets = {
            'P1': {
                // Pattern techno classique
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
            },
            'P4': {
                // ✨ Euclidien: Grosse caisse espacée (16 steps, 5 pulses)
                kick: this.generateEuclideanRhythm(16, 5),
                snare: this.generateEuclideanRhythm(16, 3),
                hihat: this.generateEuclideanRhythm(16, 11),
                bass: this.generateEuclideanRhythm(16, 7)
            },
            'P5': {
                // ✨ Euclidien: Pattern africain (16 steps, différents pulses)
                kick: this.generateEuclideanRhythm(16, 4),
                snare: this.generateEuclideanRhythm(16, 6),
                hihat: this.generateEuclideanRhythm(16, 13),
                bass: this.generateEuclideanRhythm(16, 9)
            },
            'P6': {
                // ✨ Euclidien: Pattern minimal (16 steps, peu de pulses)
                kick: this.generateEuclideanRhythm(16, 3),
                snare: this.generateEuclideanRhythm(16, 2),
                hihat: this.generateEuclideanRhythm(16, 7),
                bass: this.generateEuclideanRhythm(16, 5)
            },
            'P7': {
                // ✨ Euclidien: Pattern complexe
                kick: this.generateEuclideanRhythm(16, 6),
                snare: this.generateEuclideanRhythm(16, 4),
                hihat: this.generateEuclideanRhythm(16, 15),
                bass: this.generateEuclideanRhythm(16, 8)
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
}

// ============= SEQUENCER =============
class Sequencer {
    constructor() {
        this.isPlaying = false;
        this.currentStep = 0;
        this.interval = null;
        this.stepTime = (60 / APP_CONFIG.BPM / 4) * 1000;
    }

    play() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.currentStep = 0;
        
        console.log('▶️ PLAY - BPM:', APP_CONFIG.BPM);
        
        this.interval = setInterval(() => this.playStep(), this.stepTime);
        this.dispatchEvent('play');
    }

    stop() {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        clearInterval(this.interval);
        
        console.log('⏹️ STOP');
        this.dispatchEvent('stop');
    }

    playStep() {
        this.dispatchEvent('stepStart', { step: this.currentStep });

        const activeSteps = patternManager.getActiveSteps(this.currentStep);
        
        activeSteps.forEach(track => {
            audioEngine.play(track);
        });

        this.dispatchEvent('stepPlay', { 
            step: this.currentStep, 
            activeTracks: activeSteps 
        });

        this.currentStep = (this.currentStep + 1) % APP_CONFIG.STEP_COUNT;
    }

    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(`sequencer:${eventName}`, { 
            detail: { ...data, sequencer: this } 
        });
        document.dispatchEvent(event);
    }
}

// ============= UI CONTROLLER =============
class UIController {
    constructor() {
        this.setupEventListeners();
        this.setupSequencerListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        document.getElementById('playBtn')?.addEventListener('click', () => sequencer.play());
        document.getElementById('stopBtn')?.addEventListener('click', () => sequencer.stop());
        
        document.querySelectorAll('.step').forEach(step => {
            step.addEventListener('click', (e) => this.handleStepClick(e));
        });
        
        document.querySelectorAll('.track-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => this.handleTrackToggle(e));
        });
        
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handlePresetClick(e));
        });
    }

    setupSequencerListeners() {
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
        step.classList.toggle('active', isActive);
        
        console.log(`${track} step ${stepIndex}: ${isActive ? 'ON' : 'OFF'}`);
    }

    handleTrackToggle(event) {
        const button = event.target;
        const track = button.closest('.track').querySelector('.step').dataset.track;
        
        const isActive = patternManager.toggleTrack(track);
        button.classList.toggle('active', isActive);
        button.textContent = isActive ? 'ON' : 'OFF';
        
        console.log(`${track} piste: ${isActive ? 'ON' : 'OFF'}`);
    }

    handlePresetClick(event) {
        const presetBtn = event.target;
        const presetName = presetBtn.textContent;
        
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        presetBtn.classList.add('active');
        
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
        
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('playing');
        });
    }

    onStepStart() {
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('playing');
        });
    }

    onStepPlay(event) {
        const { step, activeTracks } = event.detail;
        
        activeTracks.forEach(track => {
            const stepElement = document.querySelector(
                `.step[data-track="${track}"][data-step="${step}"]`
            );
            if (stepElement) {
                stepElement.classList.add('playing');
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
                    stepElement.classList.toggle('active', isActive);
                }
            });
        });
    }
}

// ============= INITIALISATION =============
const audioEngine = new AudioEngine();
const patternManager = new PatternManager();
const sequencer = new Sequencer();

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DevoRythmer - Initialisation...');
    
    try {
        await audioEngine.init();
        const uiController = new UIController();
        console.log('✅ DevoRythmer initialisé avec succès !');
    } catch (error) {
        console.error('❌ Erreur initialisation:', error);
    }
});