import React from 'react';

import { FAQ_HEADER } from './constants';

interface FaqHeaderProps {
  heading?: string;
  intro?: string;
  className?: string;
}

export const FaqHeader = ({
  heading = FAQ_HEADER.heading,
  intro = FAQ_HEADER.intro,
  className = '',
}: FaqHeaderProps) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 xl:gap-20 items-start pb-4 ${className}`}>
      {/* ── Left Column: Editorial Heading ── */}
      <div className="lg:col-span-7 xl:col-span-7">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-primary text-secondary">
          {heading}
        </h2>
      </div>

      {/* ── Right Column: Descriptive Intro Paragraph ── */}
      <div className="lg:col-span-5 xl:col-span-5">
        <p className="text-base sm:text-lg text-zinc-500 leading-relaxed">
          {intro}
        </p>
      </div>
    </div>
  );
};

export default FaqHeader;
