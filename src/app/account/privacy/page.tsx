'use client';

import { AccountHeader } from '@/components/layout/account-header';

export default function PrivacyPage() {
  return (
    <>
      <AccountHeader title="Privacy Policy" />
      <main className="container mx-auto px-4 pt-4 pb-24 md:pb-8">
        <div className="prose max-w-none">
            <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
            <p>Last updated: July 25, 2024</p>

            <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
            <p>Welcome to E-Moorm E-Commerce. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>

            <h2 className="text-xl font-semibold mt-6 mb-2">2. Information We Collect</h2>
            <p>We may collect personal information such as your name, email address, shipping address, and payment information when you create an account or place an order. We also collect non-personal information, such as browser type and usage data.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-2">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Process your transactions and manage your orders.</li>
                <li>Personalize your experience and offer relevant products.</li>
                <li>Improve our application and customer service.</li>
                <li>Communicate with you about promotions and updates.</li>
            </ul>

             <h2 className="text-xl font-semibold mt-6 mb-2">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at support@e-moorm.com.</p>
        </div>
      </main>
    </>
  );
}
