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

/**
 * Full-bleed video background with responsive desktop/phone variants.
 * - Both videos are rendered; CSS visibility-toggles the right one to avoid double-fetch in modern browsers (mp4 with preload="metadata" only fetches headers).
 * - Muted + autoplay + playsInline are required for iOS Safari autoplay to work.
 * - The overlay improves text contrast over busy footage.
 */
export default function VideoBackground({
  desktopSrc,
  phoneSrc,
  poster,
  overlayOpacity = 30,
  className = ''
}: Props) {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <video
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
