"use client";

import { useEffect, useState } from "react";

// Blendet seine Kinder (das Beispiel-Dokument) aus, sobald ToolForm die echte
// Vorschau zeigt — sonst stünden Beispiel und Vorschau doppelt untereinander.
// ToolForm sendet dazu das Fenster-Event "gd-preview-active".
export default function PreviewGate({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    function onEvt(e: Event) {
      setHidden(Boolean((e as CustomEvent).detail));
    }
    window.addEventListener("gd-preview-active", onEvt);
    return () => window.removeEventListener("gd-preview-active", onEvt);
  }, []);

  if (hidden) return null;
  return <>{children}</>;
}
