// A gentle, generic music-box + pad loop generated with the Web Audio API.
// Used only as a fallback when the instrumental audio file is unavailable.

const CHORDS = [
  [60, 64, 67, 71], // Cmaj7
  [57, 60, 64, 67], // Am7
  [53, 57, 60, 64], // Fmaj7
  [55, 59, 62, 67], // G
];
const ARP = [0, 1, 2, 3, 2, 1, 2, 3];
const STEP = 0.48; // seconds per arpeggio note

const mtof = (m) => 440 * 2 ** ((m - 69) / 12);

export function createAmbientSynth() {
  let ctx = null;
  let out = null;
  let timer = null;
  let step = 0;
  let nextTime = 0;

  const voice = (freq, t, dur, peak, type) => {
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(peak, t + Math.min(0.6, dur / 3));
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(amp).connect(out);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  };

  const schedule = () => {
    while (nextTime < ctx.currentTime + 0.8) {
      const chord = CHORDS[Math.floor(step / ARP.length) % CHORDS.length];
      const pos = step % ARP.length;
      if (pos === 0) {
        chord.forEach((m) => voice(mtof(m - 12), nextTime, STEP * ARP.length + 0.6, 0.035, 'sine'));
      }
      voice(mtof(chord[ARP[pos]] + 12), nextTime, 1.6, 0.06, 'triangle');
      nextTime += STEP;
      step += 1;
    }
  };

  return {
    start() {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        ctx = new AC();
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2600;
        out = ctx.createGain();
        out.gain.value = 0.9;
        out.connect(filter).connect(ctx.destination);
      }
      ctx.resume();
      if (!timer) {
        nextTime = ctx.currentTime + 0.1;
        timer = setInterval(schedule, 200);
      }
      return true;
    },
    stop() {
      clearInterval(timer);
      timer = null;
      ctx?.suspend();
    },
    dispose() {
      this.stop();
      ctx?.close();
      ctx = null;
    },
  };
}
