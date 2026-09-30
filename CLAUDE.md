# DeutschStart – project guide

**DeutschStart** ("Learn German from zero") is a web app that teaches German to Vietnamese beginners, from A0 up to A1/A2.
- The **UI language is Vietnamese**; German is the language being learned.
- It is built with React 18, TypeScript and Vite. The frontend is data-driven and has no backend yet: progress and accounts are stored in the browser's `localStorage`.

## Run it

Requires **Node.js 18+**. It is not installed globally on this machine; get the LTS version from nodejs.org.

```bash
npm install
npm run dev        # dev server → http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + production build → dist/
npm run preview    # serve dist/ → http://localhost:4173
```

- No API keys are required.
- `.env.example` lists the optional variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and `VITE_AUDIO_BASE_URL`. Copy it to `.env.local` and never commit real keys.
- There is **no test suite and no ESLint**. Checking a change means running `npm run typecheck` and `npm run build`, then looking at the page in a browser.

## Features and routes

| Feature | Route(s) | Notes |
|---|---|---|
| Dashboard | `/` | Hero, A1 progress %, streak, words due for review, current lesson, daily challenge, word of the day, quick links |
| Start from zero | `/learn`, `/learn/:lessonId` | 12 Level-0 lessons played step by step; progress is saved per step |
| Alphabet | `/alphabet` | A–Z + Ä Ö Ü ß. A modal card per letter: name + IPA, picture word, example, Vietnamese tip; "play whole alphabet" button |
| Vocabulary | `/vocabulary`, `/vocabulary/topic/:topicId`, `/vocabulary/word/:wordId` | 61 words, 14 topics, filters by review state, topic quiz, full word card with actions (Nghe / Lưu từ / Học từ này / Tôi đã biết) |
| Flashcards | `/flashcards?mode=new\|due\|saved`, `?topic=` | Flip card; *Không nhớ / Nhớ / Rất dễ* drive spaced repetition |
| Articles | `/articles` | der/die/das quiz weighted toward the weakest article and past mistakes; accuracy per article |
| Grammar | `/grammar`, `/grammar/:lessonId` | 8 complete lessons + 7 marked "Sắp có" (coming soon): explanation, table with audio, highlighted structure, examples, sentence builder, mini quiz |
| Listening | `/listening` | Level 1 word → meaning, level 2 sentence recognition, level 3 fill the gap; replay and slow playback |
| Pronunciation | `/pronunciation` | 16 hard sounds (ch, r, ü, ö, ä, z, w, v, sch, sp, st, ei, ie, eu…), mouth diagram (SVG), microphone check |
| Conversations | `/conversations`, `/conversations/:convoId` | 10 scenarios, audio per line, slow mode, translation toggle, role-play mode |
| Review | `/review` | Due words (most-missed first), review-state counts, daily challenge, links |
| Quiz | `/quiz?type=` | multiple-choice, article, listening, image, translation (typed input), ordering, mixed |
| Mistake book | `/mistakes` | Wrong answers stored as snapshots with a count; "Ôn lại" asks them again, and a correct answer resolves the mistake |
| Progress | `/progress` | Level, stat tiles, article accuracy, review-state bars, achievements, reset progress (with confirmation) |
| Search | `/search?q=` | German or Vietnamese, accents optional ("qua tao" → der Apfel) |
| Accounts | `/login`, `/register`, `/reset-password`, `/profile` | Validated forms; guest progress moves into a newly registered account |

**Navigation**
- On desktop, a header shows the logo, search box, streak, notifications and profile menu, with a 9-item nav bar below it.
- Below 900px, the nav bar is replaced by a bottom bar: 4 items plus a "Thêm" (more) sheet.

## Project structure

