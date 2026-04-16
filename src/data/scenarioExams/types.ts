export interface ScenarioQuestion {
  id: number;
  examScenario: number; // 1-6
  domain: 'd1' | 'd2' | 'd3' | 'd4' | 'd5';
  domainLabel: string;
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
