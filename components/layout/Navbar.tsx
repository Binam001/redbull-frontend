"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { Icon } from "@iconify/react";
import { navLinks } from "@/constants";
import { useResponsive } from "@/hooks/useMediaQuery";
import AudioProvider from "@/providers/AudioProvider";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState<string>("Home");
  const pathname = usePathname();

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    setIsDarkTheme(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDarkTheme(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const { isSmallerDevice } = useResponsive();
  const { scrollY } = useScroll();
  const isExclusivePage = pathname.startsWith("/exclusive");
  const isExclusive =
    [
      "/about",
      "/contact",
      "/cart",
      "/review",
      "/",
      "/gallery",
      "/wishlist",
    ].includes(pathname) ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/exclusive");

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Reset navbar hidden state when entering /product page to force it to show
  useEffect(() => {
    if (pathname.startsWith("/product")) {
      setHidden(false);
    }
    setIsMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when page transition completes
  useEffect(() => {
    const handleComplete = () => setIsMenuOpen(false);
    window.addEventListener("pageTransitionComplete", handleComplete);
    return () =>
      window.removeEventListener("pageTransitionComplete", handleComplete);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const threshold = 150;

    if (
      !isExclusivePage &&
      latest > previous &&
      latest > threshold &&
      !isMenuOpen
    ) {
      setHidden(true);
    } else {
      setHidden(false);
    }

    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    setScrolled(latest >= vh);
  });

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-120%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full z-210 py-3 px-4 md:px-8 lg:px-16 xl:px-24"
      >
        <div className="w-full flex items-center justify-between">
          {/* 1. Hamburger Menu (Mobile Only - Left) */}
          <div className="order-1 xl:hidden flex justify-start flex-1">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
              className="flex flex-col gap-1.5 z-50 p-2 relative"
            >
              <motion.span
                animate={
                  isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }
                }
                className="block w-6 h-0.5 bg-black transition-colors duration-500"
              />
              <motion.span
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-6 h-0.5 bg-black transition-colors duration-500"
              />
              <motion.span
                animate={
                  isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }
                }
                className="block w-6 h-0.5 bg-black transition-colors duration-500"
              />
            </button>
          </div>

          {/* 2. Logo (Center on Mobile, Left on Desktop) */}
          <div className="flex justify-center xl:justify-start pointer-events-auto order-2 xl:order-1 flex-1 xl:flex-initial">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="relative block w-[24vw] md:w-[10vw] xl:w-[6.6vw] aspect-4/2"
            >
              <Image
                src="/logo.svg"
                alt="Logo"
                fill
                priority
                className="object-contain object-center xl:object-left"
              />
            </Link>
          </div>

          {/* 3. Floating White Pill Nav Links (Center - Desktop Only) */}
          <div className="hidden xl:flex order-2 items-center justify-center mx-auto">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                // boxShadow:
                //   "0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
              }}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {navLinks.map((link) => {
                const isSelected = activeLink === link.name;
                const isHovered = hoveredLink === link.name;
                const isPillVisible = isHovered || (isSelected && !hoveredLink);

                return (
                  <button
                    type="button"
                    key={link.name}
                    onClick={() => setActiveLink(link.name)}
                    className="relative flex items-center gap-1.5 px-5 py-1 rounded-full text-[13px] font-semibold tracking-wide transition-colors duration-300 cursor-pointer"
                    style={{
                      color:
                        isSelected
                          ? "#CB2026"
                          : isHovered
                          ? "#CB2026"
                          : "rgba(0, 0, 0, 0.65)",
                    }}
                    onMouseEnter={() => setHoveredLink(link.name)}
                  >
                    {/* Animated hover/active background pill */}
                    {isPillVisible && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: isSelected
                            ? "rgba(203, 32, 38, 0.14)"
                            : "rgba(203, 32, 38, 0.06)",
                        }}
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    <span className="relative z-10">{link.name}</span>

                    {/* Dropdown chevron */}
                    {link.hasDropdown && (
                      <Icon
                        icon="mdi:chevron-down"
                        className={`relative z-10 w-4 h-4 transition-colors duration-300 ${
                          isSelected || isHovered
                            ? "text-[#CB2026]"
                            : "text-black/60"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Right Controls: Audio Icon */}
          <div className="order-3 flex items-center justify-end gap-4 md:gap-6 xl:gap-[1.5vw] flex-1 xl:flex-initial">
            <AudioProvider
              isScrolled={scrolled}
              className="relative flex items-center"
            />
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-200 flex flex-col items-center justify-center p-8 xl:hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(245,247,250,0.96) 100%)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="w-full text-center"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActiveLink(link.name);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center justify-center gap-2 text-xl font-semibold py-2 transition-colors w-fit mx-auto cursor-pointer ${
                      activeLink === link.name
                        ? "text-[#CB2026]"
                        : "text-black/50 hover:text-black"
                    }`}
                  >
                    {link.name}
                    {link.hasDropdown && (
                      <Icon
                        icon="mdi:chevron-down"
                        className={`w-5 h-5 ${
                          activeLink === link.name
                            ? "text-[#CB2026]"
                            : "text-black/50"
                        }`}
                      />
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
