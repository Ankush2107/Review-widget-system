interface RateLimitOptions {
    maxRequests: number;
    intervalMs: number;
  }
  
  export class RateLimit {
    private timestamps: number[] = [];
    private options: RateLimitOptions;
  
    constructor(options: RateLimitOptions) {
      this.options = options;
    }
  
    async acquire(): Promise<void> {
      const now = Date.now();
      this.timestamps = this.timestamps.filter(
        timestamp => now - timestamp < this.options.intervalMs
      );
  
      if (this.timestamps.length >= this.options.maxRequests) {
        const oldestTimestamp = this.timestamps[0];
        const waitTime = this.options.intervalMs - (now - oldestTimestamp);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
  
      this.timestamps.push(now);
    }
  }