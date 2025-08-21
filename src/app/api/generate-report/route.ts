// app/api/generate-report/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { pdf, type DocumentProps } from '@react-pdf/renderer';
import React from 'react';

import { supabase } from '@/lib/supabase';
import { openai } from '@/lib/openai';
import CreditReportPDF, { CreditReportData } from '@/components/pdf/credit-report-pdf';

// --- Validador rápido ---
function isCreditReportData(x: any): x is CreditReportData {
  return (
    x &&
    typeof x.fullName === 'string' &&
    typeof x.reportDate === 'string' &&
    Array.isArray(x.scores) &&
    Array.isArray(x.summary) &&
    Array.isArray(x.revolvingAccounts) &&
    Array.isArray(x.revolvingStats) &&
    Array.isArray(x.scoreImprovementTips) &&
    Array.isArray(x.alerts) &&
    Array.isArray(x.installmentAccounts)
  );
}

// Extraer bloque ```json ... ``` o intentar el string completo
function extractJson(text: string): any {
  const tryParse = (s: string) => {
    try {
      return JSON.parse(s);
    } catch {
      return undefined;
    }
  };

  // 1) bloque ```json ... ```
  const m = text.match(/```json\s*([\s\S]*?)```/i);
  if (m?.[1]) {
    const p = tryParse(m[1].trim());
    if (p) return p;
  }

  // 2) bloque ``` ... ```
  const m2 = text.match(/```\s*([\s\S]*?)```/);
  if (m2?.[1]) {
    const p = tryParse(m2[1].trim());
    if (p) return p;
  }

  // 3) todo el string
  const p3 = tryParse(text.trim());
  if (p3) return p3;

  throw new Error('No se pudo parsear JSON desde la salida del assistant.');
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { creditText, title: maybeTitle, userId } = body || {};
    if (!creditText) {
      return NextResponse.json({ error: 'Missing creditText' }, { status: 400 });
    }
    const title = (maybeTitle as string) ?? 'Credit Report';

    // 1) Texto → Assistant → JSON
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `Here is a new credit report:\n\n${creditText}`,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.CREDIT_ASSISTANT_ID!, // ENV requerido
    });

    // Polling con timeout
    let attempts = 0;
    const maxAttempts = 60; // ~72s (60 * 1.2s)
    let status = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });

    while (!['completed', 'failed', 'cancelled', 'expired'].includes(status.status as any)) {
      attempts++;
      if (attempts > maxAttempts) {
        return NextResponse.json({ error: 'Run polling timeout' }, { status: 504 });
      }
      await new Promise((r) => setTimeout(r, 1200));
      status = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    }
    if (status.status !== 'completed') {
      return NextResponse.json({ error: `Run failed: ${status.status}` }, { status: 500 });
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const fullText = messages.data
      .flatMap((m: any) =>
        (m.content ?? []).map((c: any) =>
          c.type === 'text' && c.text?.value ? c.text.value : ''
        )
      )
      .join('\n')
      .trim();

    // console.log('Assistant raw output:', fullText);

    const parsed = extractJson(fullText);
    if (!isCreditReportData(parsed)) {
      return NextResponse.json(
        { error: 'Assistant output is not valid CreditReportData' },
        { status: 400 }
      );
    }
    const data: CreditReportData = parsed;

    // 2) URL ABSOLUTA para el logo en /public (React-PDF exige http/https o data URI)
    const siteOrigin = req.nextUrl?.origin || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const headerUrl = `${siteOrigin}/header-logo.png`;

    // 3) Render PDF con tu plantilla y el headerUrl
    const element = React.createElement(
      CreditReportPDF as React.ComponentType<{ data: CreditReportData; headerUrl?: string }>,
      { data, headerUrl }
    ) as unknown as React.ReactElement<DocumentProps>;
    const instance = pdf(element);
    const pdfBuffer = await instance.toBuffer();

    // 4) Subir PDF a Supabase Storage
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeTitle = `${title}`.replace(/\s+/g, '_');
    const filename = `${safeTitle}_${stamp}.pdf`;
    const basePath = userId ? `pdfs/${userId}` : 'pdfs';
    const storagePath = `${basePath}/${filename}`;

    const { error: upErr } = await supabase.storage
      .from('reports')
      .upload(storagePath, pdfBuffer, { contentType: 'application/pdf', upsert: false });
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

    const { data: pub } = supabase.storage.from('reports').getPublicUrl(storagePath);
    const publicUrl = pub.publicUrl;

    // 5) Guardar fila en credit_reports
    const baseRow: Record<string, any> = {
      user_id: userId ?? null,
      source_text: creditText,
      report_json: data,
      report_pdf_url: publicUrl,
    };
    const extendedRow = {
      ...baseRow,
      title,
      full_name: data.fullName,
      report_date: data.reportDate,
    };

    let insert = await supabase.from('credit_reports').insert(extendedRow);
    if (insert.error) {
      insert = await supabase.from('credit_reports').insert(baseRow);
      if (insert.error) console.warn('credit_reports insert error:', insert.error.message);
    }

    return NextResponse.json(
      { url: publicUrl, title, fullName: data.fullName, reportDate: data.reportDate },
      { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error', stack: e?.stack }, { status: 500 });
  }
}
