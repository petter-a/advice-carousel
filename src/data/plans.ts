
import { BusinessRule, evaluateRules } from "./businessRules";

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

export const financialPlans: FinancialPlan[] = [
  {
    id: "emergency_first",
    name: "Emergency Fund Builder",
    description: "Focus on building a solid emergency fund before pursuing other financial goals.",
    recommendations: [
      "Aim to save 3-6 months of essential expenses in a high-yield savings account",
      "Set up automatic transfers to your emergency fund with each paycheck",
      "Prioritize liquidity and safety over investment returns for these funds",
      "Consider a tiered approach with some funds in cash and some in short-term CDs"
    ],
    minimumScore: 5,
    requiredRules: ["emergency_fund_needed"]
  },
  {
    id: "debt_reduction",
    name: "Debt Reduction Plan",
    description: "Focus on strategically paying down high-interest debt to improve financial health.",
    recommendations: [
      "List all debts by interest rate and focus on the highest-rate debt first",
      "Consider consolidating high-interest debts if you qualify for lower rates",
      "Set up automatic payments to avoid late fees and credit score damage",
      "Maintain minimum payments on all debts while focusing extra payments on target debt"
    ],
    minimumScore: 5,
    requiredRules: ["high_debt_concern"]
  },
  {
    id: "young_growth",
    name: "Early Career Growth Portfolio",
    description: "Aggressive long-term growth strategy designed for younger investors with time on their side.",
    recommendations: [
      "Maximize contributions to tax-advantaged retirement accounts",
      "Invest primarily in diversified equity funds for long-term growth",
      "Consider dollar-cost averaging to build positions over time",
      "Set up automatic investment contributions to maintain discipline"
    ],
    suggestedAllocation: {
      stocks: 85,
      bonds: 10,
      alternatives: 5
    },
    minimumScore: 7,
    requiredRules: ["young_retirement_planning", "long_term_focus"],
    excludedRules: ["emergency_fund_needed", "high_debt_concern"]
  },
  {
    id: "midlife_balanced",
    name: "Mid-Life Balanced Strategy",
    description: "A balanced approach for mid-career professionals focusing on both growth and wealth preservation.",
    recommendations: [
      "Review and maximize retirement account contributions",
      "Balance portfolio between growth and income investments",
      "Consider tax-efficient investment strategies",
      "Begin developing a retirement income plan"
    ],
    suggestedAllocation: {
      stocks: 60,
      bonds: 30,
      alternatives: 5,
      cash: 5
    },
    minimumScore: 7,
    requiredRules: ["midlife_retirement_planning"]
  },
  {
    id: "conservative_income",
    name: "Conservative Income Strategy",
    description: "Focus on capital preservation and generating reliable income streams.",
    recommendations: [
      "Emphasize dividend-paying stocks and bonds for regular income",
      "Consider laddered bond strategies for predictable income",
      "Focus on inflation protection in fixed income allocations",
      "Maintain appropriate cash reserves for short-term needs"
    ],
    suggestedAllocation: {
      stocks: 30,
      bonds: 60,
      cash: 10
    },
    minimumScore: 3,
    requiredRules: ["conservative_investment_strategy"]
  },
  {
    id: "aggressive_growth",
    name: "Aggressive Growth Strategy",
    description: "Maximizing growth potential for investors comfortable with higher volatility.",
    recommendations: [
      "Focus on growth-oriented equities across market caps",
      "Consider strategic international and emerging market exposure",
      "Explore targeted sector or thematic investing aligned with long-term trends",
      "Maintain discipline through market volatility"
    ],
    suggestedAllocation: {
      stocks: 85,
      alternatives: 10,
      bonds: 5
    },
    minimumScore: 6,
    requiredRules: ["aggressive_investment_strategy", "long_term_focus"]
  },
  {
    id: "tax_optimization",
    name: "Tax Optimization Strategy",
    description: "Focused on maximizing after-tax returns for high-income individuals.",
    recommendations: [
      "Utilize tax-advantaged accounts strategically",
      "Consider municipal bonds for tax-exempt income",
      "Implement tax-loss harvesting strategies",
      "Explore charitable giving strategies for tax efficiency"
    ],
    minimumScore: 3,
    requiredRules: ["high_income_planning"]
  },
  {
    id: "short_term_stability",
    name: "Short-Term Stability Plan",
    description: "Preserving capital while maintaining liquidity for near-term goals.",
    recommendations: [
      "Focus on high-yield savings, money market funds, and short-term CDs",
      "Consider short-duration bond funds for slightly higher yields",
      "Maintain sufficient liquidity for upcoming expenses",
      "Avoid investments with high volatility or longer-term horizons"
    ],
    suggestedAllocation: {
      cash: 50,
      short_term_bonds: 40,
      ultrashort_bonds: 10
    },
    minimumScore: 2,
    requiredRules: ["short_term_focus"]
  },
  {
    id: "balanced_default",
    name: "Balanced Financial Strategy",
    description: "A well-rounded approach to financial planning with moderate risk and growth potential.",
    recommendations: [
      "Diversify investments across asset classes",
      "Balance short and long-term financial priorities",
      "Review and adjust financial plan annually",
      "Consider working with a financial advisor for personalized guidance"
    ],
    suggestedAllocation: {
      stocks: 60,
      bonds: 30,
      cash: 10
    },
    minimumScore: 0  // Default plan if no others match
  }
];

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
