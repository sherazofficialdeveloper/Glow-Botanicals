// app/(shop)/contact/page.jsx
'use client';

import { ContactSection } from '@/components/sections/ContactSection';
import { Container } from '@/components/common/Container';

export default function ContactPage() {
  return (
    <Container className="py-8 sm:py-12">
      <ContactSection />
    </Container>
  );
}