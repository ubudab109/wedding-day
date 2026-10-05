import { useCallback, useEffect, useState } from 'react';
import { wedding } from './config/wedding';
import { useGuestName } from './hooks/useGuestName';
import { useMusic } from './hooks/useMusic';
import CursorTrail from './components/CursorTrail';
import FallingPetals from './components/FallingPetals';
import FloatingControls from './components/FloatingControls';
import ScrollBuddy from './components/ScrollBuddy';
import Cover from './components/sections/Cover';
import Hero from './components/sections/Hero';
import Countdown from './components/sections/Countdown';
import AboutUs from './components/sections/AboutUs';
import Gallery from './components/sections/Gallery';
import LoveStory from './components/sections/LoveStory';
import Schedule from './components/sections/Schedule';
import Gift from './components/sections/Gift';
import GuestBook from './components/sections/GuestBook';
import Footer from './components/sections/Footer';

export default function App() {
  const guest = useGuestName();
  const music = useMusic(wedding.music.src);
  const [opened, setOpened] = useState(false); // content revealed (doors started opening)
  const [coverGone, setCoverGone] = useState(false); // cover unmounted

  // Lock scrolling until the invitation is opened.
  useEffect(() => {
    document.documentElement.style.overflow = opened ? '' : 'hidden';
    if (!opened) window.scrollTo(0, 0);
  }, [opened]);

  const handleOpen = useCallback(() => {
    music.play();
    setOpened(true);
  }, [music]);

  return (
    <>
      <CursorTrail />
      <FallingPetals />

      {!coverGone && <Cover guest={guest} onOpen={handleOpen} onDone={() => setCoverGone(true)} />}

      <main aria-hidden={!opened}>
        <Hero active={opened} />
        <Countdown />
        <AboutUs />
        <Gallery />
        <LoveStory />
        <Schedule />
        <Gift />
        <GuestBook guest={guest} />
        <Footer />
      </main>

      {coverGone && (
        <>
          <ScrollBuddy />
          <FloatingControls music={music} track={wedding.music} />
        </>
      )}
    </>
  );
}
