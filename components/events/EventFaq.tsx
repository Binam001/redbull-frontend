"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { EventData, EventFaq as EventFaqItem, DEFAULT_FAQS } from "@/constants/events";
import Heading from "../shared/Heading";

interface EventFaqProps {
  event: EventData;
}

export default function EventFaq({ event }: EventFaqProps) {
  const faqs: EventFaqItem[] = event.faqs && event.faqs.length > 0 ? event.faqs : DEFAULT_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full text-neutral-900 font-sans pb-14 sm:pb-20 md:pb-24 px-6 sm:px-10 md:px-16 lg:px-24 bg-white">
      <div className="flex flex-col gap-8 sm:gap-12">
        <Heading
          as="h2"
          text="Frequently Asked Questions"
          highlight="Questions"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.08]"
        />

        {/* ── Accordion List (Matching Home CleanFaq Design) ── */}
        <div className="w-full">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border-b border-primary/15 first:border-t transition-colors duration-300"
              >
                {/* ── Accordion Trigger Button ── */}
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="w-full py-6 sm:py-8 flex items-center justify-between text-left group cursor-pointer select-none focus:outline-none"
                >
                  <span className="font-primary text-xl sm:text-2xl text-black font-normal pr-6 group-hover:text-primary transition-colors duration-300 leading-snug">
                    {faq.question}
                  </span>

                  <span className="shrink-0 flex items-center justify-center w-8 h-8 text-primary group-hover:text-primary/80 transition-colors duration-300">
                    <Icon
                      icon="ph:caret-up"
                      className={`w-5 h-5 sm:w-6 sm:h-6 transform transition-transform duration-300 ease-out ${isOpen ? "rotate-0" : "rotate-180"
                        }`}
                    />
                  </span>
                </button>

                {/* ── Collapsible Answer Content (CSS Grid Smooth Accordion) ── */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-base sm:text-lg text-zinc-500 leading-relaxed pb-6 sm:pb-8 max-w-6xl font-normal">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
