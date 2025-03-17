
import plansData from './plans.json';
import { evaluateRules } from './businessRules';

export type FinancialPlan = {
  id: string;
  name: string;
  description: string;
  recommendations: string[];
  suggestedAllocation?: { 
    [key: string]: number  // e.g., { stocks: 60, bonds: 30, cash: 10 }
  };
  minimumScore: number;  // Minimum score needed to qualify for this plan
  requiredRules?: string[];  // Business rules that must be triggered
  excludedRules?: string[];  // Business rules that must NOT be triggered
};

export const financialPlans: FinancialPlan[] = plansData;

// Function to determine the most appropriate plan based on business rule evaluation
export const determinePlan = (answers: Record<string, any>): FinancialPlan => {
  const ruleResults = evaluateRules(answers);
  const triggeredRules = Object.keys(ruleResults);
  let totalScore = Object.values(ruleResults).reduce((sum, score) => sum + score, 0);
  
  // Filter plans based on required and excluded rules
  const eligiblePlans = financialPlans.filter(plan => {
    // Check if all required rules are triggered
    if (plan.requiredRules && !plan.requiredRules.every(ruleId => triggeredRules.includes(ruleId))) {
      return false;
    }
    
    // Check if any excluded rules are triggered
    if (plan.excludedRules && plan.excludedRules.some(ruleId => triggeredRules.includes(ruleId))) {
      return false;
    }
    
    // Check if the total score meets the minimum requirement
    return totalScore >= plan.minimumScore;
  });
  
  // Sort eligible plans by minimum score (highest first) to get the most specific plan
  eligiblePlans.sort((a, b) => b.minimumScore - a.minimumScore);
  
  // Return the highest-scoring eligible plan, or the default plan if none are eligible
  return eligiblePlans[0] || financialPlans.find(plan => plan.id === "balanced_default")!;
};
