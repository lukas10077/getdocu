"use client";

import { useEffect, useRef, ReactNode } from "react";

export default function RevealOnScroll({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback: zeige Element spätestens nach 800ms (falls Observer nicht feuert)
    const fallback = setTimeout(() => {
      el.style.animationDelay = "0ms";
      el.classList.add("is-visible");
    }, 800);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(fallback);
          el.style.animationDelay = `${delay}ms`;
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0 } // feuert sobald irgendein Pixel sichtbar ist
    );

    observer.observe(el);
    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
