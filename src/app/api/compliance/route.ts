import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { contractTitle, contractDescription, solicitationNumber } = await req.json();
    if (!contractTitle) return NextResponse.json({ error: 'Missing contract data' }, { status: 400 });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `You are a federal contracting compliance expert. Extract compliance requirements from this contract.

Contract: ${contractTitle}
Solicitation #: ${solicitationNumber || 'N/A'}
Description: ${contractDescription?.slice(0, 2000) || 'Not provided'}

Return ONLY valid JSON:
{
  "pageLimit": "page limit if mentioned, or null",
  "fontRequirements": "font/margin requirements if mentioned, or null",
  "requiredCertifications": ["list of required certifications"],
  "requiredRegistrations": ["SAM.gov registration", "any other required registrations"],
  "bondingInsurance": "bonding/insurance requirements or null",
  "clearanceRequired": "security clearance level required or null",
  "deadlines": ["key deadline 1", "key deadline 2"],
  "submissionFormat": "electronic/paper/both",
  "checklist": ["action item 1", "action item 2", "action item 3", "action item 4", "action item 5"]
}`
      }]
    });

    const text = (message.content[0] as { text: string }).text;
    const clean = text.replace(/```json|```/g, '').trim();
    return NextResponse.json(JSON.parse(clean));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to generate checklist', detail: msg }, { status: 500 });
  }
}
