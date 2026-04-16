export interface Scenario {
  id: number;
  domain: Domain;
  domainLabel: string;
  difficulty: string;
  scenario: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  trap?: string;
}

type Domain = 'd1' | 'd2' | 'd3' | 'd4' | 'd5';
