import { openai } from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';

type ThreadMessage = {
  content: {
    type: string;
    text?: { value: string };
  }[];
};

// ✅ Handle OPTIONS prasaseflight requests
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Or restrict to 'https://app.gohighlevel.com'
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// ✅ Your POST handler
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
    // Create thread
    const thread = await openai.beta.threads.create();

    // Add message
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `Here is a new credit report:\n\n${creditText}`,
    });

    // Start run
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: 'asst_M0u0phtt14WrV0FYOHB3yDqF',
    });

    // Poll for status
    let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });

    while (!['completed', 'failed', 'cancelled', 'expired'].includes(runStatus.status)) {
      await new Promise((res) => setTimeout(res, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    }

    if (runStatus.status !== 'completed') {
      throw new Error(`Run failed with status: ${runStatus.status}`);
    }

    // Get messages
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

    return NextResponse.json({
      html,
      markdown,
      fileLink: fileLink || null,
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
// ✅ Handle GET requests if needed