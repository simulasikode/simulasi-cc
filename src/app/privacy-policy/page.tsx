"use client";
import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-2xl p-16 ext-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        Your privacy is important to us. This Privacy Policy explains how we
        collect, use, disclose, and safeguard your information when you visit
        our website.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        1. Information We Collect
      </h2>
      <p className="mb-4">
        We may collect personal information that you provide directly to us,
        such as your name, email address, and any other details you submit
        through our forms.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        2. How We Use Your Information
      </h2>
      <p className="mb-4">
        We use the information we collect to operate and improve our website,
        respond to inquiries, and send occasional updates if you opt in.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Data Security</h2>
      <p className="mb-4">
        We take appropriate security measures to protect your personal
        information from unauthorized access, alteration, or destruction.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        4. Third-Party Services
      </h2>
      <p className="mb-4">
        We may use third-party services to enhance user experience. These
        services may collect anonymous usage data as per their respective
        privacy policies.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        5. Changes to This Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. We encourage you to
        review it periodically for any changes.
      </p>

      <p className="mt-6">
        If you have any questions about this Privacy Policy, please contact us.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
