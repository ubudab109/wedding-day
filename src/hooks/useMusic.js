import { useCallback, useEffect, useRef, useState } from 'react';
import { createAmbientSynth } from '../lib/ambientSynth';

// Plays the configured audio file; falls back to a generated ambient loop when the
// file is missing or unsupported. Pauses while the tab is hidden.
export function useMusic(src) {
  const audioRef = useRef(null);
  const synthRef = useRef(null);
  const fallbackRef = useRef(false);
  const wantPlayRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'metadata'; // stream on play instead of pulling the whole MP3 up front
    audio.volume = 0.65;
    audio.src = src;
    audioRef.current = audio;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => {
      fallbackRef.current = true;
    };
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      synthRef.current?.dispose();
      synthRef.current = null;
    };
  }, [src]);

  const startFallback = useCallback(() => {
    fallbackRef.current = true;
    synthRef.current ??= createAmbientSynth();
    if (synthRef.current.start()) setPlaying(true);
  }, []);

  const play = useCallback(async () => {
    wantPlayRef.current = true;
    if (fallbackRef.current) return startFallback();
    try {
      await audioRef.current.play();
    } catch (err) {
      // An autoplay block is not a missing file — leave the toggle to the user.
      if (err?.name !== 'NotAllowedError') startFallback();
    }
  }, [startFallback]);

  const pause = useCallback(() => {
    wantPlayRef.current = false;
    if (fallbackRef.current) {
      synthRef.current?.stop();
      setPlaying(false);
    } else {
      audioRef.current?.pause();
    }
  }, []);

  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play]);

  useEffect(() => {
    const onVisibility = () => {
      if (!wantPlayRef.current) return;
      if (document.hidden) {
        if (fallbackRef.current) synthRef.current?.stop();
        else audioRef.current?.pause();
      } else if (fallbackRef.current) {
        synthRef.current?.start();
      } else {
        audioRef.current?.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return { playing, play, pause, toggle };
}
