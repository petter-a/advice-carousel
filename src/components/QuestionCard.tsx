
import React from "react";
import { Question, QuestionOption } from "@/data/questions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatters";

interface QuestionCardProps {
  question: Question;
  answer: string | number | boolean | undefined;
  onAnswer: (questionId: string, answer: string | number | boolean) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, answer, onAnswer }) => {
  const handleInputChange = (value: string | number | boolean) => {
    onAnswer(question.id, value);
  };

  const renderMedia = () => {
    if (question.mediaType === "image") {
      return (
        <div className="mb-6 rounded-lg overflow-hidden bg-muted flex justify-center">
          <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Image placeholder: {question.mediaUrl}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mb-6 rounded-lg overflow-hidden bg-muted flex justify-center">
          <div className="h-48 w-full bg-gray-800 flex items-center justify-center">
            <p className="text-gray-400">Video placeholder: {question.mediaUrl}</p>
          </div>
        </div>
      );
    }
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case "text":
        return (
          <Input
            type="text"
            id={question.id}
            value={answer as string || ""}
            placeholder={question.placeholder || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full mt-2"
          />
        );
        
      case "number":
        return (
          <Input
            type="number"
            id={question.id}
            value={answer as number || ""}
            min={question.min}
            max={question.max}
            step={question.step || 1}
            onChange={(e) => handleInputChange(Number(e.target.value))}
            className="w-full mt-2"
          />
        );
        
      case "slider":
        const value = typeof answer === 'number' ? answer : question.min || 0;
        return (
          <div className="space-y-4 mt-4">
            <Slider
              id={question.id}
              min={question.min || 0}
              max={question.max || 100}
              step={question.step || 1}
              value={[value]}
              onValueChange={(values) => handleInputChange(values[0])}
            />
            <div className="text-center font-medium">
              {formatCurrency(value)}
            </div>
          </div>
        );
        
      case "radio":
        return (
          <RadioGroup
            value={answer as string || ""}
            onValueChange={(value) => handleInputChange(value)}
            className="grid gap-3 mt-4"
          >
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value as string} id={option.id} />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
        
      case "select":
        return (
          <Select
            value={answer as string || ""}
            onValueChange={(value) => handleInputChange(value)}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.id} value={option.value as string}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      default:
        return null;
    }
  };

  return (
    <div>
      {renderMedia()}
      
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">{question.text}</h2>
        {question.description && (
          <p className="text-muted-foreground">{question.description}</p>
        )}
      </div>
      
      <div className="mt-4">
        <Label htmlFor={question.id} className={question.mandatory ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
          Your answer
        </Label>
        {renderQuestionInput()}
      </div>
    </div>
  );
};

export default QuestionCard;