```
index.html                 # Loads the Be Vietnam Pro font; lang="vi"
supabase/schema.sql        # Postgres schema + RLS for the future backend (not wired up yet)
src/
  main.tsx, App.tsx        # Provider stack + routes (every page is React.lazy)
  types/models.ts          # ALL domain types: content + user progress
  constants.ts             # Labels: ROLE_LABELS, ARTICLES, SRS_LABELS, WORD_TYPE_LABELS
  data/                    # Learning content (pure data, no UI)
    vocabulary.ts          #   compact row tuples → Vocabulary[]
    topics.ts, alphabet.ts, pronunciation.ts, lessons.ts, grammar.ts,
    conversations.ts, sentences.ts, exercises.ts (listening / fill-blank / translation),
    achievements.ts        #   achievements + dailyGoals (daily challenge targets)
  services/
    content/contentRepository.ts  # ContentRepository interface; local impl dynamic-imports data/
    auth/authService.ts           # AuthService interface; LocalAuthService (SHA-256 hash, demo only)
    progressRepository.ts         # ProgressRepository interface; localStorage impl; createEmptyProgress
    audio/audioService.ts         # AudioService: recorded file first → browser TTS (de-DE) fallback
    speech/speechRecognition.ts   # SpeechRecognizer (Web Speech API) + similarity()
    srs.ts                        # Spaced repetition: intervals [1,3,7,14,30] days, grading, due queue
    quiz.ts                       # Question generators, isCorrect, personalizedArticleQuiz, phraseQuestions
    search.ts                     # fold() strips accents, search()
    selectors.ts                  # Derived stats: a1Progress, dueCount, accuracy, nextLesson…
    storage.ts                    # Safe localStorage wrapper (prefix "deutschstart.")
  context/
    ToastContext, AuthContext, ContentContext (loads content, shows full-page loader/error),
    ProgressContext (all progress mutations, rewards, persistence)
  hooks/                   # useAudio (playing state), usePopover, useDocumentTitle
  components/
    layout/                # Header, BottomNav, Layout (study timer, skip link), nav.ts
    ui/                    # AudioButton, ProgressBar, Modal, WordImage, GermanWord/Ipa/FlagDE, States
    exercises/             # QuizRunner (every question type), SentenceBuilder, SentenceSet
    vocab/                 # VocabCard, WordTile, Flashcard
    pronunciation/         # SoundCard, MouthDiagram, SpeechPractice
    alphabet/              # LetterCard, LetterTile
    common/                # PageHeader, DailyChallenge, PhraseList
    auth/AuthForm.tsx      # Field, AuthLayout, validators
    ErrorBoundary.tsx
  pages/                   # One file per route (default export); pages/auth/ for login/register/reset
  styles/global.css        # Whole design system (tokens + component classes); no CSS framework
```

The path alias `@/` maps to `src/`; it is configured in both `tsconfig.json` and `vite.config.ts`.

## Core concepts

- **Provider order** (in `App.tsx`): ErrorBoundary → BrowserRouter → Toast → Auth → Content → Progress → Suspense → Routes.
  - Content and Progress render a full-page loader until they are ready, so pages can use `useContent()` and `useProgress()` synchronously.
- **Content is data-driven.** Pages never hard-code lessons or words; they read them from `useContent()`, which also provides lookup maps: `wordById`, `lessonById`, `soundById`, `sentenceById`, `letterByChar`, `topicById`.
- **Progress** (`UserProgress` in models.ts) is one object per user id; guests use the id `'guest'`. All mutations go through `ProgressContext`:
  - The provided functions are `learnWord`, `gradeWord`, `markKnown`, `toggleSaved`, `recordAnswer`, `recordPronunciation`, `updateLesson`, `completeGrammarLesson` and a few more.
  - Every update runs `normalizeForToday` first: it resets the daily challenge on a new day and resets the streak to 0 if a day was missed.
  - Every update then runs `applyRewards`: completing the daily challenge adds 1 to the streak, and newly earned achievements are unlocked. An effect shows the toasts and saves.
- **`recordAnswer(question, correct, userAnswer)` is the single entry point for exercise results.** It:
  - updates per-skill stats and per-article stats;
  - adds to the daily counters;
  - adjusts the word's review state (a wrong answer sends it back to today's review);
  - writes or resolves the entry in the mistake book.
