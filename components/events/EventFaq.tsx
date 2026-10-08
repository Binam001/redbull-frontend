"use client";

import React, { useState } from "react";
import { EventData, EventFaq as EventFaqItem, DEFAULT_FAQS } from "@/constants/events";

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
        <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight text-secondary leading-[1.08]">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col gap-2 sm:gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`w-full transition-all duration-300 rounded-2xl ${
                  isOpen
                    ? "bg-[#f8f9fa] p-5 sm:p-6"
                    : "p-4 sm:p-5 hover:bg-neutral-50/80"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none group"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg md:text-xl font-medium text-neutral-900 group-hover:text-primary transition-colors pr-6">
                    {faq.question}
                  </span>
                  <span className="text-2xl sm:text-3xl font-light text-neutral-400 group-hover:text-neutral-700 transition-colors shrink-0 leading-none">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-black/70 leading-relaxed font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
