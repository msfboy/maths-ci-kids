// Audio and Speech Synthesis Engine for Kindergarten Kids

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.speechEnabled = true;
    this.selectedVoice = null;
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

  initSpeech() {
    if ('speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        // Look for French voices
        const frVoices = voices.filter(v => v.lang.startsWith('fr'));
        if (frVoices.length > 0) {
          // Prefer high-quality voices if possible (Google, Natural, Amelie, etc.)
          this.selectedVoice = frVoices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || frVoices[0];
        }
      };

      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }

  speak(text) {
    if (!this.speechEnabled || !('speechSynthesis' in window)) return;
    
    // Stop current speech to avoid backlog
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.92; // Slightly slower, very articulate for preschool kids
    utterance.pitch = 1.15; // Cheerful friendly tone

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  playTone(freq, type = 'sine', duration = 0.2, gainValue = 0.2, startDelay = 0) {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startDelay);

      gain.gain.setValueAtTime(gainValue, this.ctx.currentTime + startDelay);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + startDelay + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + startDelay);
      osc.stop(this.ctx.currentTime + startDelay + duration);
    } catch (e) {
      console.warn('Audio playTone error', e);
    }
  }

  // Play bubbly tap/pop sound
  playPop() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {}
  }

  // Bright cheerful success chime (C5 - E5 - G5 - C6)
  playSuccess() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.25, 0.25, idx * 0.08);
    });
  }

  // Gentle boop for trying again
  playTryAgain() {
    this.playTone(280, 'sine', 0.15, 0.2, 0);
    this.playTone(240, 'sine', 0.22, 0.2, 0.12);
  }

  // Twinkling star sound
  playStar() {
    const starNotes = [880, 1046.5, 1318.51, 1567.98, 2093];
    starNotes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.2, 0.18, idx * 0.06);
    });
  }

  // Grand Fanfare when completing a level
  playFanfare() {
    const melody = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 659.25, d: 0.12, t: 0.12 },
      { f: 783.99, d: 0.12, t: 0.24 },
      { f: 1046.50, d: 0.4, t: 0.36 },
      { f: 880, d: 0.15, t: 0.6 },
      { f: 1046.50, d: 0.6, t: 0.78 }
    ];
    melody.forEach(item => {
      this.playTone(item.f, 'triangle', item.d, 0.3, item.t);
    });
  }

  // Counting tone (1, 2, 3...)
  playCount(num) {
    const baseFreqs = [440, 493.88, 554.37, 587.33, 659.25, 739.99, 880];
    const freq = baseFreqs[Math.min(num - 1, baseFreqs.length - 1)] || 440;
    this.playTone(freq, 'triangle', 0.2, 0.25);
  }
}

export const sounds = new SoundEngine();
