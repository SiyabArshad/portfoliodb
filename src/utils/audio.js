// Simple synthetic audio engine to avoid external asset dependencies for now
class AudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.noiseNode = null;
        this.isInitialized = false;
        this.isPlaying = false;
    }

    init() {
        if (this.isInitialized) return;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 1.0;
        this.masterGain.connect(this.ctx.destination);

        this.engineGain = this.ctx.createGain();
        this.engineGain.gain.value = 0.1;
        this.engineGain.connect(this.masterGain);

        this.isInitialized = true;
    }

    // Create Brown Noise for "Rumble"
    createNoiseBuffer() {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (0 + (0.02 * white)) / 1.02; // Roughly brown-ish
            output[i] *= 3.5;
        }
        return buffer;
    }

    startEngine() {
        if (!this.isInitialized) this.init();
        if (this.isPlaying) return;

        // Resume context if suspended (browser policy)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const buffer = this.createNoiseBuffer();
        this.noiseNode = this.ctx.createBufferSource();
        this.noiseNode.buffer = buffer;
        this.noiseNode.loop = true;

        // Lowpass filter to muffle the noise into a rumble
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        this.noiseNode.connect(filter);
        filter.connect(this.engineGain);
        this.noiseNode.start();
        this.isPlaying = true;
    }

    setSpeed(speed) {
        if (!this.isInitialized || !this.isPlaying) return;
        // Modulate volume/pitch based on speed (0 to 1)
        // Clamp speed
        const s = Math.min(Math.max(speed, 0), 1);

        // Volume ramping for engine
        this.engineGain.gain.setTargetAtTime(s * 0.2 + 0.05, this.ctx.currentTime, 0.1);
    }

    playHorn() {
        if (!this.isInitialized) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';

        // Classic twin-tone horn frequencies
        osc1.frequency.setValueAtTime(311.13, now); // Eb4
        osc2.frequency.setValueAtTime(370.00, now); // Gb4

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
        gain.gain.linearRampToValueAtTime(0, now + 0.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.8);
        osc2.stop(now + 0.8);
    }

    playAnnouncement() {
        // Placeholder for station chime
    }
}

export const audioManager = new AudioEngine();
