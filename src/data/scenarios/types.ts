export interface Scenario {
  id: string;
  domain: Domain;
  title: string;
  description: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

type Domain = 'd1' | 'd2' | 'd3' | 'd4' | 'd5';
