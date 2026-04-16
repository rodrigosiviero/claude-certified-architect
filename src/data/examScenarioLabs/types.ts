import type { QuizQuestion, QuickRefData } from '../types';

export interface ScenarioLab {
  id: string;
  title: string;
  domain: string;
  domainNum: number;
  scenario: string;
  examTopic: string;
  difficulty: string;
  codeTemplate: string;
  expectedOutput: string;
  brokenCode: string;
  hints: string[];
  fixes: string[];
}
