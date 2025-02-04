interface RetryOptions {
    maxRetries: number;
    initialDelay: number;
    maxDelay: number;
    backoffFactor: number;
  }
  
  export class RetryManager {
    private options: RetryOptions;
  
    constructor(options?: Partial<RetryOptions>) {
      this.options = {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        backoffFactor: 2,
        ...options
      };
    }
  
    async execute<T>(operation: () => Promise<T>): Promise<T> {
      let lastError: Error;
      let delay = this.options.initialDelay;
  
      for (let attempt = 1; attempt <= this.options.maxRetries; attempt++) {
        try {
          return await operation();
        } catch (error) {
          lastError = error as Error;
          
          if (attempt === this.options.maxRetries) {
            break;
          }
  
          console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
          await this.sleep(delay);
          
          delay = Math.min(
            delay * this.options.backoffFactor,
            this.options.maxDelay
          );
        }
      }
  
      throw lastError!;
    }
  
    private sleep(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }