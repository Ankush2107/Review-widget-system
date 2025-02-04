import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Widget } from '@/models/Widget';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const widget = await Widget.findById(params.id);
    
    if (!widget) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { status: 404 }
      );
    }

    const embedCode = `
<div id="review-widget-${widget._id}"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = "${process.env.NEXT_PUBLIC_APP_URL}/widget.js";
    script.dataset.widgetId = "${widget._id}";
    script.async = true;
    document.getElementById('review-widget-${widget._id}').appendChild(script);
  })();
</script>`.trim();

    return NextResponse.json({ embedCode });
  } catch (error) {
    console.error('Error generating embed code:', error);
    return NextResponse.json(
      { error: 'Failed to generate embed code' },
      { status: 500 }
    );
  }
}