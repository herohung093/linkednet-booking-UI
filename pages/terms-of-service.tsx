import React from 'react';

function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-indigo max-w-none">
        <p className="text-lg mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using LinkedNet's services, you agree to be bound by these Terms of Service
            and all applicable laws and regulations. If you do not agree with any of these terms, you
            are prohibited from using or accessing our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily access and use LinkedNet's services for personal,
            non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>
          <p className="mb-4">Under this license, you may not:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software</li>
            <li>Remove any copyright or proprietary notations</li>
            <li>Transfer the materials to another person</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Service Description</h2>
          <p className="mb-4">
            LinkedNet provides an online booking and business management platform for salon owners.
            We reserve the right to modify, suspend, or discontinue any part of the service at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
          <p className="mb-4">
            You agree to pay all fees associated with your use of LinkedNet's services. All fees are
            non-refundable unless otherwise specified. We reserve the right to change our fees upon
            notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. User Obligations</h2>
          <p className="mb-4">As a user of LinkedNet, you agree to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide accurate information</li>
            <li>Maintain the security of your account</li>
            <li>Comply with all applicable laws</li>
            <li>Not interfere with the service's operation</li>
            <li>Not use the service for unauthorized purposes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p className="mb-4">
            LinkedNet shall not be liable for any indirect, incidental, special, consequential, or
            punitive damages resulting from your use or inability to use the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
          <p className="mb-4">
            Questions about the Terms of Service should be sent to:
            <br />
            Email: hung.vm2574@gmail.com
            <br />
            Address: 33 Nanovich Ave, Girrawheen WA
          </p>
        </section>
      </div>
    </div>
  );
}

export default TermsOfService;
