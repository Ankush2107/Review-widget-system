// src/app/api/init.ts
import { NotificationScheduler } from '@/lib/scheduler';

export function initializeSchedulers() {
  const scheduler = new NotificationScheduler();
  scheduler.start();
}