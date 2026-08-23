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
import Button from "../shared/Button";
import AudioProvider from "@/providers/AudioProvider";
// import { useCart } from "@/providers/CartProvider";

const Navbar = () => {
  // const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
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
  const whiteThemePaths = ["/cart", "/contact"];
  const useWhiteTheme =
    scrolled ||
    whiteThemePaths.includes(pathname) ||
    pathname.startsWith("/products/") ||
    isMenuOpen;

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
    setScrolled(latest > 20);
  });

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 left-0 w-full z-210 py-2 px-4 md:px-8 lg:px-16 xl:px-24 transition-colors duration-500 ${
          scrolled || isMenuOpen
            ? // ? isExclusivePage || isExclusive
              "bg-background"
            : // : "bg-background"
              "bg-transparent"
        }`}
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
                className={`block w-6 h-0.5 transition-colors duration-500 ${
                  isDarkTheme || isExclusivePage || isExclusive
                    ? "bg-foreground"
                    : "bg-black"
                }`}
              />
              <motion.span
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className={`block w-6 h-0.5 transition-colors duration-500 ${
                  isDarkTheme || isExclusivePage || isExclusive
                    ? "bg-foreground"
                    : "bg-black"
                }`}
              />
              <motion.span
                animate={
                  isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }
                }
                className={`block w-6 h-0.5 transition-colors duration-500 ${
                  isDarkTheme || isExclusivePage || isExclusive
                    ? "bg-foreground"
                    : "bg-black"
                }`}
              />
            </button>
          </div>

          {/* 2. Logo (Center on Mobile, Left on Desktop) */}
          <div className="flex justify-center xl:justify-start pointer-events-auto order-2 xl:order-1 flex-1 xl:flex-initial">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="relative block w-[24vw] md:w-[10vw] xl:w-[6vw] aspect-4/2"
            >
              <Image
                src={
                  isDarkTheme || isExclusivePage || isExclusive
                    ? "/logo.svg"
                    : "/logo.svg"
                }
                alt="Logo"
                fill
                priority
                className="object-contain object-center xl:object-left"
              />
            </Link>
          </div>

          {/* 3. Nav Links (Center - Desktop Only) */}
          <div
            className="hidden xl:flex order-2 items-center justify-center gap-12 xl:gap-[3vw] px-4 mx-auto"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isHovered = hoveredLink === link.name;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group relative text-[0.9vw] tracking-wider transition-colors duration-500 py-1 ${
                    isDarkTheme || isExclusivePage || isExclusive
                      ? "text-foreground"
                      : useWhiteTheme
                        ? "text-foreground"
                        : "text-black"
                  }`}
                  onMouseEnter={() => setHoveredLink(link.name)}
                >
                  <span className="relative z-10">{link.name}</span>

                  {/* Animated Underline */}
                  {(isHovered || (isActive && !hoveredLink)) && (
                    <motion.div
                      layoutId="nav-underline"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                        isDarkTheme || isExclusivePage || isExclusive
                          ? "bg-foreground"
                          : useWhiteTheme
                            ? "bg-foreground"
                            : "bg-black"
                      }`}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* 4. Right Controls: Shopping Cart & Audio Icon (Right) */}
          <div className="order-3 flex items-center justify-end gap-4 md:gap-6 xl:gap-[1.5vw] flex-1 xl:flex-initial">
            {/* Shopping Bag / Cart Link */}
            {/* <Link
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className={`relative flex items-center justify-center transition-colors duration-500 cursor-pointer ${
                isDarkTheme || isExclusivePage || isExclusive
                  ? "text-foreground"
                  : "text-black"
              }`}
              aria-label="Shopping Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 xl:size-[1.5vw]"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <g fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" d="M8 12V8a4 4 0 1 1 8 0v4" />
                  <path d="M3.694 12.668c.145-1.741.218-2.611.792-3.14S5.934 9 7.681 9h8.639c1.746 0 2.62 0 3.194.528s.647 1.399.792 3.14l.514 6.166c.084 1.013.126 1.52-.17 1.843c-.298.323-.806.323-1.824.323H5.174c-1.017 0-1.526 0-1.823-.323s-.255-.83-.17-1.843z" />
                </g>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 size-4 xl:size-[0.9vw] rounded-full bg-black text-white text-[10px] xl:text-[0.7vw] font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link> */}
            <AudioProvider
              imgClassName={
                isDarkTheme || isExclusivePage || isExclusive
                  ? "text-foreground"
                  : useWhiteTheme || scrolled
                    ? "text-foreground"
                    : "text-black"
              }
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
            className="fixed inset-0 z-200 bg-background flex flex-col items-center justify-center p-8 xl:hidden"
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
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block text-xl uppercase py-2 transition-colors w-fit mx-auto ${
                      pathname === link.href
                        ? "text-foreground"
                        : "text-foreground/50"
                    }`}
                  >
                    {link.name}
                  </Link>
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
