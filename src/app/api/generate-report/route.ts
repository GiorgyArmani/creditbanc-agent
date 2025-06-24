import { openai } from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';
type ThreadMessage = {
  content: {
    type: string;
    text?: { value: string };
  }[];
};

export async function POST(req: NextRequest) {
  const { creditText } = await req.json();

  if (!creditText) {
    return NextResponse.json({ error: 'Missing creditText' }, { status: 400 });
  }

  try {
    // Step 1: Create thread
    const thread = await openai.beta.threads.create();
    console.log('Thread created:', thread.id);

    // Step 2: Add message
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `Here is a new credit report:\n\n${creditText}`,
    });

    // Step 3: Start the run
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: 'asst_M0u0phtt14WrV0FYOHB3yDqF',
    });

    console.log('Run started:', run.id);

    // Step 4: Wait for run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(run.id, {
      thread_id: thread.id,
    });

    while (!['completed', 'failed', 'cancelled', 'expired'].includes(runStatus.status)) {
      console.log('Waiting... status:', runStatus.status);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(run.id, {
        thread_id: thread.id,
      });
    }

    if (runStatus.status !== 'completed') {
      throw new Error(`Run failed with status: ${runStatus.status}`);
    }

    // Step 5: Get thread messages
    const messages = await openai.beta.threads.messages.list(thread.id);

    const textBlocks: string[] = messages.data.flatMap((m: ThreadMessage) =>
      (m.content as { type: string; text?: { value: string } }[])
        .filter((c) => c.type === 'text' && c.text?.value)
        .map((c) => c.text!.value)
    );

    // Step 6: Extract outputs
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
      console.warn('No HTML or Markdown found. Assistant output:', textBlocks);
      return NextResponse.json({ error: 'Markdown or HTML output not found', debug: textBlocks }, { status: 500 });
    }

    return NextResponse.json({
      html,
      markdown,
      fileLink: fileLink || null,
      message: 'Report generation completed successfully.',
    });

  } catch (err: unknown) {
    console.error('API error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
