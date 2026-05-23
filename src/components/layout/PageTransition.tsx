'use client';

import {usePathname} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';

const TRANSITION_MS = 2300;

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
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{
        backgroundColor: '#F4EFE6',
        animation: 'pt-overlay 2300ms ease forwards',
        pointerEvents: 'none'
      }}
    >
      <h2
        className="font-serif m-0"
        style={{
          color: '#8E3A19',
          fontSize: 'clamp(48px, 6vw, 80px)',
          letterSpacing: '0.08em',
          lineHeight: 1,
          opacity: 0,
          animation: 'pt-admara 400ms ease forwards'
        }}
      >
        ADMARA
      </h2>
      <p
        className="font-sans m-0"
        style={{
          color: '#8E3A19',
          fontSize: 'clamp(16px, 2vw, 28px)',
          marginTop: '10px',
          opacity: 0,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          animation: 'pt-studio 350ms ease 350ms forwards'
        }}
      >
        studio
      </p>

      <style jsx>{`
        @keyframes pt-admara {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pt-studio {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 0.7;
            transform: translateY(0);
          }
        }
        @keyframes pt-overlay {
          0% {
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          74% {
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
