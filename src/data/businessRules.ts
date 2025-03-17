
import businessRulesData from './businessRules.json';

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

export const businessRules: BusinessRule[] = businessRulesData;

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
