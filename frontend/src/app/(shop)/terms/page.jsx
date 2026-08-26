// app/(shop)/terms/page.jsx
'use client';

import { Container } from '@/components/common/Container';
import { SectionHeader } from '@/components/common/SectionHeader';

export default function TermsPage() {
  return (
    <Container className="py-8 sm:py-12 max-w-3xl">
      <SectionHeader
        title="Terms of Service"
        subtitle="Terms and conditions for using our services"
        align="center"
      />

      <div className="prose prose-lg max-w-none prose-rose mt-8">
        <p className="text-gray-600 leading-relaxed">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By using Glowly Botanical's website and services, you agree to these terms of service. 
          If you do not agree, please do not use our services.
        </p>

        <h2>2. Account Registration</h2>
        <p>
          You must be at least 18 years old to create an account. You are responsible for 
          maintaining the confidentiality of your account credentials.
        </p>

        <h2>3. Orders and Payments</h2>
        <p>
          All orders are subject to acceptance and availability. We reserve the right to 
          refuse or cancel any order at our discretion.
        </p>
        <ul>
          <li>Prices are subject to change without notice</li>
          <li>Payment must be received in full before order processing</li>
          <li>We accept various payment methods as indicated on our website</li>
        </ul>

        <h2>4. Shipping and Delivery</h2>
        <p>
          We strive to deliver orders in a timely manner. Shipping times are estimates and 
          not guaranteed. We are not responsible for delays caused by carriers.
        </p>

        <h2>5. Returns and Refunds</h2>
        <p>
          We stand by our 30-Day Glow Guarantee. If you're not satisfied with your purchase, 
          please contact us for a return or exchange.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          All content on this website, including text, images, and logos, is the property of 
          Glowly Botanical and protected by copyright laws.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          Glowly Botanical is not liable for any indirect, incidental, or consequential 
          damages arising from the use of our products or services.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          Questions about these terms? Contact us at:
          <br />
          <strong>Email:</strong> legal@glowlybotanical.com
        </p>
      </div>
    </Container>
  );
}