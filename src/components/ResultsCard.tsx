
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  PiggyBank, 
  ChartPie, 
  Coins, 
  LineChart, 
  ArrowRight 
} from "lucide-react";
import { determinePlan } from "@/data/plans";
import { Answers } from "./FinancialAdvisor";

interface ResultsCardProps {
  answers: Answers;
  onReset: () => void;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ answers, onReset }) => {
  const plan = useMemo(() => determinePlan(answers), [answers]);
  
  const renderAllocationChart = () => {
    if (!plan.suggestedAllocation) return null;
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Suggested Allocation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(plan.suggestedAllocation).map(([asset, percentage]) => (
            <Card key={asset} className="p-4 text-center">
              <div className="flex justify-center mb-2">
                {asset === "stocks" ? (
                  <LineChart className="h-10 w-10 text-blue-500" />
                ) : asset === "bonds" ? (
                  <Coins className="h-10 w-10 text-amber-500" />
                ) : asset === "cash" ? (
                  <PiggyBank className="h-10 w-10 text-green-500" />
                ) : (
                  <ChartPie className="h-10 w-10 text-purple-500" />
                )}
              </div>
              <h4 className="capitalize font-medium text-lg">{asset.replace('_', ' ')}</h4>
              <p className="text-2xl font-bold">{percentage}%</p>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Your Financial Plan</h2>
        <p className="text-muted-foreground">Based on your answers, we recommend:</p>
      </div>
      
      <Card className="p-6 mb-6 border-primary/20 bg-primary/5">
        <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
        <p className="text-lg mb-4">{plan.description}</p>
      </Card>
      
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Key Recommendations</h3>
        <div className="space-y-3">
          {plan.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <p>{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
      
      {renderAllocationChart()}
      
      <Separator className="my-8" />
      
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">
          This is a general recommendation based on your answers. For detailed financial advice, 
          please consult with a certified financial advisor.
        </p>
        <Button onClick={onReset} className="mt-2">
          Start Over
        </Button>
      </div>
    </div>
  );
};

export default ResultsCard;
