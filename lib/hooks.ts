// hooks.ts
import { useActiveSectionContext } from "@/context/active-section-context";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import type { SectionHash } from "./types";

export function useSectionInView(sectionHash: SectionHash, threshold = 0.75) {
  const { ref, inView } = useInView({
    threshold,
  });
  const { setActiveSection, timeOfLastClick } = useActiveSectionContext();

  useEffect(() => {
    if (inView && Date.now() - timeOfLastClick > 1000) {
      setActiveSection(sectionHash);
    }
  }, [inView, setActiveSection, timeOfLastClick, sectionHash]);

  return {
    ref,
    inView
  };
}
