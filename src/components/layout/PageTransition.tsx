'use client';

import {usePathname} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';

const TRANSITION_MS = 3000;

export default function PageTransition() {
  const pathname = usePathname();
  const isMountedRef = useRef(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    setActiveKey(`${pathname}-${Date.now()}`);
    const timer = window.setTimeout(() => setActiveKey(null), TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (!activeKey) return null;

  return (
    <div
      key={activeKey}
      aria-hidden="true"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        backgroundColor: '#F4EFE6',
        animation: 'pageTransitionOverlay 3000ms ease forwards',
        pointerEvents: 'none'
      }}
    >
      <h2
        className="font-serif text-ink m-0"
        style={{
          fontSize: 'clamp(40px, 5vw, 72px)',
          lineHeight: 1,
          animation: 'pageTransitionFade 600ms ease both'
        }}
      >
        ADMARA
      </h2>
      <p
        className="font-sans text-ink m-0"
        style={{
          fontSize: 'clamp(16px, 2vw, 29px)',
          marginTop: '8px',
          animation: 'pageTransitionFade 600ms ease 80ms both'
        }}
      >
        studio
      </p>

      <style jsx>{`
        @keyframes pageTransitionFade {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pageTransitionOverlay {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
