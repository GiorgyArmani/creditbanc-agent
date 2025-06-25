import { openai } from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';

type ThreadMessage = {
  content: {
    type: string;
    text?: { value: string };
  }[];
};

// ✅ Handle OPTIONS preflight requests
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

// ✅ POST handler
export async function POST(req: NextRequest) {
  const { creditText } = await req.json();

  if (!creditText) {
    return NextResponse.json({ error: 'Missing creditText' }, {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
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

    const textBlocks: string[] = messages.data.flatMap((m: ThreadMessage) =>
      (m.content as { type: string; text?: { value: string } }[])
        .filter((c) => c.type === 'text' && c.text?.value)
        .map((c) => c.text!.value)
    );

    const html = textBlocks.find((t) => t.includes('<html>')) || '';
    const markdown = textBlocks.find((t) =>
      t.trim().startsWith('#') ||
      t.includes('**Client Information') ||
      t.includes('```')
    ) || '';
    const fileLink = textBlocks.find((t) =>
      t.includes('http') && (t.includes('.html') || t.includes('.pdf'))
    );

    if (!html && !markdown && !fileLink) {
      return NextResponse.json({ error: 'Markdown or HTML output not found' }, {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // ✅ Encode HTML as base64 download URL
    const encodedHtml = Buffer.from(html).toString('base64');
    const downloadUrl = `data:text/html;base64,${encodedHtml}`;

    return NextResponse.json({
      html,
      markdown,
      fileLink: fileLink || null,
      downloadUrl,
      message: 'Report generation completed successfully.',
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
    return NextResponse.json({ error: errorMessage }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// ✅ Export config to disable default CORS and enable edge support
export const config = {
  api: {
    bodyParser: false,
  },
};