- **Question types** are `multiple-choice`, `article`, `listening`, `image`, `fill-blank`, `translation` and `ordering`. `QuizRunner` renders all of them. `category` decides which stat is updated: `vocab`/`quiz` → quiz, `listening` → listening, `grammar`/`article` → grammar.
- **Spaced-repetition states** are `new → learning → review → mastered`. `again` resets the word to step 0, due today; `good` moves it up one step; `easy` moves it up two steps. The due queue is sorted so words with the most wrong answers come first.
- **Audio** always goes through `audioService.play(text | {text, url}, {slow})`. A new audio provider (a cloud TTS service, for example) should implement the `AudioProvider` interface; components should not call speechSynthesis directly.
- **Swapping in a backend:** implement the `AuthService`, `ProgressRepository` and `ContentRepository` interfaces (Supabase, for example) and export the new implementation. No UI component needs to change.

## How to add content

- **A word:** add a row to `rows` in `src/data/vocabulary.ts`. The order is id, article, word, plural, type, ipa, meaning, emoji, example, exampleVi, topicId, level, difficulty, articleHint?. Quizzes, flashcards, search and topics pick it up automatically.
- **A curriculum lesson:** add an entry to `src/data/lessons.ts`. It is a list of steps; the step types are `intro`, `tip`, `phrases`, `letters`, `sounds`, `builder`, `quiz`. A quiz step is generated automatically from the lesson's phrases, letters, sounds and sentences.
- **A grammar lesson:** fill in its entry in `src/data/grammar.ts` and set `available: true`. Tables need `audioCols`, the indices of the German columns to read aloud.
- **A sentence exercise:** add it to `src/data/sentences.ts`. List the tokens in the correct order, each with a role. Put other valid word orders in `alternatives`.
- **Conversations, listening items, translations:** add them to `conversations.ts` and `exercises.ts`.

## Conventions and gotchas

- **Text:** user-facing text is in Vietnamese. Mark German text with `lang="de"` so screen readers pronounce it correctly.
- **Article colours:** der = blue, die = red, das = green (CSS classes `article-der`/`-die`/`-das`, tones `der`/`die`/`das`).
- **No flag emoji.** Windows shows 🇩🇪 as the letters "DE". Use the `<FlagDE />` component instead.
- **CSS:** the stylesheet is plain CSS with design tokens in `:root` (off-white background, ink, black/red/gold accents).
  - The `.stack-sm/md/lg` spacing rules are placed near the **end** of `global.css` on purpose, so they win over the `margin: 0` in list components. Keep them there.
- **Accessibility:**
  - Every control must work with the keyboard; visible focus comes from `:focus-visible`.
  - Audio buttons need an `aria-label`.
  - Show feedback in `role="status"` regions.
  - Honour `prefers-reduced-motion`.
- **Browser dialogs don't fit the design.** Build confirmations into the page (see the reset button on the progress page).
- Some files contain `// eslint-disable-line react-hooks/exhaustive-deps` comments even though ESLint isn't installed. They mark hook dependency arrays that deliberately leave out a value.
- **Responsive breakpoints:** 900px switches to the bottom nav and hides the hero art; 700px hides the header search box and shows a search icon instead.

## Current limitations

- Accounts and progress live in `localStorage`, so there is no sync across devices yet. `supabase/schema.sql` is ready, but the Supabase implementations have not been written.
- Audio uses the browser's text-to-speech. Quality depends on the German voices installed; Chrome and Edge include good ones.
- The microphone check (pronunciation, role-play) works only in Chrome and Edge. It compares text similarity, not real pronunciation scoring.
- Images are emoji, except `der Tisch`, which uses an inline SVG. `MediaImage.url` supports real images.
- Level 1 (A1) of the curriculum and 7 grammar lessons are shown as "Sắp có" (coming soon).
