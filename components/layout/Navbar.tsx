"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
  const isLightPage =
    pathname.startsWith("/contact") ||
    pathname.startsWith("/energy-drinks") ||
    pathname.startsWith("/about");
  const isScrolledOrLight = scrolled || isLightPage;

  useEffect(() => {
    const matched = navLinks.find(
      (link) =>
        (link.href !== "/" && pathname.startsWith(link.href)) ||
        link.dropdownItems?.some((sub) => pathname.startsWith(sub.href))
    );
    if (matched) {
      setActiveLink(matched.name);
    } else if (pathname === "/") {
      setActiveLink("Home");
    }
  }, [pathname]);

  const isExclusive =
    [
      "/about",
      "/contact",
      "/events",
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

  // Reset navbar hidden state when entering /product or /energy-drinks page to force it to show
  useEffect(() => {
    if (
      pathname.startsWith("/product") ||
      pathname.startsWith("/energy-drinks")
    ) {
      setHidden(false);
    }
    setActiveDropdown(null);
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
        className={`fixed top-0 left-0 w-full z-210 px-4 md:px-8 lg:px-16 xl:px-24 transition-all duration-300 ${scrolled
          ? "py-3 bg-white"
          : pathname.startsWith("/contact")
            ? "py-4 bg-white"
            : "py-4 bg-transparent"
          }`}
      >
        <div className="w-full flex items-center justify-between">
          {/* Logo (Always on Left) */}
          <div className="flex items-center">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="relative block w-24 sm:w-28 md:w-32 xl:w-36 aspect-4/2"
            >
              <Image
                src="/logo.svg"
                alt="Red Bull Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </Link>
          </div>

          {/* Right Section: Desktop Links + Audio Icon (+ Mobile Hamburger) */}
          <div className="flex items-center gap-5 sm:gap-6 xl:gap-8">
            {/* Desktop Navigation Links (No background, sitting on right) */}
            <nav
              className="hidden xl:flex items-center gap-6 xl:gap-8"
              onMouseLeave={() => {
                setHoveredLink(null);
                dropdownTimeoutRef.current = setTimeout(() => {
                  setActiveDropdown(null);
                }, 180);
              }}
            >
              {navLinks.map((link) => {
                const isSelected = activeLink === link.name;
                const isHovered = hoveredLink === link.name;
                const isDropdownOpen = activeDropdown === link.name;
                const showUnderline = hoveredLink ? isHovered : isSelected;

                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => {
                      if (dropdownTimeoutRef.current) {
                        clearTimeout(dropdownTimeoutRef.current);
                        dropdownTimeoutRef.current = null;
                      }
                      setHoveredLink(link.name);
                      if (link.hasDropdown) {
                        setActiveDropdown(link.name);
                      } else {
                        setActiveDropdown(null);
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredLink(null);
                      dropdownTimeoutRef.current = setTimeout(() => {
                        setActiveDropdown(null);
                      }, 180);
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        if (link.href === "#") {
                          e.preventDefault();
                          return;
                        }
                        setActiveLink(link.name);
                        setActiveDropdown(null);
                      }}
                      className={`relative flex items-center gap-1.5 text-[13.5px] font-semibold tracking-wide transition-colors duration-200 cursor-pointer py-1 ${isSelected || isDropdownOpen
                        ? "text-[#CB2026]"
                        : isHovered
                          ? "text-[#CB2026]"
                          : isScrolledOrLight
                            ? "text-black/75 hover:text-black"
                            : "text-white/85 hover:text-white"
                        }`}
                    >
                      <span className="relative">
                        {link.name}

                        {/* Interactive Animated Underline */}
                        <span
                          className={`absolute -bottom-1 left-0 h-[2px] bg-[#CB2026] rounded-full transition-all duration-300 ease-out ${showUnderline || isDropdownOpen
                            ? "w-full opacity-100"
                            : "w-0 opacity-0"
                            }`}
                        />
                      </span>

                      {/* Dropdown chevron */}
                      {link.hasDropdown && (
                        <Icon
                          icon="mdi:chevron-down"
                          className={`w-4 h-4 transition-all duration-200 ${isDropdownOpen || isHovered ? "rotate-180" : ""
                            } ${isSelected || isHovered || isDropdownOpen
                              ? "text-[#CB2026]"
                              : isScrolledOrLight
                                ? "text-black/60"
                                : "text-white/60"
                            }`}
                        />
                      )}
                    </Link>

                    {/* Desktop Dropdown Popover */}
                    <AnimatePresence>
                      {link.hasDropdown && isDropdownOpen && link.dropdownItems && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          onMouseEnter={() => {
                            if (dropdownTimeoutRef.current) {
                              clearTimeout(dropdownTimeoutRef.current);
                              dropdownTimeoutRef.current = null;
                            }
                          }}
                          onMouseLeave={() => {
                            setHoveredLink(null);
                            dropdownTimeoutRef.current = setTimeout(() => {
                              setActiveDropdown(null);
                            }, 180);
                          }}
                          className="absolute top-full left-0 pt-2 z-50 pointer-events-auto min-w-max"
                        >
                          <div className="bg-white rounded-2xl px-6 py-4 shadow-[0_12px_32px_rgba(0,0,0,0.12)] flex flex-col gap-3 min-w-max">
                            {link.dropdownItems.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                onClick={() => {
                                  setActiveLink(link.name);
                                  setActiveDropdown(null);
                                }}
                                className="text-[14.5px] font-medium text-neutral-800 hover:text-[#CB2026] transition-colors duration-200 cursor-pointer whitespace-nowrap"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Sound Icon (Sits at the end of links on the right) */}
            <AudioProvider
              isScrolled={isScrolledOrLight}
              className="relative flex items-center"
            />

            {/* Mobile Hamburger Toggle (Mobile Only - Right end) */}
            <div className="xl:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle Menu"
                className="flex flex-col gap-1.5 z-50 p-2 relative cursor-pointer"
              >
                <motion.span
                  animate={
                    isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }
                  }
                  className={`block w-6 h-0.5 transition-colors duration-300 ${isMenuOpen || isScrolledOrLight ? "bg-black" : "bg-white"
                    }`}
                />
                <motion.span
                  animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className={`block w-6 h-0.5 transition-colors duration-300 ${isMenuOpen || isScrolledOrLight ? "bg-black" : "bg-white"
                    }`}
                />
                <motion.span
                  animate={
                    isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }
                  }
                  className={`block w-6 h-0.5 transition-colors duration-300 ${isMenuOpen || isScrolledOrLight ? "bg-black" : "bg-white"
                    }`}
                />
              </button>
            </div>
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
                  {link.hasDropdown ? (
                    <div className="w-full">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileDropdownOpen((prev) => !prev)
                        }
                        className={`flex items-center justify-center gap-2 text-xl font-semibold py-2 transition-colors w-fit mx-auto cursor-pointer ${activeLink === link.name
                          ? "text-[#CB2026]"
                          : "text-black/60 hover:text-black"
                          }`}
                      >
                        {link.name}
                        <Icon
                          icon="mdi:chevron-down"
                          className={`w-5 h-5 transition-transform duration-200 ${mobileDropdownOpen
                            ? "rotate-180 text-[#CB2026]"
                            : "text-black/40"
                            }`}
                        />
                      </button>

                      <AnimatePresence>
                        {mobileDropdownOpen && link.dropdownItems && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col items-center gap-2.5 mt-2 mb-2 overflow-hidden bg-white rounded-2xl px-6 py-3.5 shadow-md w-full max-w-xs"
                          >
                            {link.dropdownItems.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                onClick={() => {
                                  setActiveLink(link.name);
                                  setIsMenuOpen(false);
                                }}
                                className="text-sm font-medium text-neutral-800 hover:text-[#CB2026] py-1 transition-colors"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => {
                        setActiveLink(link.name);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center justify-center gap-2 text-xl font-semibold py-2 transition-colors w-fit mx-auto cursor-pointer ${activeLink === link.name
                        ? "text-[#CB2026]"
                        : "text-black/50 hover:text-black"
                        }`}
                    >
                      {link.name}
                    </Link>
                  )}
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
