import domain1Quiz from './domain1';
import domain2Quiz from './domain2';
import domain3Quiz from './domain3';
import domain4Quiz from './domain4';
import domain5Quiz from './domain5';

export const quizzes = {
  1: domain1Quiz,
  2: domain2Quiz,
  3: domain3Quiz,
  4: domain4Quiz,
  5: domain5Quiz,
} as const;

export { domain1Quiz, domain2Quiz, domain3Quiz, domain4Quiz, domain5Quiz };
