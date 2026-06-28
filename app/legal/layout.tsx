"use client";

import { useState } from "react";
import { Navbar } from "@/components/sections/navbar";
import { ContactModal } from "@/components/sections/contact-modal";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Navbar onContactClick={() => setContactOpen(true)} />
      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">{children}</main>
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
