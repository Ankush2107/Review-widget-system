import { CronJob } from 'cron';
import { User, Widget } from '@/models/index';
import { sendReviewNotification } from '@/lib/email';

export class NotificationScheduler {
  private dailyJob: CronJob;
  private weeklyJob: CronJob;

  constructor() {
    this.dailyJob = new CronJob('0 0 * * *', () => this.sendDailyDigest());
    this.weeklyJob = new CronJob('0 0 * * 0', () => this.sendWeeklyDigest());
  }

  async sendDailyDigest() {
    const users = await User.find({ 'preferences.frequency': 'daily' });
    for (const user of users) {
      await this.sendDigest(user, 'daily');
    }
  }

  async sendWeeklyDigest() {
    const users = await User.find({ 'preferences.frequency': 'weekly' });
    for (const user of users) {
      await this.sendDigest(user, 'weekly');
    }
  }

  private async sendDigest(user: any, type: 'daily' | 'weekly') {
    const widgets = await Widget.find({ userId: user._id });
    const reviews = await this.getNewReviews(widgets, type);
    
    if (reviews.length > 0) {
      await sendReviewNotification(reviews, user);
    }
  }

  start() {
    this.dailyJob.start();
    this.weeklyJob.start();
  }
}