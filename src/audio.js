// Audio and Speech Synthesis Engine for Kindergarten Kids (Maths CI)
// Designed for Warm, Human-Like Voice Narration and Organic Acoustic Sound Effects
import { state } from './state.js';

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.speechEnabled = true;
    this.selectedVoice = null;
    this.availableVoices = [];
    
    // Default natural preschool teacher settings
    this.pitch = (state.data.settings && state.data.settings.pitch) || 1.05;
    this.rate = (state.data.settings && state.data.settings.rate) || 0.92;
    this.volume = (state.data.settings && state.data.settings.volume) || 1.0;
    this.savedVoiceUri = (state.data.settings && state.data.settings.voiceUri) || '';

    this.initSpeech();
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Calculate "human warmth & quality score" for a voice
  scoreVoice(voice) {
    let score = 0;
    const name = voice.name.toLowerCase();
    const uri = (voice.voiceURI || '').toLowerCase();

    // 1. Natural / Neural AI voices (Highest fidelity, indistinguishable from a real human)
    if (name.includes('natural') || uri.includes('natural') || name.includes('online') || name.includes('neural')) {
      score += 150;
    }
    // 2. Google High Quality neural voices (Android & Chrome)
    if (name.includes('google') || uri.includes('google')) {
      score += 110;
    }
    // 3. Apple Enhanced / Premium voices (iOS / macOS Siri, Amélie, Thomas)
    if (name.includes('enhanced') || name.includes('premium') || name.includes('amélior') || name.includes('siri')) {
      score += 100;
    }
    // 4. Renowned warm French voices
    if (name.includes('denise')) score += 50;
    if (name.includes('amelie') || name.includes('amélie')) score += 45;
    if (name.includes('henri')) score += 40;
    if (name.includes('thomas') || name.includes('audrey') || name.includes('julie')) score += 35;
    if (name.includes('hortense') || name.includes('paul')) score += 20;

    // French language match
    if (voice.lang === 'fr-FR') score += 20;
    else if (voice.lang.startsWith('fr')) score += 10;

    return score;
  }

  initSpeech() {
    if ('speechSynthesis' in window) {
      const updateVoices = () => {
        const allVoices = window.speechSynthesis.getVoices();
        // Filter French voices
        const frVoices = allVoices.filter(v => v.lang && v.lang.toLowerCase().startsWith('fr'));
        
        // Sort from most natural/human to standard
        frVoices.sort((a, b) => this.scoreVoice(b) - this.scoreVoice(a));
        this.availableVoices = frVoices;

        // Try to restore saved voice
        if (this.savedVoiceUri) {
          const match = frVoices.find(v => v.voiceURI === this.savedVoiceUri);
          if (match) {
            this.selectedVoice = match;
            return;
          }
        }

        // Otherwise pick the best natural voice
        if (frVoices.length > 0) {
          this.selectedVoice = frVoices[0];
        }
      };

      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }

  getFrenchVoices() {
    if (this.availableVoices.length === 0 && 'speechSynthesis' in window) {
      const allVoices = window.speechSynthesis.getVoices();
      const frVoices = allVoices.filter(v => v.lang && v.lang.toLowerCase().startsWith('fr'));
      frVoices.sort((a, b) => this.scoreVoice(b) - this.scoreVoice(a));
      this.availableVoices = frVoices;
    }
    return this.availableVoices;
  }

  setVoice(voiceUri) {
    this.savedVoiceUri = voiceUri;
    const match = this.availableVoices.find(v => v.voiceURI === voiceUri);
    if (match) {
      this.selectedVoice = match;
    }
    state.setVoiceSettings({ voiceUri });
  }

  setPitch(pitch) {
    this.pitch = parseFloat(pitch) || 1.05;
    state.setVoiceSettings({ pitch: this.pitch });
  }

  setRate(rate) {
    this.rate = parseFloat(rate) || 0.92;
    state.setVoiceSettings({ rate: this.rate });
  }

  // Preprocess text to sound more human & spoken naturally for a toddler
  formatTextForSpeech(text) {
    if (!text) return '';
    let t = text;

    // Expand standalone digits 0-6 to gentle spoken words
    t = t.replace(/\b0\b/g, 'zéro');
    t = t.replace(/\b1\b/g, 'un');
    t = t.replace(/\b2\b/g, 'deux');
    t = t.replace(/\b3\b/g, 'trois');
    t = t.replace(/\b4\b/g, 'quatre');
    t = t.replace(/\b5\b/g, 'cinq');
    t = t.replace(/\b6\b/g, 'six');

    // Add breathing commas for smooth cadence
    t = t.replace(/([?!])\s*/g, '$1 , ');
    t = t.replace(/\.\.\./g, ' , ');

    return t;
  }

  speak(text) {
    if (!this.speechEnabled || !('speechSynthesis' in window)) return;
    
    // Cancel current speech to prevent queue build up
    window.speechSynthesis.cancel();

    const formattedText = this.formatTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(formattedText);
    utterance.lang = 'fr-FR';
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    // Workaround for mobile browsers occasionally hanging speechSynthesis
    window.speechSynthesis.speak(utterance);
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // --------------------------------------------------------------------------
  // Organic Acoustic Sound Effects (Web Audio API with Warm Filtering)
  // --------------------------------------------------------------------------

  // Play a soft acoustic tone with harmonic overtones and lowpass warmth (like a wooden xylophone)
  playAcousticTone(freq, duration = 0.25, gainValue = 0.22, startDelay = 0) {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime + startDelay;

      // Warm low-pass acoustic filter to remove harsh electronic frequencies
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, now);
      filter.Q.setValueAtTime(1.5, now);

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(gainValue, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // Fundamental oscillator
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);

      // Soft harmonic overtone for marimba/kalimba wooden warmth
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);
      const gain2 = this.ctx.createGain();
      gain2.gain.setValueAtTime(0.35, now);

      osc1.connect(masterGain);
      osc2.connect(gain2);
      gain2.connect(masterGain);

      masterGain.connect(filter);
      filter.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch (e) {
      console.warn('playAcousticTone error', e);
    }
  }

  // Play bubbly tap/pop sound with warm pitch decay
  playPop() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  // Warm cheerful marimba success chime (Do - Mi - Sol - Do)
  playSuccess() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      this.playAcousticTone(freq, 0.35, 0.24, idx * 0.07);
    });
  }

  // Gentle encouraging descending wooden tone
  playTryAgain() {
    this.playAcousticTone(330, 0.22, 0.18, 0);
    this.playAcousticTone(260, 0.30, 0.18, 0.11);
  }

  // Twinkling music box star sound
  playStar() {
    const starNotes = [880, 1046.5, 1318.51, 1567.98, 2093];
    starNotes.forEach((freq, idx) => {
      this.playAcousticTone(freq, 0.28, 0.18, idx * 0.06);
    });
  }

  // Grand celebratory fanfare with rich acoustic chords
  playFanfare() {
    const melody = [
      { f: 523.25, d: 0.18, t: 0 },
      { f: 659.25, d: 0.18, t: 0.12 },
      { f: 783.99, d: 0.20, t: 0.24 },
      { f: 1046.50, d: 0.45, t: 0.38 },
      { f: 880, d: 0.20, t: 0.62 },
      { f: 1046.50, d: 0.70, t: 0.82 }
    ];
    melody.forEach(item => {
      this.playAcousticTone(item.f, item.d, 0.28, item.t);
    });
  }

  // Counting tone (1, 2, 3...)
  playCount(num) {
    const baseFreqs = [440, 493.88, 554.37, 587.33, 659.25, 739.99, 880];
    const freq = baseFreqs[Math.min(num - 1, baseFreqs.length - 1)] || 440;
    this.playAcousticTone(freq, 0.28, 0.26);
  }
}

export const sounds = new SoundEngine();
