export class ABTestAnalyzer {
    // Calculate Z-Score for statistical significance
    calculateZScore(
      conversionsA: number,
      sampleSizeA: number,
      conversionsB: number,
      sampleSizeB: number
    ): number {
      const rateA = conversionsA / sampleSizeA;
      const rateB = conversionsB / sampleSizeB;
      
      const standardError = Math.sqrt(
        (rateA * (1 - rateA)) / sampleSizeA + 
        (rateB * (1 - rateB)) / sampleSizeB
      );
  
      return (rateB - rateA) / standardError;
    }
  
    // Calculate confidence level
    getConfidenceLevel(zScore: number): number {
      const absoluteZ = Math.abs(zScore);
      if (absoluteZ >= 2.576) return 0.99;
      if (absoluteZ >= 1.96) return 0.95;
      if (absoluteZ >= 1.645) return 0.90;
      return 0;
    }
  
    // Determine winner
    determineWinner(testData: {
      templateA: { sent: number; converted: number };
      templateB: { sent: number; converted: number };
    }) {
      const zScore = this.calculateZScore(
        testData.templateA.converted,
        testData.templateA.sent,
        testData.templateB.converted,
        testData.templateB.sent
      );
  
      const confidenceLevel = this.getConfidenceLevel(zScore);
  
      if (confidenceLevel >= 0.95) {
        return {
          winner: zScore > 0 ? 'B' : 'A',
          confidenceLevel,
          improvement: this.calculateImprovement(
            testData.templateA.converted,
            testData.templateA.sent,
            testData.templateB.converted,
            testData.templateB.sent
          )
        };
      }
  
      return {
        winner: null,
        confidenceLevel,
        improvement: 0
      };
    }
  
    // Calculate improvement percentage
    private calculateImprovement(
      conversionsA: number,
      sampleSizeA: number,
      conversionsB: number,
      sampleSizeB: number
    ): number {
      const rateA = conversionsA / sampleSizeA;
      const rateB = conversionsB / sampleSizeB;
      return ((rateB - rateA) / rateA) * 100;
    }
  }
  
  export const testAnalyzer = new ABTestAnalyzer();