// app/(shop)/privacy-policy/page.jsx
'use client';

import { Container } from '@/components/common/Container';
import { SectionHeader } from '@/components/common/SectionHeader';

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-8 sm:py-12 max-w-3xl">
      <SectionHeader
        title="Privacy Policy"
        subtitle="How we handle your data"
        align="center"
      />

      <div className="prose prose-lg max-w-none prose-rose mt-8">
        <p className="text-gray-600 leading-relaxed">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account, 
          place an order, or contact us for support. This may include:
        </p>
        <ul>
          <li>Name and contact information</li>
          <li>Payment information</li>
          <li>Order history</li>
          <li>Communications with us</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Process your orders and payments</li>
          <li>Provide customer support</li>
          <li>Send order updates and promotional offers</li>
          <li>Improve our products and services</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. 
          We may share information with service providers who assist us in operating our website 
          and conducting our business.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your 
          personal information against unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
        </ul>

        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
          <br />
          <strong>Email:</strong> privacy@glowlybotanical.com
        </p>
      </div>
    </Container>
  );
}