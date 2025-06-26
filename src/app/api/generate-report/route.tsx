import { openai } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import HtmlToPDF from '@/components/pdf/html-to-pdf'; // ensure this is a default export

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const { creditText } = await req.json();

  if (!creditText) {
    return NextResponse.json({ error: 'Missing creditText' }, { status: 400 });
  }

  try {
    // 1. Create and send to Assistant
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `Here is a new credit report:\n\n${creditText}`,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: 'asst_M0u0phtt14WrV0FYOHB3yDqF', // use your assistant ID
    });

    // 2. Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    while (!['completed', 'failed', 'cancelled', 'expired'].includes(runStatus.status)) {
      await new Promise((res) => setTimeout(res, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    }

    if (runStatus.status !== 'completed') {
      throw new Error(`Run failed with status: ${runStatus.status}`);
    }

    // 3. Get response content
    const messages = await openai.beta.threads.messages.list(thread.id);
    const fullText = messages.data
      .flatMap((m: any) =>
        (m.content ?? []).map((c: any) =>
          c.type === 'text' && c.text?.value ? c.text.value : ''
        )
      )
      .join('\n');

    // 4. Extract HTML and Markdown code blocks
    const extractCodeBlock = (text: string, language: string): string => {
      const regex = new RegExp(`\`\`\`${language}\\s*([\\s\\S]*?)\`\`\``, 'i');
      const match = text.match(regex);
      return match?.[1]?.trim() || '';
    };

    const html = extractCodeBlock(fullText, 'html');
    const markdown = extractCodeBlock(fullText, 'markdown');

    if (!html || !markdown) {
      return NextResponse.json(
        { error: 'Expected outputs not found in assistant response' },
        { status: 500 }
      );
    }

    // 5. Generate PDF from HTML
    const pdfBuffer = await renderToBuffer(<HtmlToPDF html={html} />);

    // 6. Upload to Supabase
    const filename = `${Date.now()}_CreditBanc_Report.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reports')
      .upload(`pdfs/${filename}`, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrlData } = supabase.storage
      .from('reports')
      .getPublicUrl(uploadData.path);

    return NextResponse.json({
      markdown,
      html,
      pdfUrl: publicUrlData.publicUrl,
      message: 'Report generated and uploaded successfully.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
