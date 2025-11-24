// Sound effects utility using Web Audio API
class SoundEffects {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Click/Tap sound
  click() {
    this.playTone(800, 0.05, 'square', 0.1);
  }

  // Success sound (correct answer, earn tokens)
  success() {
    if (!this.audioContext) return;
    
    this.playTone(523, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.2), 100);
    setTimeout(() => this.playTone(784, 0.2, 'sine', 0.2), 200);
  }

  // Error sound (wrong answer)
  error() {
    if (!this.audioContext) return;
    
    this.playTone(200, 0.1, 'sawtooth', 0.15);
    setTimeout(() => this.playTone(150, 0.2, 'sawtooth', 0.15), 100);
  }

  // Coin/Token earn sound
  coin() {
    if (!this.audioContext) return;
    
    this.playTone(988, 0.05, 'square', 0.15);
    setTimeout(() => this.playTone(1319, 0.1, 'square', 0.15), 50);
  }

  // Level complete / Challenge complete
  levelComplete() {
    if (!this.audioContext) return;
    
    this.playTone(523, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.2), 100);
    setTimeout(() => this.playTone(784, 0.1, 'sine', 0.2), 200);
    setTimeout(() => this.playTone(1047, 0.3, 'sine', 0.2), 300);
  }

  // Victory fanfare (AI Battle win)
  victory() {
    if (!this.audioContext) return;
    
    this.playTone(523, 0.15, 'sine', 0.25);
    setTimeout(() => this.playTone(659, 0.15, 'sine', 0.25), 150);
    setTimeout(() => this.playTone(784, 0.15, 'sine', 0.25), 300);
    setTimeout(() => this.playTone(1047, 0.15, 'sine', 0.25), 450);
    setTimeout(() => this.playTone(1319, 0.4, 'sine', 0.25), 600);
  }

  // Countdown tick
  tick() {
    this.playTone(600, 0.05, 'square', 0.1);
  }

  // Warning (low time)
  warning() {
    this.playTone(440, 0.1, 'triangle', 0.2);
  }

  // Swoosh (navigation)
  swoosh() {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.2);
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  // Power up (avatar selection, metamask connect)
  powerUp() {
    if (!this.audioContext) return;
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playTone(220 + (i * 110), 0.05, 'sine', 0.15);
      }, i * 50);
    }
  }

  // Button hover
  hover() {
    this.playTone(600, 0.03, 'sine', 0.05);
  }
}

// Export singleton instance
export const sounds = new SoundEffects();
