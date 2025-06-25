import { openai } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import type { CreditReportData } from '@/components/pdf/credit-report-pdf';
import CreditReportPDF from '@/components/pdf/credit-report-pdf';

type AssistantMessage = {
  content?: Array<
    | { type: 'text'; text?: { value: string } }
    | { type: 'code'; text: string; language?: string }
  >;
};

function parseMarkdownToData(markdown: string): CreditReportData {
  const extractTable = (sectionTitle: string): string[][] => {
    const section = markdown.split(sectionTitle)[1]?.split('\n\n')[0] || '';
    const lines = section.split('\n').filter((line) => line.trim().startsWith('|'));

    if (lines.length < 3) return []; // not enough rows for a table

    return lines
      .slice(2) // skip table header and separator
      .map(line => line.split('|').slice(1, -1).map(cell => cell.trim()));
  };

  const extractBullets = (sectionTitle: string): string[] => {
    const section = markdown.split(sectionTitle)[1]?.split('\n\n')[0] || '';
    return section
      .split('\n')
      .filter(line => line.trim().startsWith('- '))
      .map(line => line.replace('- ', '').trim());
  };

  return {
    fullName: markdown.match(/Full Name:\s*(.*)/)?.[1]?.trim() || 'Unknown',
    reportDate: markdown.match(/Report Date:\s*(.*)/)?.[1]?.trim() || 'Unknown',
    scores: extractTable('## Credit Scores') || [],
    summary: extractTable('## Account Summary') || [],
    revolvingAccounts: extractTable('## Open Revolving Accounts') || [],
    revolvingStats: extractTable('## Summary Stats') || [],
    scoreImprovementTips: extractBullets('## Estimated FICO Score Increase') || [],
    alerts: extractBullets('## Flags or Alerts') || [],
    installmentAccounts: extractTable('## Non-Revolving Installment Accounts') || [],
  };
}


export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: NextRequest) {
  const { creditText } = await req.json();

  if (!creditText) {
    return NextResponse.json({ error: 'Missing creditText' }, { status: 400 });
  }

  try {
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `Here is a new credit report:\n\n${creditText}`,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: 'asst_M0u0phtt14WrV0FYOHB3yDqF',
    });

    let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    while (!['completed', 'failed', 'cancelled', 'expired'].includes(runStatus.status)) {
      await new Promise((res) => setTimeout(res, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    }

    if (runStatus.status !== 'completed') {
      throw new Error(`Run failed with status: ${runStatus.status}`);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const textBlocks: string[] = (messages.data as AssistantMessage[]).flatMap((m) =>
      (m.content ?? [])
        .filter(
          (c) =>
            (c.type === 'text' && !!c.text?.value) ||
            (c.type === 'code' && ['html', 'markdown'].includes(c.language || '') && !!c.text)
        )
        .map((c) => (c.type === 'text' ? c.text!.value : c.text))
    );

   const html =
  textBlocks.find(
    (t) =>
      t.includes('<html>') ||
      t.includes('<table') ||
      t.includes('<p') ||
      t.includes('<img')
  ) || '';

const markdown =
  textBlocks.find(
    (t) =>
      t.trim().startsWith('#') ||
      t.includes('**Client Information') ||
      t.includes('```') ||
      t.includes('| Bureau |')
  ) || '';


    if (!html || !markdown) {
      return NextResponse.json({ error: 'Expected outputs not found in assistant response' }, { status: 500 });
    }

    const structuredData = parseMarkdownToData(markdown);
    const pdfBuffer = await renderToBuffer(<CreditReportPDF data={structuredData} />);

    const filename = `${Date.now()}_CreditBanc_Report.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reports')
      .upload(`pdfs/${filename}`, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrlData } = supabase.storage.from('reports').getPublicUrl(uploadData.path);

    return NextResponse.json({ html, markdown, pdfUrl: publicUrlData.publicUrl }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
