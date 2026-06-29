"use client";

import { useState } from "react";
import { Navbar } from "@/components/sections/navbar";
import { ContactModal } from "@/components/sections/contact-modal";

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Navbar onContactClick={() => setContactOpen(true)} />
      {children}
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
