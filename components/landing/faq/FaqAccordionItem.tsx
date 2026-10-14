'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { FaqItem } from './types';

interface FaqAccordionItemProps {
  faq: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

export const FaqAccordionItem = ({
  faq,
  isOpen,
  onToggle,
}: FaqAccordionItemProps) => {
  return (
    <div className="border-b border-primary/15 first:border-t transition-colors duration-300">
      {/* ── Accordion Trigger Button ── */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full py-6 sm:py-8 flex items-center justify-between text-left group cursor-pointer select-none focus:outline-none"
      >
        <span className="font-primary text-2xl  text-black font-normal pr-6 group-hover:text-primary transition-colors duration-300 leading-snug">
          {faq.question}
        </span>

        <span className="shrink-0 flex items-center justify-center w-8 h-8 text-primary group-hover:text-primary-dark transition-colors duration-300">
          <Icon
            icon="ph:caret-up"
            className={`w-5 h-5 sm:w-6 sm:h-6 transform transition-transform duration-300 ease-out ${isOpen ? 'rotate-0' : 'rotate-180'
              }`}
          />
        </span>
      </button>

      {/* ── Collapsible Answer Content (CSS Grid Smooth Accordion) ── */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
      >
        <div className="overflow-hidden">
          <p className=" text-base sm:text-lg text-zinc-500 leading-relaxed pb-6 sm:pb-8 max-w-6xl">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaqAccordionItem;
