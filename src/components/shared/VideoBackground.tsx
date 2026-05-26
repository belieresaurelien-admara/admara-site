'use client';

import {useEffect, useRef, useState} from 'react';

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
const MD_BREAKPOINT = 768; // matches Tailwind md:

/**
 * Full-bleed video background with responsive desktop/phone variants.
 * - Renders ONE <video> element at a time based on viewport — avoids two
 *   videos competing for autoplay (iOS Safari was failing silently).
 * - Forces preload="auto" so iOS has enough buffer to start playback.
 * - Programmatically calls .play() once mounted to bypass edge cases where
 *   autoplay attribute alone fails (low-power signals, certain webviews).
 *   Caught promise rejections stay silent — user can tap to start manually.
 * - Persists currentTime across in-tab navigations via sessionStorage.
 */
export default function VideoBackground({
  desktopSrc,
  phoneSrc,
  poster,
  overlayOpacity = 30,
  className = ''
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastSaveRef = useRef<number>(0);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const video = videoRef.current;
    if (!video) return;

    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    const startAt = stored ? parseFloat(stored) : NaN;

    const resumeAndPlay = () => {
      if (Number.isFinite(startAt) && startAt > 0) {
        try {
          video.currentTime = startAt;
        } catch {
          /* metadata not ready — silent */
        }
      }
      video.play().catch(() => {
        /* autoplay blocked (low power mode, etc.) — user can tap to start */
      });
    };

    if (video.readyState >= 2) resumeAndPlay();
    else video.addEventListener('loadeddata', resumeAndPlay, {once: true});

    const onTimeUpdate = () => {
      const now = Date.now();
      if (now - lastSaveRef.current < THROTTLE_MS) return;
      lastSaveRef.current = now;
      try {
        window.sessionStorage.setItem(STORAGE_KEY, video.currentTime.toString());
      } catch {
        /* sessionStorage unavailable */
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadeddata', resumeAndPlay);
    };
  }, [isDesktop]);

  // Avoid SSR/CSR mismatch: render nothing until the matchMedia has resolved.
  if (isDesktop === null) {
    return (
      <div className={`absolute inset-0 -z-10 overflow-hidden bg-ink ${className}`} />
    );
  }

  const src = isDesktop ? desktopSrc : phoneSrc;

  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <video
        key={src}
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        preload="auto"
        aria-hidden="true"
      >
        <source src={src} type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 bg-ink pointer-events-none"
        style={{opacity: overlayOpacity / 100}}
        aria-hidden="true"
      />
    </div>
  );
}
