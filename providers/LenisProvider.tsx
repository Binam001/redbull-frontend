"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

interface LenisContextValue {
  lenis: Lenis | null;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: Parameters<Lenis["scrollTo"]>[1],
  ) => void;
  scrollToTop: () => void;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  scrollTo: () => {},
  scrollToTop: () => {},
});

export const useLenis = () => useContext(LenisContext);

interface LenisProviderProps {
  children: React.ReactNode;
  /**
   * Lenis constructor options — all optional.
   * Sensible defaults are applied below; pass overrides here.
   */
  options?: ConstructorParameters<typeof Lenis>[0];
}

export const LenisProvider = ({ children, options }: LenisProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Disable automatic browser scroll restoration on reload
    if (
      typeof window !== "undefined" &&
      "scrollRestoration" in window.history
    ) {
      window.history.scrollRestoration = "manual";
    }

    // Ensure native scroll position is at the very top immediately
    window.scrollTo(0, 0);

    // Fix for mobile layout shifts and pinning issues
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    // Normalize scroll handles address bar resizing on mobile by intercepting the scroll
    // Removed normalizeScroll as it conflicts with Lenis and causes severe iOS bugs/freezing
    ScrollTrigger.normalizeScroll(true);

    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      orientation: "vertical",
      gestureOrientation: "vertical",
      lerp: 0.07,
      wheelMultiplier: 1.2,
      touchMultiplier: 2, // Slightly increased for better mobile response
      infinite: false,
      ...options,
    });

    lenisInstance.scrollTo(0, { immediate: true, force: true });

    lenisInstance.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Watch for content height changes and refresh
    const resizeObserver = new ResizeObserver(() => {
      lenisInstance.resize();

      if (window.innerWidth > 1024) {
        ScrollTrigger.refresh();
      }
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    lenisRef.current = lenisInstance;
    setLenis(lenisInstance);

    const handleScrollToTop = () => {
      window.scrollTo(0, 0);
      lenisInstance.scrollTo(0, { immediate: true, force: true });
      ScrollTrigger.refresh();
    };

    window.addEventListener("scrollToTop", handleScrollToTop);

    return () => {
      window.removeEventListener("scrollToTop", handleScrollToTop);
      gsap.ticker.remove((time) => lenisInstance.raf(time * 1000));
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      lenisInstance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const instance = lenisRef.current;
    if (!instance) return;

    instance.stop();
    instance.scrollTo(0, { immediate: true, force: true });

    // Immediate start and refresh
    instance.start();

    const id = setTimeout(() => {
      window.scrollTo(0, 0);
      instance.scrollTo(0, { immediate: true, force: true });
      ScrollTrigger.refresh();
      instance.resize();
    }, 150);

    return () => clearTimeout(id);
  }, [pathname]);

  const scrollTo = useCallback<LenisContextValue["scrollTo"]>(
    (target, scrollOptions) => {
      lenisRef.current?.scrollTo(target as never, scrollOptions);
    },
    [],
  );

  const scrollToTop = useCallback(() => {
    lenisRef.current?.scrollTo(0, { duration: 1.2 });
  }, []);

  return (
    <LenisContext.Provider value={{ lenis, scrollTo, scrollToTop }}>
      {children}
    </LenisContext.Provider>
  );
};

export default LenisProvider;
