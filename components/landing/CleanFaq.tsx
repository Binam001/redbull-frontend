"use client";
import React, { useState } from "react";
import FaqHeader from "./faq/FaqHeader";
import FaqAccordionItem from "./faq/FaqAccordionItem";
import { FAQ_LIST } from "./faq/constants";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="relative w-full overflow-hidden "
    >
      <div className="py-16">
        {/* ── Section Header: Heading on Left & Narrative Paragraph on Right ── */}
        {/* <FaqHeader /> */}
        <div>
          <h2 className="text-3xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
            The <span className="text-primary">Questions</span> on Your Mind
          </h2>
        </div>

        {/* ── Accordion List ── */}
        <div className="w-full mt-8 sm:mt-14">
          {FAQ_LIST.map((faq, index) => (
            <FaqAccordionItem
              key={faq.id}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
