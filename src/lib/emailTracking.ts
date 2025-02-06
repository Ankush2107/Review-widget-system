import { createHash } from 'crypto';

interface EmailTrackingData {
  userId: string;
  widgetId: string;
  emailId: string;
  opened: boolean;
  openedAt?: Date;
}

export function generateTrackingPixel(emailId: string): string {
  return `<img src="${process.env.NEXT_PUBLIC_APP_URL}/api/tracking/email/${emailId}" width="1" height="1" />`;
}

export function generateEmailId(userId: string, widgetId: string): string {
  return createHash('sha256')
    .update(`${userId}:${widgetId}:${Date.now()}`)
    .digest('hex');
}

// src/app/api/tracking/email/[emailId]/route.ts
export async function GET(request: Request, { params }) {
  const { emailId } = params;
  
  await EmailTracking.updateOne(
    { emailId },
    { 
      opened: true,
      openedAt: new Date()
    }
  );

  return new Response(
    Buffer.from([0x47, 0x49, 0x46]), 
    { headers: { 'Content-Type': 'image/gif' } }
  );
}