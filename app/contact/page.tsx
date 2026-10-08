import React from "react";
import Contact from "@/components/contact/Contact";

export const metadata = {
  title: "Contact Us | Red Bull",
  description: "Get in touch with the Red Bull team.",
};

const ContactPage = () => {
  return (
    <main className="relative w-full">
      <Contact />
    </main>
  );
};

export default ContactPage;