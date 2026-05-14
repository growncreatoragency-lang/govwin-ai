import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | GovWin AI',
  description: 'Terms and Conditions for GovWin AI — federal contracting intelligence platform.',
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f5f5f5', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 32px 96px' }}>

        {/* Back link */}
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#525252', textDecoration: 'none', marginBottom: 48, transition: 'color 0.15s' }}
        >
          ← Back to GovWin AI
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#3a3a3a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
            Legal
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#f5f5f5', letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 16 }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.7 }}>
            Effective date: May 14, 2026. Last updated: May 14, 2026.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

          {/* Intro */}
          <Section>
            <p style={bodyStyle}>
              These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of GovWin AI (the &quot;Service&quot;), operated by GovWin AI, LLC (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By creating an account or using the Service in any way, you agree to be bound by these Terms in full. If you do not agree, do not use the Service.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              <strong style={{ color: '#f5f5f5' }}>IMPORTANT NOTICE:</strong> These Terms contain a binding arbitration clause and class action waiver in Section 14. By accepting these Terms, you agree that disputes will be resolved by individual binding arbitration and you waive your right to a jury trial and to participate in a class action. Please read Section 14 carefully.
            </p>
          </Section>

          {/* 1. Eligibility */}
          <Section title="1. Eligibility">
            <p style={bodyStyle}>
              You must be at least 18 years of age and a resident or registered business entity in the United States to use the Service. By using the Service, you represent and warrant that:
            </p>
            <ul style={listStyle}>
              <li>You are at least 18 years old;</li>
              <li>You are a US-based individual, sole proprietor, LLC, corporation, partnership, or other recognized business entity;</li>
              <li>You have the legal authority to enter into these Terms on behalf of yourself or your organization;</li>
              <li>Your use of the Service will not violate any applicable law or regulation.</li>
            </ul>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              We reserve the right to suspend or terminate accounts that we determine, in our sole discretion, are operated by ineligible users.
            </p>
          </Section>

          {/* 2. Description of Service */}
          <Section title="2. Description of Service">
            <p style={bodyStyle}>
              GovWin AI is a software-as-a-service (SaaS) platform that aggregates federal contracting opportunity data, provides AI-powered analysis and summarization of that data, and assists users in drafting proposals for government contracts. The Service is intended to serve as an informational and productivity tool only.
            </p>
          </Section>

          {/* 3. Not Legal, Financial, or Contracting Advice */}
          <Section title="3. No Legal, Financial, or Contracting Advice">
            <p style={bodyStyle}>
              <strong style={{ color: '#f5f5f5' }}>The Service does not constitute legal, financial, procurement, or contracting advice.</strong> Nothing on the platform — including AI-generated summaries, proposal drafts, eligibility assessments, or search results — should be construed as professional advice of any kind.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              You should always consult with qualified legal counsel, certified procurement professionals, and/or financial advisors before submitting any government contract proposal, making business decisions based on contracting data, or relying on any information provided by the Service.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              GovWin AI is not a licensed law firm, accounting firm, or government contracting consultant, and no attorney-client, accountant-client, or consultant-client relationship is formed by your use of the Service.
            </p>
          </Section>

          {/* 4. AI-Generated Content Disclaimer */}
          <Section title="4. AI-Generated Content Disclaimer">
            <p style={bodyStyle}>
              Portions of the Service use artificial intelligence and large language models to generate summaries, analyses, proposal drafts, and other content (&quot;AI Content&quot;). You acknowledge and agree that:
            </p>
            <ul style={listStyle}>
              <li>AI Content may be inaccurate, incomplete, outdated, biased, or otherwise unreliable;</li>
              <li>AI Content is generated algorithmically and has not been reviewed or verified by a licensed professional;</li>
              <li>AI Content does not reflect the official position of any government agency;</li>
              <li>You are solely responsible for reviewing, verifying, and taking responsibility for any content you submit to a government agency, even if drafted with AI assistance;</li>
              <li>We make no representation that proposals generated by or with the Service will be compliant with applicable procurement regulations, including but not limited to the Federal Acquisition Regulation (FAR) or agency-specific supplements.</li>
            </ul>
          </Section>

          {/* 5. SAM.gov Data Disclaimer */}
          <Section title="5. SAM.gov and Third-Party Data Disclaimer">
            <p style={bodyStyle}>
              The Service aggregates and displays contracting opportunity data sourced from SAM.gov and other publicly available government databases. You acknowledge and agree that:
            </p>
            <ul style={listStyle}>
              <li>SAM.gov data is owned and controlled by the US federal government and its agencies, not by GovWin AI;</li>
              <li>We do not guarantee the accuracy, completeness, currency, or reliability of any data sourced from SAM.gov or other third-party sources;</li>
              <li>Contract opportunities displayed on the Service may be modified, cancelled, extended, or removed by the issuing agency at any time without notice to us;</li>
              <li>You are solely responsible for verifying all opportunity details directly on SAM.gov or with the issuing agency before taking any action;</li>
              <li>We are not affiliated with, endorsed by, or sponsored by the US General Services Administration (GSA) or any other government agency.</li>
            </ul>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              <strong style={{ color: '#f5f5f5' }}>No Guarantee of Results.</strong> We make no guarantee, warranty, or representation that using the Service will result in winning any government contract, receiving any award, or achieving any business outcome. Past performance of other users is not indicative of future results.
            </p>
          </Section>

          {/* 6. Subscription Terms */}
          <Section title="6. Subscription, Billing, and Auto-Renewal">
            <p style={bodyStyle}>
              Access to the Service is provided on a subscription basis. By subscribing, you agree to the following:
            </p>
            <ul style={listStyle}>
              <li><strong style={{ color: '#d4d4d4' }}>Free Trial:</strong> If a free trial is offered, it will convert to a paid subscription automatically at the end of the trial period unless you cancel before the trial ends.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Auto-Renewal:</strong> Your subscription will automatically renew at the end of each billing period (monthly or annual) at the then-current subscription rate unless you cancel at least 24 hours before the renewal date.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Pricing:</strong> Current pricing is displayed on our pricing page. We reserve the right to change subscription fees upon at least 30 days&apos; notice to you.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Payment:</strong> You authorize us to charge your designated payment method for all applicable fees. If payment fails, we may suspend or terminate your access to the Service.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Cancellation:</strong> You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of the current billing period; no partial refunds are issued for unused time unless required by law.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Refunds:</strong> All fees are non-refundable except where required by applicable law or as expressly stated in our refund policy.</li>
            </ul>
          </Section>

          {/* 7. Acceptable Use */}
          <Section title="7. Acceptable Use">
            <p style={bodyStyle}>
              You agree not to use the Service to:
            </p>
            <ul style={listStyle}>
              <li>Violate any applicable federal, state, local, or international law or regulation;</li>
              <li>Submit false, misleading, or fraudulent proposals to any government agency;</li>
              <li>Scrape, crawl, or systematically extract data from the Service using automated means;</li>
              <li>Reverse engineer, decompile, or attempt to extract the source code of the Service;</li>
              <li>Resell, sublicense, or otherwise commercialize access to the Service without our written consent;</li>
              <li>Use the Service in any manner that could damage, disable, or impair the Service or servers or networks connected to the Service;</li>
              <li>Upload or transmit viruses or any other malicious code;</li>
              <li>Attempt to gain unauthorized access to any part of the Service or its related systems.</li>
            </ul>
          </Section>

          {/* 8. Intellectual Property */}
          <Section title="8. Intellectual Property">
            <p style={bodyStyle}>
              The Service, including all software, design, text, graphics, and other content created by GovWin AI, is owned by the Company and protected by applicable intellectual property laws. You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Service solely for your internal business purposes in accordance with these Terms.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              You retain ownership of any data, content, or materials you upload to the Service (&quot;User Content&quot;). By uploading User Content, you grant us a limited license to process and use that content solely to provide the Service to you.
            </p>
          </Section>

          {/* 9. Indemnification */}
          <Section title="9. Indemnification">
            <p style={bodyStyle}>
              You agree to defend, indemnify, and hold harmless GovWin AI, LLC and its officers, directors, employees, contractors, agents, licensors, and suppliers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising out of or relating to:
            </p>
            <ul style={listStyle}>
              <li>Your use of or access to the Service;</li>
              <li>Your violation of these Terms;</li>
              <li>Your violation of any rights of a third party, including any intellectual property or privacy rights;</li>
              <li>Any government contract proposal you submit, whether drafted with assistance of the Service or not;</li>
              <li>Any User Content you upload or transmit through the Service;</li>
              <li>Your violation of any applicable law or regulation.</li>
            </ul>
          </Section>

          {/* 10. Disclaimer of Warranties */}
          <Section title="10. Disclaimer of Warranties">
            <p style={bodyStyle}>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              WE DO NOT WARRANT THAT: (A) THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; (B) ANY RESULTS OBTAINED FROM USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE; (C) ANY ERRORS IN THE SERVICE WILL BE CORRECTED; OR (D) THE SERVICE WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS.
            </p>
          </Section>

          {/* 11. Limitation of Liability */}
          <Section title="11. Limitation of Liability">
            <p style={bodyStyle}>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL GOVWIN AI, LLC, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, LICENSORS, OR SERVICE PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES — INCLUDING BUT NOT LIMITED TO LOST PROFITS, LOST DATA, LOSS OF GOODWILL, BUSINESS INTERRUPTION, OR COST OF SUBSTITUTE SERVICES — ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              IN NO EVENT WILL OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS EXCEED THE GREATER OF: (A) THE TOTAL FEES ACTUALLY PAID BY YOU TO US IN THE THREE (3) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM; OR (B) ONE HUNDRED DOLLARS ($100.00 USD).
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              THE FOREGOING LIMITATIONS APPLY REGARDLESS OF THE THEORY OF LIABILITY, WHETHER BASED IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR OTHERWISE, EVEN IF THE EXCLUSIVE REMEDY FAILS OF ITS ESSENTIAL PURPOSE.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES, SO THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU IN FULL. IN SUCH JURISDICTIONS, OUR LIABILITY IS LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.
            </p>
          </Section>

          {/* 12. Governing Law */}
          <Section title="12. Governing Law">
            <p style={bodyStyle}>
              These Terms and any dispute or claim arising out of or related to them, their subject matter, or their formation (including non-contractual disputes or claims) shall be governed by and construed in accordance with the laws of the State of Delaware, United States of America, without giving effect to any conflict of law principles.
            </p>
          </Section>

          {/* 13. Dispute Resolution & Arbitration */}
          <Section title="13. Dispute Resolution and Binding Arbitration">
            <p style={bodyStyle}>
              <strong style={{ color: '#f5f5f5' }}>Please read this section carefully. It affects your legal rights.</strong>
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              <strong style={{ color: '#d4d4d4' }}>Informal Resolution.</strong> Before initiating any formal dispute, you agree to contact us at legal@govwinai.com and provide a written description of the dispute and your desired resolution. We will attempt to resolve the dispute informally within 30 days of receipt.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              <strong style={{ color: '#d4d4d4' }}>Binding Arbitration.</strong> If informal resolution fails, any and all claims, disputes, or controversies arising out of or relating to these Terms or the Service — including questions of arbitrability — shall be resolved by final, binding arbitration administered by the American Arbitration Association (&quot;AAA&quot;) pursuant to its Consumer Arbitration Rules or Commercial Arbitration Rules, as applicable. Arbitration shall take place in Delaware or, at your option, via videoconference. The arbitrator&apos;s decision shall be final and binding and may be entered as a judgment in any court of competent jurisdiction.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              <strong style={{ color: '#d4d4d4' }}>Waiver of Jury Trial.</strong> BY AGREEING TO THESE TERMS, YOU AND GOVWIN AI EACH WAIVE THE RIGHT TO A JURY TRIAL AND THE RIGHT TO LITIGATE DISPUTES IN COURT, EXCEPT AS SET FORTH BELOW.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              <strong style={{ color: '#d4d4d4' }}>Class Action Waiver.</strong> ALL CLAIMS MUST BE BROUGHT IN THE PARTIES&apos; INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON&apos;S CLAIMS AND MAY NOT OTHERWISE PRESIDE OVER ANY FORM OF A CLASS OR REPRESENTATIVE PROCEEDING. IF THIS CLASS ACTION WAIVER IS FOUND UNENFORCEABLE AS TO ANY CLAIM, THAT CLAIM SHALL BE SEVERED FROM ARBITRATION AND LITIGATED IN COURT.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              <strong style={{ color: '#d4d4d4' }}>Exceptions.</strong> Either party may seek emergency injunctive or equitable relief in a court of competent jurisdiction to prevent irreparable harm pending arbitration. Small claims court actions that qualify under applicable rules are also exempt from arbitration.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              <strong style={{ color: '#d4d4d4' }}>Opt-Out.</strong> You may opt out of this arbitration agreement by sending written notice to legal@govwinai.com within 30 days of first creating your account. Your notice must include your name, email, and a statement that you wish to opt out of arbitration. Opting out does not affect any other part of these Terms.
            </p>
          </Section>

          {/* 14. Modifications */}
          <Section title="14. Modifications to Terms">
            <p style={bodyStyle}>
              We reserve the right to modify these Terms at any time. If we make material changes, we will provide notice by updating the effective date at the top of this page and, where required by law or where we deem appropriate, by email. Your continued use of the Service after any modification constitutes your acceptance of the updated Terms. If you do not agree to any modification, you must stop using the Service and cancel your subscription.
            </p>
          </Section>

          {/* 15. Termination */}
          <Section title="15. Termination">
            <p style={bodyStyle}>
              We may suspend or terminate your access to the Service at any time, with or without notice, for any reason, including if we reasonably believe you have violated these Terms. Upon termination, all licenses granted to you under these Terms will immediately cease. Sections 3, 4, 5, 9, 10, 11, 13, and this Section 15 shall survive termination.
            </p>
          </Section>

          {/* 16. Miscellaneous */}
          <Section title="16. Miscellaneous">
            <ul style={listStyle}>
              <li><strong style={{ color: '#d4d4d4' }}>Entire Agreement:</strong> These Terms, together with our Privacy Policy, constitute the entire agreement between you and GovWin AI with respect to the Service.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Severability:</strong> If any provision is found unenforceable, it shall be modified to the minimum extent necessary to make it enforceable, and all other provisions remain in full force.</li>
              <li><strong style={{ color: '#d4d4d4' }}>No Waiver:</strong> Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Assignment:</strong> You may not assign these Terms without our prior written consent. We may assign our rights and obligations under these Terms without restriction.</li>
              <li><strong style={{ color: '#d4d4d4' }}>Force Majeure:</strong> We are not liable for any failure or delay in performance resulting from causes beyond our reasonable control.</li>
            </ul>
          </Section>

          {/* 17. Contact */}
          <Section title="17. Contact Us">
            <p style={bodyStyle}>
              If you have questions about these Terms, please contact us:
            </p>
            <div style={{ marginTop: 16, padding: '20px 24px', background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
              <p style={{ fontSize: 14, color: '#a3a3a3', lineHeight: 1.8, margin: 0 }}>
                GovWin AI, LLC<br />
                Legal Department<br />
                Email: <span style={{ color: '#f5f5f5' }}>legal@govwinai.com</span>
              </p>
            </div>
          </Section>

        </div>

        {/* Footer */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 24, fontSize: 13, color: '#3a3a3a' }}>
          <Link href="/privacy" style={{ color: '#525252', textDecoration: 'none' }}>Privacy Policy</Link>
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

const bodyStyle: React.CSSProperties = {
  fontSize: 14, color: '#a3a3a3', lineHeight: 1.8, margin: 0,
};

const listStyle: React.CSSProperties = {
  fontSize: 14, color: '#a3a3a3', lineHeight: 1.8,
  paddingLeft: 20, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6,
};
