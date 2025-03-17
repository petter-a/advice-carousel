import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { questions, Question, QuestionOption } from "@/data/questions";
import { determinePlan } from "@/data/plans";
import QuestionCard from "./QuestionCard";
import ResultsCard from "./ResultsCard";

export interface Answers {
  [key: string]: string | number | boolean;
}

const FinancialAdvisor: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Calculate progress as a percentage
    setProgress((currentQuestionIndex / questions.length) * 100);
  }, [currentQuestionIndex]);

  const handleAnswer = (questionId: string, answer: string | number | boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    // Check if current question is mandatory and has been answered
    if (currentQuestion.mandatory && !answers[currentQuestion.id]) {
      // Show an error or toast notification
      console.log("This question is mandatory");
      return;
    }
    
    // If we're at the last question, show results
    if (currentQuestionIndex === questions.length - 1) {
      setShowResults(true);
      return;
    }
    
    // Otherwise, move to the next question
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">Personal Financial Advisor</h1>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Start</span>
          <span>Financial Plan</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Card className="p-6 shadow-lg">
        {!showResults ? (
          <QuestionCard 
            question={questions[currentQuestionIndex]} 
            answer={answers[questions[currentQuestionIndex].id]} 
            onAnswer={handleAnswer} 
          />
        ) : (
          <ResultsCard answers={answers} onReset={handleReset} />
        )}
        
        {!showResults && (
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
            >
              Back
            </Button>
            <Button onClick={handleNext}>
              {currentQuestionIndex === questions.length - 1 ? "See Your Plan" : "Next"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FinancialAdvisor;
