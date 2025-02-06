import sgMail from '@sendgrid/mail';
import { generateReviewDigest } from './emailTemplates';
import { generateEmailId, generateTrackingPixel } from './emailTracking';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendReviewNotification(reviews: Review[], user: User, type: 'instant' | 'daily' | 'weekly' = 'instant') {
    const emailId = generateEmailId(user._id, reviews[0].widgetId);
    const template = generateReviewDigest(reviews, type);
    
    const trackingPixel = generateTrackingPixel(emailId);
    const htmlWithTracking = template.html + trackingPixel;
  
    await sgMail.send({
      to: user.email,
      from: 'notifications@reviewwidget.com',
      subject: template.subject,
      html: htmlWithTracking
    });
  
    await EmailTracking.create({
      emailId,
      userId: user._id,
      widgetId: reviews[0].widgetId,
      opened: false
    });
  }