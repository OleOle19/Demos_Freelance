import { useEffect } from "react";
import { trackEvent } from "../api";

export function useTrackVisit(source) {
  useEffect(() => {
    trackEvent("visit", source).catch(() => {
      // Tracking failures should not block UX.
    });
  }, [source]);
}
