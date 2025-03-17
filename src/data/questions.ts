
import questionsData from './questions.json';

export type QuestionOption = {
  id: string;
  label: string;
  value: string | number | boolean;
};

export type Question = {
  id: string;
  text: string;
  description?: string;
  type: "text" | "select" | "number" | "slider" | "radio";
  options?: QuestionOption[];
  mandatory: boolean;
  mediaType: "image" | "video";
  mediaUrl: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
};

// Array of questions for the financial advice guide
export const questions: Question[] = questionsData;
