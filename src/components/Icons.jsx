// Small inline icon set (stroke icons, 24px grid).
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const make = (paths) =>
  function Icon({ className = 'h-5 w-5', ...rest }) {
    return (
      <svg {...base} className={className} {...rest}>
        {paths}
      </svg>
    );
  };

export const IconMail = make(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>);
export const IconArrowUp = make(<path d="M12 19V5m-6 6 6-6 6 6" />);
export const IconPlay = make(<path d="M8 5v14l11-7z" fill="currentColor" />);
export const IconPause = make(<path d="M9 5v14M15 5v14" strokeWidth="2.4" />);
export const IconCalendar = make(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>);
export const IconClock = make(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
export const IconPin = make(<><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></>);
export const IconCopy = make(<><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>);
export const IconCheck = make(<path d="m5 12 5 5 9-10" />);
export const IconGift = make(<><rect x="3" y="8" width="18" height="13" rx="1" /><path d="M12 8v13M3 12h18M12 8S10 3 7.5 4 9 8 12 8zm0 0s2-5 4.5-4S15 8 12 8z" /></>);
export const IconSend = make(<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />);
export const IconHeart = make(<path d="M12 20s-7-4.4-9-9.2C1.6 7.3 3.8 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.4 0 5.6 3.3 4.2 6.8C19 15.6 12 20 12 20z" />);
export const IconSpark = make(<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />);
export const IconRing = make(<><circle cx="12" cy="15" r="6" /><path d="m9 4 3 4 3-4-1.5-1h-3z" /></>);
export const IconMosque = make(<><path d="M4 21V12a8 8 0 0 1 16 0v9" /><path d="M12 4V2M2 21h20M10 21v-4a2 2 0 0 1 4 0v4" /></>);
export const IconInstagram = make(<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></>);
export const IconMusic =make(<><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></>);
