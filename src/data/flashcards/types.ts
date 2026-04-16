export interface Flashcard {
  id: string;
  domainId: string;
  lessonId: string;
  front: string;
  back: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}
