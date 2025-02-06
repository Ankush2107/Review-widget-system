// src/lib/emailTemplates.ts
interface EmailTemplate {
    subject: string;
    html: string;
  }
  
  export function generateReviewDigest(reviews: Review[], type: 'daily' | 'weekly'): EmailTemplate {
    const reviewsList = reviews.map(review => `
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 8px;">
        <h3>${review.author} - ${review.rating} ★</h3>
        <p>${review.content}</p>
        <small>via ${review.source} - ${new Date(review.date).toLocaleDateString()}</small>
      </div>
    `).join('');
  
    return {
      subject: `${type === 'daily' ? 'Daily' : 'Weekly'} Review Digest`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${reviews.length} New Reviews</h2>
          ${reviewsList}
        </div>
      `
    };
  }