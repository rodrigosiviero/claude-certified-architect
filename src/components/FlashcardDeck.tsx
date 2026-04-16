import { useState, useCallback, useEffect } from 'react';
import { useCourse } from '../context/CourseContext';
import { allFlashcards, domainNames, domainColors, type Flashcard } from '../data/flashcards';
import { ArrowLeft, RotateCcw, ChevronRight, Sparkles, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

type Rating = 'hard' | 'good' | 'easy';

export default function FlashcardDeck() {
  const { rateFlashcard, getCardProgress, recordStudyDay } = useCourse();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [ratings, setRatings] = useState<Record<string, Rating>>({});

  const cards = selectedDomain
    ? allFlashcards.filter(c => c.domainId === selectedDomain)
    : allFlashcards;

  const card = cards[currentIndex];

  // Record study day on first flip
  useEffect(() => {
    if (flipped) recordStudyDay();
  }, [flipped, recordStudyDay]);

  const handleRate = useCallback((rating: Rating) => {
    if (!card) return;
    rateFlashcard(card.id, rating);
    setRatings(prev => ({ ...prev, [card.id]: rating }));

    if (currentIndex + 1 >= cards.length) {
      setSessionDone(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setFlipped(false);
    }
  }, [card, cards.length, currentIndex, rateFlashcard]);

  const restart = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setSessionDone(false);
    setRatings({});
  };

  // ─── Deck Selection Screen ──────────────────────────────────
  if (!selectedDomain) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">🎴 Flashcards</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Spaced repetition to master every exam topic. Select a deck to start studying.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => { setSelectedDomain(null); }}
            className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 text-white text-left hover:scale-[1.02] transition-transform"
          >
            <div className="text-2xl font-bold">All Cards</div>
            <div className="text-slate-300 text-sm mt-1">{allFlashcards.length} cards across all domains</div>
          </button>
          {Object.entries(domainNames).map(([id, name]) => {
            const count = allFlashcards.filter(c => c.domainId === id).length;
            const color = domainColors[id];
            return (
              <button
                key={id}
                onClick={() => setSelectedDomain(id)}
                className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-left hover:scale-[1.02] transition-transform"
                style={{ borderColor: `${color}40` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{name}</div>
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-sm mt-1">{count} cards</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Session Complete ────────────────────────────────────────
  if (sessionDone) {
    const hardCount = Object.values(ratings).filter(r => r === 'hard').length;
    const goodCount = Object.values(ratings).filter(r => r === 'good').length;
    const easyCount = Object.values(ratings).filter(r => r === 'easy').length;

    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Session Complete!</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">You reviewed {cards.length} cards</p>

        <div className="flex justify-center gap-4 sm:gap-8 mb-6 sm:mb-8">
          <div className="text-center">
            <MinusCircle className="w-8 h-8 text-red-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{hardCount}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Hard</div>
          </div>
          <div className="text-center">
            <CheckCircle2 className="w-8 h-8 text-amber-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{goodCount}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Good</div>
          </div>
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-green-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{easyCount}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Easy</div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={restart}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> Study Again
          </button>
          <button
            onClick={() => setSelectedDomain(null)}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> All Decks
          </button>
        </div>
      </div>
    );
  }

  // ─── Card View ───────────────────────────────────────────────
  const progress = card ? getCardProgress(card.id) : undefined;
  const domainColor = card ? domainColors[card.domainId] : '#64748b';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setSelectedDomain(null)}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Decks
        </button>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {currentIndex + 1} / {cards.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%`, backgroundColor: domainColor }}
        />
      </div>

      {/* Card */}
      {card && (
        <div className="flex justify-center mb-8">
          <div
            className="w-full max-w-2xl cursor-pointer px-2 px-2 px-2 px-2 px-2"
            style={{ perspective: '1000px' }}
            onClick={() => setFlipped(!flipped)}
          >
            <div
              className="relative w-full transition-transform duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
              }}
            >
              {/* Front */}
              <div
                className="w-full rounded-2xl p-5 sm:p-8 shadow-lg border"
                style={{
                  backfaceVisibility: 'hidden',
                  backgroundColor: 'var(--card-bg, #fff)',
                  borderColor: `${domainColor}30`,
                }}
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-8 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: domainColor }} />
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {domainNames[card.domainId]} · {card.difficulty}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
                    {card.front}
                  </p>
                  <div className="mt-6 text-center text-sm text-slate-400 dark:text-slate-500">
                    Click to reveal answer →
                  </div>
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 w-full rounded-2xl p-5 sm:p-8 shadow-lg border"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderColor: `${domainColor}30`,
                }}
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-8 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Answer
                    </span>
                  </div>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    {card.back}
                  </p>
                  {progress && progress.repetitions > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
                      Previously reviewed · Next review: {new Date(progress.nextReview).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Buttons */}
      {flipped && (
        <div className="flex justify-center gap-4 animate-in fade-in duration-300">
          <button
            onClick={() => handleRate('hard')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 font-medium transition-colors"
          >
            <MinusCircle className="w-5 h-5" /> Hard <span className="text-xs opacity-60">1 min</span>
          </button>
          <button
            onClick={() => handleRate('good')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 font-medium transition-colors"
          >
            <CheckCircle2 className="w-5 h-5" /> Good <span className="text-xs opacity-60">10 min</span>
          </button>
          <button
            onClick={() => handleRate('easy')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 font-medium transition-colors"
          >
            <Sparkles className="w-5 h-5" /> Easy <span className="text-xs opacity-60">4 days</span>
          </button>
        </div>
      )}

      {/* Keyboard hint */}
      {!flipped && (
        <div className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
          Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">Space</kbd> to flip ·
          <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs ml-1">1</kbd>
          <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs ml-1">2</kbd>
          <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs ml-1">3</kbd> to rate
        </div>
      )}
    </div>
  );
}
