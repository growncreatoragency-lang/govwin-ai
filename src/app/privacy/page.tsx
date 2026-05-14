import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | GovWin AI',
  description: 'Privacy Policy for GovWin AI — how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f5f5f5', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 32px 96px' }}>

        {/* Back link */}
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#525252', textDecoration: 'none', marginBottom: 48 }}
        >
          ← Back to GovWin AI
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#3a3a3a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
            Legal
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 16 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.7 }}>
            Effective date: May 14, 2026. Last updated: May 14, 2026.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

          {/* Intro */}
          <Section>
            <p style={bodyStyle}>
              GovWin AI, LLC (&quot;GovWin AI,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our federal contracting intelligence platform (the &quot;Service&quot;). Please read this policy carefully. If you do not agree with its terms, please do not use the Service.
            </p>
          </Section>

          {/* 1. Information We Collect */}
          <Section title="1. Information We Collect">
            <p style={bodyStyle}>
              We collect the following categories of information:
            </p>

            <SubHeading>1.1 Information You Provide Directly</SubHeading>
            <ul style={listStyle}>
              <li><strong style={{ color: '#d4d4d4' }}>Account information:</strong> email address, password (stored as a one-way hash), and name when you register for an account.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Business profile:</strong> company name, business type, NAICS codes, CAGE code, DUNS/UEI number, state of registration, certifications (e.g., 8(a), HUBZone, SDVOSB, WOSB), and business description that you provide during onboarding or profile setup.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Payment information:</strong> billing address and payment card details. We do not store full card numbers — all payment data is handled directly by Stripe (see Section 4).</li>
              <li><strong style={{ color: '#d4d4d4' }}>Communications:</strong> messages, feedback, or support requests you send to us.</li>
            </ul>

            <SubHeading>1.2 Information Collected Automatically</SubHeading>
            <ul style={listStyle}>
              <li><strong style={{ color: '#d4d4d4' }}>Usage data:</strong> pages visited, features used, search queries entered, contracts viewed, proposals generated, and other interactions with the Service.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Log data:</strong> IP address, browser type and version, operating system, referring URL, and timestamps of requests.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Device information:</strong> device type, screen resolution, and browser settings.</li>
            </ul>

            <SubHeading>1.3 Information from Third Parties</SubHeading>
            <ul style={listStyle}>
              <li><strong style={{ color: '#d4d4d4' }}>SAM.gov and government databases:</strong> publicly available federal contracting opportunity data used to power the Service. This is public data, not personal information.</li>
            </ul>
          </Section>

          {/* 2. How We Use Your Information */}
          <Section title="2. How We Use Your Information">
            <p style={bodyStyle}>
              We use the information we collect for the following purposes:
            </p>
            <ul style={listStyle}>
              <li><strong style={{ color: '#d4d4d4' }}>Providing the Service:</strong> matching your business profile to relevant contracting opportunities, generating AI-powered analyses and proposal drafts, and displaying search results tailored to your business.</li>
              <li><strong style={{ color: '#d4d4d4' }}>AI analysis:</strong> sending relevant portions of your business profile and search inputs to our AI provider (Anthropic) to generate summaries and proposal content. See Section 4 for details.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Billing and payments:</strong> processing subscription fees, managing renewals and cancellations, and preventing fraudulent transactions.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Account management:</strong> authenticating your identity, maintaining your account, and communicating account-related notices.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Service improvement:</strong> analyzing usage patterns to improve features, fix bugs, and enhance the user experience. This analysis is conducted in aggregate and anonymized form where possible.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Communications:</strong> sending transactional emails (e.g., receipt confirmations, password resets), product updates, and, with your consent, marketing communications. You may opt out of marketing emails at any time.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Legal compliance:</strong> complying with applicable laws, regulations, legal processes, or government requests.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Security:</strong> detecting, investigating, and preventing fraudulent transactions, abuse, and other illegal activities.</li>
            </ul>
          </Section>

          {/* 3. Legal Basis */}
          <Section title="3. Legal Basis for Processing">
            <p style={bodyStyle}>
              We process your personal information on the following legal bases:
            </p>
            <ul style={listStyle}>
              <li><strong style={{ color: '#d4d4d4' }}>Contract performance:</strong> processing necessary to provide the Service you subscribed to.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Legitimate interests:</strong> improving the Service, preventing fraud, and ensuring security, where those interests are not overridden by your rights.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Legal obligation:</strong> complying with applicable law.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Consent:</strong> for optional communications and features where we ask for your permission.</li>
            </ul>
          </Section>

          {/* 4. Third-Party Service Providers */}
          <Section title="4. Third-Party Service Providers">
            <p style={bodyStyle}>
              We share your information with the following third-party service providers solely to operate and improve the Service. These providers are bound by contractual data processing agreements and may not use your data for their own purposes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
              {[
                {
                  name: 'Supabase',
                  role: 'Authentication and Database',
                  detail: 'We use Supabase to manage user authentication (login, sessions, password management) and to store your account and business profile data. Your data is stored in Supabase\'s cloud infrastructure. Supabase is SOC 2 Type II compliant.',
                  link: 'https://supabase.com/privacy',
                },
                {
                  name: 'Stripe',
                  role: 'Payment Processing',
                  detail: 'All payment transactions are processed by Stripe, Inc. We do not store your full credit card number or payment card data on our servers. Stripe is PCI DSS Level 1 certified. Your payment information is subject to Stripe\'s Privacy Policy.',
                  link: 'https://stripe.com/privacy',
                },
                {
                  name: 'Anthropic',
                  role: 'AI Content Generation',
                  detail: 'We use Anthropic\'s Claude API to generate AI-powered contract summaries, eligibility analyses, and proposal drafts. Inputs to the AI (including relevant parts of your profile and the contract being analyzed) are transmitted to Anthropic\'s API. Anthropic does not use API inputs to train their models by default, per their API terms. We do not send more personal information to Anthropic than is necessary for the requested analysis.',
                  link: 'https://www.anthropic.com/privacy',
                },
                {
                  name: 'SAM.gov (US Government)',
                  role: 'Contract Opportunity Data',
                  detail: 'Contract data displayed in the Service is sourced from SAM.gov, the official US government procurement database operated by the General Services Administration (GSA). This is publicly available data. Accessing this data does not share your personal information with the government.',
                  link: 'https://sam.gov',
                },
              ].map(provider => (
                <div key={provider.name} style={{
                  padding: '20px 24px', background: '#111111',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#f5f5f5' }}>{provider.name}</span>
                    <span style={{ fontSize: 12, color: '#525252' }}>{provider.role}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#737373', lineHeight: 1.7, margin: 0 }}>{provider.detail}</p>
                  <a
                    href={provider.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, color: '#525252', marginTop: 8, display: 'inline-block' }}
                  >
                    Privacy Policy →
                  </a>
                </div>
              ))}
            </div>

            <p style={{ ...bodyStyle, marginTop: 20 }}>
              We may also share your information with professional advisors (lawyers, accountants), law enforcement, or regulatory authorities where required by law or to protect our rights and the rights of others.
            </p>
          </Section>

          {/* 5. No Sale of Personal Data */}
          <Section title="5. We Do Not Sell Your Personal Data">
            <p style={bodyStyle}>
              We do not sell, rent, or trade your personal information to third parties for their own marketing or commercial purposes. We do not share your data with data brokers. We do not use your personal information for behavioral advertising on third-party platforms.
            </p>
          </Section>

          {/* 6. Cookies */}
          <Section title="6. Cookies and Tracking">
            <p style={bodyStyle}>
              We use a minimal set of cookies and similar technologies to operate the Service:
            </p>
            <ul style={listStyle}>
              <li><strong style={{ color: '#d4d4d4' }}>Session cookies:</strong> strictly necessary cookies used to maintain your authenticated session. These are deleted when you close your browser.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Preference cookies:</strong> used to remember your settings and preferences within the Service.</li>
            </ul>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              We do not use third-party tracking cookies, advertising pixels, or behavioral analytics SDKs. We do not use Google Analytics, Meta Pixel, or similar tracking tools.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              You can configure your browser to refuse cookies, but this may prevent you from using certain features of the Service, including logging in.
            </p>
          </Section>

          {/* 7. Data Retention */}
          <Section title="7. Data Retention">
            <p style={bodyStyle}>
              We retain your personal information for as long as your account is active or as necessary to provide the Service. Specifically:
            </p>
            <ul style={listStyle}>
              <li><strong style={{ color: '#d4d4d4' }}>Account data:</strong> retained for the duration of your account plus 90 days after account deletion to allow for recovery and dispute resolution.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Billing records:</strong> retained for 7 years as required by applicable accounting and tax laws.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Usage logs:</strong> retained for up to 12 months for security and service improvement purposes, then deleted or anonymized.</li>
              <li><strong style={{ color: '#d4d4d4' }}>AI-generated content:</strong> proposals and analyses generated in the Service are stored until you delete them or delete your account.</li>
            </ul>
          </Section>

          {/* 8. Your Rights */}
          <Section title="8. Your Data Rights">
            <p style={bodyStyle}>
              Depending on your jurisdiction, you may have the following rights with respect to your personal information:
            </p>
            <ul style={listStyle}>
              <li><strong style={{ color: '#d4d4d4' }}>Access:</strong> request a copy of the personal information we hold about you.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Correction:</strong> request correction of inaccurate or incomplete data.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Deletion:</strong> request deletion of your account and associated personal data, subject to legal retention obligations.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Portability:</strong> receive a copy of your data in a structured, machine-readable format.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Opt-out of marketing:</strong> unsubscribe from marketing emails at any time using the link in any email or by emailing us.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Withdraw consent:</strong> where processing is based on consent, withdraw your consent at any time without affecting the lawfulness of prior processing.</li>
            </ul>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              To exercise any of these rights, email us at <strong style={{ color: '#f5f5f5' }}>privacy@govwinai.com</strong>. We will respond within 30 days. We may need to verify your identity before processing your request.
            </p>
          </Section>

          {/* 9. Data Security */}
          <Section title="9. Data Security">
            <p style={bodyStyle}>
              We implement reasonable technical and organizational measures to protect your personal information against unauthorized access, loss, destruction, or alteration. These measures include encrypted data transmission (TLS/HTTPS), encrypted storage of sensitive fields, access controls, and regular security reviews.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security. If we become aware of a data breach that affects your rights and freedoms, we will notify you as required by applicable law.
            </p>
          </Section>

          {/* 10. Children */}
          <Section title="10. Children's Privacy">
            <p style={bodyStyle}>
              The Service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we learn that we have collected personal information from a child under 18, we will delete that information promptly. If you believe we have collected such information, please contact us at privacy@govwinai.com.
            </p>
          </Section>

          {/* 11. Changes */}
          <Section title="11. Changes to This Privacy Policy">
            <p style={bodyStyle}>
              We may update this Privacy Policy from time to time. We will notify you of material changes by updating the effective date at the top of this page and, where appropriate, by email. Your continued use of the Service after any change constitutes your acceptance of the updated Privacy Policy.
            </p>
          </Section>

          {/* 12. Contact */}
          <Section title="12. Contact Us">
            <p style={bodyStyle}>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div style={{ marginTop: 16, padding: '20px 24px', background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
              <p style={{ fontSize: 14, color: '#a3a3a3', lineHeight: 1.8, margin: 0 }}>
                GovWin AI, LLC<br />
                Privacy Requests<br />
                Email: <span style={{ color: '#f5f5f5' }}>privacy@govwinai.com</span>
              </p>
            </div>
          </Section>

        </div>

        {/* Footer */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 24, fontSize: 13, color: '#3a3a3a' }}>
          <Link href="/terms" style={{ color: '#525252', textDecoration: 'none' }}>Terms &amp; Conditions</Link>
          <Link href="/" style={{ color: '#525252', textDecoration: 'none' }}>GovWin AI</Link>
        </div>

      </div>
    </div>
  );
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section>
      {title && (
        <h2 style={{
          fontSize: 16, fontWeight: 700, color: '#f5f5f5',
          letterSpacing: '-0.02em', marginBottom: 14,
          paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: 13, fontWeight: 600, color: '#737373', marginTop: 20, marginBottom: 6 }}>
      {children}
    </h3>
  );
}

const bodyStyle: React.CSSProperties = {
  fontSize: 14, color: '#a3a3a3', lineHeight: 1.8, margin: 0,
};

const listStyle: React.CSSProperties = {
  fontSize: 14, color: '#a3a3a3', lineHeight: 1.8,
  paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6,
};
