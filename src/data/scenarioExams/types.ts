export interface ScenarioQuestion {
  id: number;
  examScenario: number; // 1-6
  domain: 'd1' | 'd2' | 'd3' | 'd4' | 'd5';
  domainLabel: string;
  examTask: string; // e.g. "1.1 Agentic Loops"
  scenario: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  trap?: string;
}

export interface ScenarioExamData {
  id: number;
  title: string;
  description: string;
  icon: string;
  questions: ScenarioQuestion[];
}
