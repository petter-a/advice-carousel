
import { Question } from "./questions";

export type BusinessRule = {
  id: string;
  description: string;
  condition: {
    questionId: string;
    operator: "equals" | "greater_than" | "less_than" | "contains";
    value: string | number | boolean;
  };
  priority: number; // Higher number means higher priority
  score: number; // Score to apply when this rule matches
  dependsOn?: string[]; // Array of question IDs this rule depends on
};

export const businessRules: BusinessRule[] = [
  // Emergency Fund Rules
  {
    id: "emergency_fund_needed",
    description: "Needs emergency fund",
    condition: {
      questionId: "savings",
      operator: "less_than",
      value: 10000,
    },
    priority: 10,
    score: 5,
  },
  
  // Debt Reduction Rules
  {
    id: "high_debt_concern",
    description: "High debt level is a concern",
    condition: {
      questionId: "debt",
      operator: "greater_than",
      value: 10000,
    },
    priority: 9,
    score: 5,
  },
  
  // Age-based retirement planning
  {
    id: "young_retirement_planning",
    description: "Young investor with retirement focus",
    condition: {
      questionId: "age",
      operator: "less_than",
      value: 35,
    },
    priority: 7,
    score: 4,
    dependsOn: ["financial_goals"],
  },
  
  {
    id: "midlife_retirement_planning",
    description: "Mid-life investor with retirement focus",
    condition: {
      questionId: "age",
      operator: "greater_than",
      value: 35,
    },
    priority: 7,
    score: 4,
    dependsOn: ["financial_goals"],
  },
  
  // Risk tolerance based investment strategy
  {
    id: "conservative_investment_strategy",
    description: "Conservative investment strategy recommended",
    condition: {
      questionId: "risk_tolerance",
      operator: "equals",
      value: "low",
    },
    priority: 6,
    score: 3,
  },
  
  {
    id: "aggressive_investment_strategy",
    description: "Aggressive investment strategy potential",
    condition: {
      questionId: "risk_tolerance",
      operator: "equals",
      value: "high",
    },
    priority: 6,
    score: 3,
  },
  
  // Income-based planning
  {
    id: "high_income_planning",
    description: "High income optimization strategies",
    condition: {
      questionId: "annual_income",
      operator: "greater_than",
      value: 100000,
    },
    priority: 5,
    score: 3,
  },
  
  // Timeline-based strategies
  {
    id: "short_term_focus",
    description: "Short-term financial focus",
    condition: {
      questionId: "timeline",
      operator: "equals",
      value: "short",
    },
    priority: 4,
    score: 2,
  },
  
  {
    id: "long_term_focus",
    description: "Long-term growth focus",
    condition: {
      questionId: "timeline",
      operator: "equals",
      value: "long",
    },
    priority: 4,
    score: 2,
  }
];

// Function to evaluate business rules against user answers
export const evaluateRules = (answers: Record<string, any>) => {
  const results: Record<string, number> = {};
  
  businessRules.forEach(rule => {
    // Skip if we don't have the required answer
    if (!answers[rule.condition.questionId]) return;
    
    // Skip if rule depends on questions that haven't been answered
    if (rule.dependsOn && rule.dependsOn.some(qId => !answers[qId])) return;
    
    const questionValue = answers[rule.condition.questionId];
    let ruleApplies = false;
    
    switch (rule.condition.operator) {
      case "equals":
        ruleApplies = questionValue === rule.condition.value;
        break;
      case "greater_than":
        ruleApplies = questionValue > rule.condition.value;
        break;
      case "less_than":
        ruleApplies = questionValue < rule.condition.value;
        break;
      case "contains":
        ruleApplies = Array.isArray(questionValue) && 
          questionValue.includes(rule.condition.value);
        break;
    }
    
    if (ruleApplies) {
      results[rule.id] = rule.score;
    }
  });
  
  return results;
};
