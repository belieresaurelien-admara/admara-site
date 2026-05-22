'use client';

import {useEffect, useRef} from 'react';

type Props = {
  /** Path or URL to the desktop video (≥ md breakpoint). */
  desktopSrc: string;
  /** Path or URL to the phone video (< md breakpoint). */
  phoneSrc: string;
  /** Optional poster image, used while the video loads. */
  poster?: string;
  /** Overlay tint opacity (0-100). Default 30. */
  overlayOpacity?: number;
  className?: string;
};

const STORAGE_KEY = 'videoTime';
const THROTTLE_MS = 2000;

/**
 * Full-bleed video background with responsive desktop/phone variants.
 * - Persists currentTime across in-tab navigations via sessionStorage (throttled to 2s).
 * - Both videos render; CSS visibility-toggles the right one.
 * - Muted + autoplay + playsInline required for iOS Safari autoplay.
 */
export default function VideoBackground({
  desktopSrc,
  phoneSrc,
  poster,
  overlayOpacity = 30,
  className = ''
}: Props) {
  const videoDesktopRef = useRef<HTMLVideoElement | null>(null);
  const videoPhoneRef = useRef<HTMLVideoElement | null>(null);
  const lastSaveRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    const startAt = stored ? parseFloat(stored) : NaN;

    const apply = (video: HTMLVideoElement | null) => {
      if (!video) return;
      if (Number.isFinite(startAt) && startAt > 0) {
        const setTime = () => {
          try {
            video.currentTime = startAt;
          } catch {
            /* swallow — invalid time, video metadata not ready */
          }
        };
        if (video.readyState >= 1) setTime();
        else video.addEventListener('loadedmetadata', setTime, {once: true});
      }
    };

    apply(videoDesktopRef.current);
    apply(videoPhoneRef.current);

    const onTimeUpdate = (event: Event) => {
      const target = event.target as HTMLVideoElement;
      const now = Date.now();
      if (now - lastSaveRef.current < THROTTLE_MS) return;
      lastSaveRef.current = now;
      try {
        window.sessionStorage.setItem(STORAGE_KEY, target.currentTime.toString());
      } catch {
        /* sessionStorage may be unavailable (private mode) — silent fail */
      }
    };

    const desktop = videoDesktopRef.current;
    const phone = videoPhoneRef.current;
    desktop?.addEventListener('timeupdate', onTimeUpdate);
    phone?.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      desktop?.removeEventListener('timeupdate', onTimeUpdate);
      phone?.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, []);

  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <video
        ref={videoDesktopRef}
        className="hidden md:block w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        preload="metadata"
        aria-hidden="true"
      >
        <source src={desktopSrc} type="video/mp4" />
      </video>

      <video
        ref={videoPhoneRef}
        className="block md:hidden w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        preload="metadata"
        aria-hidden="true"
      >
        <source src={phoneSrc} type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 bg-ink pointer-events-none"
        style={{opacity: overlayOpacity / 100}}
        aria-hidden="true"
      />
    </div>
  );
}
