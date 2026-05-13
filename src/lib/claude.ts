import Anthropic from '@anthropic-ai/sdk';

const getClient = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ContractBreakdown {
  summary: string;
  whoCanApply: string;
  keyRequirements: string[];
  ourTake: string;
}

export interface ProposalDraft {
  executiveSummary: string;
  qualifications: string;
  technicalApproach: string;
  whyUs: string;
}

export async function explainContract(
  contractTitle: string,
  contractDescription: string,
  userProfile: {
    businessName: string;
    location: string;
    services: string;
    certifications: string[];
  }
): Promise<ContractBreakdown> {
  const client = getClient();

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a government contracting expert helping a small business owner understand an opportunity.

Contract Title: ${contractTitle}
Contract Description: ${contractDescription.slice(0, 3000)}

Business Profile:
- Business Name: ${userProfile.businessName}
- Location: ${userProfile.location}
- Services: ${userProfile.services}
- Certifications: ${userProfile.certifications.join(', ') || 'None listed'}

Respond with ONLY a valid JSON object — no markdown fences, no explanation, just raw JSON:
{
  "summary": "2-3 sentences in plain English explaining what this contract is for and what they need done",
  "whoCanApply": "1-2 sentences about eligibility — mention set-asides, size standards, or certifications required",
  "keyRequirements": ["concrete requirement 1", "concrete requirement 2", "concrete requirement 3", "concrete requirement 4"],
  "ourTake": "2-3 sentences giving ${userProfile.businessName} a specific, honest assessment of their chances and what would make their bid competitive"
}`,
      },
    ],
  });

  const text = (message.content[0] as { type: string; text: string }).text.trim();
  // Strip any accidental markdown fences
  const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(clean) as ContractBreakdown;
}

export async function generateProposal(
  contract: {
    title: string;
    agency: string;
    agencyShort: string;
    description: string;
    naics: string;
    setAside: string;
    solicitationNumber: string;
  },
  userProfile: {
    businessName: string;
    location: string;
    services: string;
    certifications: string[];
  }
): Promise<ProposalDraft> {
  const client = getClient();

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Write a competitive government contract proposal for this small business.

Contract Details:
- Title: ${contract.title}
- Agency: ${contract.agency}
- Solicitation #: ${contract.solicitationNumber}
- NAICS Code: ${contract.naics}
- Set-Aside: ${contract.setAside}
- Description: ${contract.description.slice(0, 2000)}

Business Profile:
- Business Name: ${userProfile.businessName}
- Location: ${userProfile.location}
- Services: ${userProfile.services}
- Certifications: ${userProfile.certifications.join(', ') || 'Small Business'}

Write a professional but approachable proposal. Respond with ONLY a valid JSON object — no markdown fences:
{
  "executiveSummary": "2-3 paragraphs. Express interest, summarize qualifications, and state commitment to the agency's mission. Use the business name and be specific to this contract.",
  "qualifications": "2-3 paragraphs with bullet points highlighting: relevant experience, team expertise, past performance, certifications, and local presence benefits.",
  "technicalApproach": "3 phases: Phase 1 (Transition, Days 1-30), Phase 2 (Full Operations, Day 31+), Phase 3 (Reporting & QA). Be specific about deliverables and how performance standards will be met.",
  "whyUs": "3 numbered points explaining the distinct competitive advantages ${userProfile.businessName} brings to ${contract.agencyShort}. Be specific — reference the business location, certifications, and service type."
}`,
      },
    ],
  });

  const text = (message.content[0] as { type: string; text: string }).text.trim();
  const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(clean) as ProposalDraft;
}
