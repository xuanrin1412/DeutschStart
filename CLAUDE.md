# DeutschStart – project guide

**DeutschStart** ("Learn German from zero") is a web app that teaches German to Vietnamese beginners who know ZERO German. The path is A0 → A1 → A2 → B1 (A0 and A1 are built; A2 and B1 are a planned roadmap).
- **Core rule: never show an unexplained German word.** Every word on screen is taught before (or in) the current lesson, glossed inline, or highlighted as "not learned yet" with a clickable explanation.
- The **UI language is Vietnamese**; German is the language being learned.
- It is built with React 18, TypeScript and Vite. The frontend is data-driven and has no backend yet: progress and accounts are stored in the browser's `localStorage`.

## Run it

Requires **Node.js 18+** (installed on this machine).

```bash
npm install
npm run dev        # dev server → http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + production build → dist/
npm run preview    # serve dist/ → http://localhost:4173
npm run check:content  # dependency rule + practice rounds + dictionary coverage (exit 1 on problems)
```

- No API keys are required.
- `.env.example` lists the optional variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and `VITE_AUDIO_BASE_URL`. Copy it to `.env.local` and never commit real keys.
- There is **no test suite and no ESLint**. Checking a change means running `npm run typecheck`, `npm run build` and (for content) `npm run check:content`, then looking at the page in a browser.

## Features and routes

| Feature | Route(s) | Notes |
|---|---|---|
| Dashboard | `/` | Hero, A1 progress %, streak, words due for review, current lesson, daily challenge, word of the day, quick links |
| Start from zero | `/learn`, `/learn/:lessonId` | 36 A0 units (ids `a0-*`) + 17 A1 units (`a1-*`) + 26 planned A2/B1 units. Each lesson: goal + prerequisites → optional warm-up review → learn steps (concepts, one word card at a time, examples) → practice rounds → mastery gate. Units unlock only when their prerequisites are mastered |
| Alphabet | `/alphabet` | A–Z + Ä Ö Ü ß. A modal card per letter: name + IPA, picture word, example, Vietnamese tip; "play whole alphabet" button |
| Vocabulary | `/vocabulary`, `/vocabulary/topic/:topicId`, `/vocabulary/word/:wordId` | 674 words (A1 word list), 24 topics, filters by review state, topic quiz, full word card: article anatomy (die + Katze), gender, plural, "Vì sao là die?", clickable example, related words, the lesson that teaches it |
| Vocabulary practice | `/vocabulary/practice` | Directions (DE→VI, VI→DE, listen, fill the sentence) × multiple choice / typing with hint; word groups; wrong words repeat; saved settings |
| Flashcards | `/flashcards?mode=new\|due\|saved`, `?topic=` | Flip card; *Không nhớ / Nhớ / Rất dễ* drive spaced repetition |
| Articles | `/articles` | der/die/das quiz weighted toward the weakest article and past mistakes; accuracy per article |
| Grammar | `/grammar`, `/grammar/:lessonId` | 23 A1 lessons (up to Perfekt and war/hatte): explanation, table with audio, highlighted structure, examples, sentence builder, mini quiz |
| Listening | `/listening` | Level 1 word → meaning, level 2 sentence recognition, level 3 fill the gap; replay and slow playback |
| Pronunciation | `/pronunciation` | 16 hard sounds (ch, r, ü, ö, ä, z, w, v, sch, sp, st, ei, ie, eu…), mouth diagram (SVG), microphone check |
| Conversations | `/conversations`, `/conversations/:convoId` | 20 scenarios, audio per line, slow mode, translation toggle, role-play mode |
| Review | `/review` | Due words (most-missed first), review-state counts, daily challenge, links |
| Reading | `/reading`, `/reading/:readingId` | 10 A1-exam-style texts (email, SMS, signs, ads, timetable) with audio, translation toggle, glossary, Richtig/Falsch questions; best score saved |
| Quiz | `/quiz?type=` | multiple-choice, article, listening, image, translation (typed input), ordering, mixed |
| Mistake book | `/mistakes` | Wrong answers stored as snapshots with a count; "Ôn lại" asks them again, and a correct answer resolves the mistake |
| Progress | `/progress` | Level, mastery per level by area and by skill (weakest skills link to practice), stat tiles, article accuracy, review-state bars, achievements, reset progress (with confirmation) |
| Search | `/search?q=` | German or Vietnamese, accents optional ("qua tao" → der Apfel) |
| Accounts | `/login`, `/register`, `/reset-password`, `/profile` | Validated forms; guest progress moves into a newly registered account |

**Navigation**
- On desktop, a header shows the logo, search box, streak, notifications and profile menu, with a 9-item nav bar below it.
- Below 900px, the nav bar is replaced by a bottom bar: 4 items plus a "Thêm" (more) sheet.

## Project structure

```
index.html                 # Loads the Be Vietnam Pro font; lang="vi"
scripts/check-content.mts  # `npm run check:content`
supabase/schema.sql        # Postgres schema + RLS for the future backend (not wired up yet)
src/
  main.tsx, App.tsx        # Provider stack + routes (every page is React.lazy)
  types/models.ts          # ALL domain types: content + user progress
  constants.ts             # Labels: ROLE_LABELS, ARTICLES, SRS_LABELS, WORD_TYPE_LABELS
  data/                    # Learning content (pure data, no UI)
    vocabulary.ts          #   compact row tuples → Vocabulary[]
    course/a0.ts           #   the 36 A0 units (explicit `teaches`, controlled examples)
    course/roadmap.ts      #   planned A2/B1 units (`available: false`)
    lessons.ts             #   A1 units (phrase format, new words derived) + export of all lessons
    lexicon.ts             #   grammar words (articles, pronouns, numbers…), phrases, names, irregular forms
    terms.ts               #   grammar terminology explained from zero ("Danh từ là gì?")
    topics.ts, alphabet.ts, pronunciation.ts, grammar.ts,
    conversations.ts, sentences.ts, exercises.ts (listening / fill-blank / translation), reading.ts,
    achievements.ts        #   achievements + dailyGoals (daily challenge targets)
  services/
    content/contentRepository.ts  # ContentRepository interface; local impl dynamic-imports data/
    auth/authService.ts           # AuthService interface; LocalAuthService (SHA-256 hash, demo only)
    progressRepository.ts         # ProgressRepository interface; localStorage impl; createEmptyProgress
    audio/audioService.ts         # AudioService: recorded file first → browser TTS (de-DE) fallback
    speech/speechRecognition.ts   # SpeechRecognizer (Web Speech API) + similarity()
    srs.ts                        # Spaced repetition: intervals [1,3,7,14,30] days, grading, due queue
    lexicon.ts                    # buildLexicon, analyze(text) → words + lexemes, wordStatus (known / lesson / unknown)
    curriculum.ts                 # buildCurriculum (teaches per lesson), knownLexemes, lessonStatus, MASTERY, levelMastery, validateCurriculum
    lessonPractice.ts             # buildPractice (10 rounds per lesson, every question tagged with a skill), buildWarmup, scoreBySkill
    vocabPractice.ts              # Vocabulary practice page: word groups, question directions
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
    text/GermanText.tsx    # German text with every word clickable; unknown words highlighted
    lesson/                # TeachWord (word card in lessons), ExampleLine, TermCard, WordAnatomy
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
- **Content is data-driven.** Pages never hard-code lessons or words; they read them from `useContent()`, which also provides lookup maps (`wordById`, `lessonById`, `soundById`, `sentenceById`, `letterByChar`, `topicById`, `termById`), the `lexicon` and the `curriculum` index.
- **Lexicon and unknown-word detection.** Every German spelling maps to a lexeme: vocabulary entries (plus generated plural, verb and adjective forms), grammar words from `data/lexicon.ts`, fixed phrases ("Guten Morgen" is matched as one unit), compounds and number words. `GermanText` analyses a text and marks each word as known, new in this lesson, glossed, or not learned yet. A learner "knows" the words of completed lessons and every word studied in flashcards/vocabulary.
- **Curriculum and mastery.** A lesson has `prerequisites`, `teaches` (A0 lists them; A1 derives them from its text), `objective`, `area`, and optional `concepts`, `patterns`, `questions`, `sentences`. Practice rounds come from what the lesson teaches; each question carries a `skill` (vocab, article, listening, sentence, grammar, pronunciation). The gate (`MASTERY` in curriculum.ts) checks the first-try score per skill; a skill with fewer than 3 questions does not gate. Failing shows the weak skills and a targeted review; passing sets `mastered` and unlocks the next units. Lessons completed before mastery existed count as mastered.
- **Progress** (`UserProgress` in models.ts) is one object per user id; guests use the id `'guest'`. All mutations go through `ProgressContext`:
  - The provided functions are `learnWord`, `gradeWord`, `markKnown`, `toggleSaved`, `recordAnswer`, `recordPronunciation`, `updateLesson`, `completeLesson` (best skill scores + mastered), `completeGrammarLesson` and a few more.
  - Every update runs `normalizeForToday` first: it resets the daily challenge on a new day and resets the streak to 0 if a day was missed.
  - Every update then runs `applyRewards`: completing the daily challenge adds 1 to the streak, and newly earned achievements are unlocked. An effect shows the toasts and saves.
- **`recordAnswer(question, correct, userAnswer)` is the single entry point for exercise results.** It:
  - updates per-skill stats (`skillStats`, used for adaptive practice) and per-article stats;
  - adds to the daily counters;
  - adjusts the word's review state (a wrong answer sends it back to today's review);
  - writes or resolves the entry in the mistake book.
- **Question types** are `multiple-choice`, `article`, `listening`, `image`, `fill-blank`, `translation`, `typing` and `ordering`. `QuizRunner` renders all of them. `category` decides which stat is updated: `vocab`/`quiz` → quiz, `listening` → listening, `grammar`/`article` → grammar.
- **Spaced-repetition states** are `new → learning → review → mastered`. `again` resets the word to step 0, due today; `good` moves it up one step; `easy` moves it up two steps. The due queue is sorted so words with the most wrong answers come first.
- **Audio** always goes through `audioService.play(text | {text, url}, {slow})`. A new audio provider (a cloud TTS service, for example) should implement the `AudioProvider` interface; components should not call speechSynthesis directly.
- **Swapping in a backend:** implement the `AuthService`, `ProgressRepository` and `ContentRepository` interfaces (Supabase, for example) and export the new implementation. No UI component needs to change.

## How to add content

- **A word:** add a row to `rows` in `src/data/vocabulary.ts`. The order is id, article, word, plural, type, ipa, meaning, emoji, example, exampleVi, topicId, level, difficulty, articleHint?. Quizzes, flashcards, search and topics pick it up automatically.
- **A curriculum lesson:** add it to `src/data/course/a0.ts` (A0) or `src/data/lessons.ts` (A1). Step types: `concept` (body + `terms` + table), `words` (lexeme ids, one card at a time, with controlled `examples`), `examples`, `phrases`, `letters`, `sounds`, `builder`, `tip`, `intro`. Practice is generated automatically – don't add quiz steps.
  - **Never introduce an unexplained word.** Every German word in an A0 lesson must be in `teaches` of this or an earlier lesson, be a name, or have a `gloss` ({ Herr: "ông" }). Run `npm run check:content` – it lists every violation.
  - Keep lessons small: 3–8 new words, one grammar concept, 1–3 sounds.
- **A grammar word, phrase or irregular form:** add it to `src/data/lexicon.ts` (ids start with `g-`; irregular verb forms go in `EXTRA_FORMS`).
- **A grammar lesson:** fill in its entry in `src/data/grammar.ts` and set `available: true`. Tables need `audioCols`, the indices of the German columns to read aloud.
- **A sentence exercise:** add it to `src/data/sentences.ts`. List the tokens in the correct order, each with a role. Put other valid word orders in `alternatives`.
- **Conversations, listening items, translations:** add them to `conversations.ts` and `exercises.ts`.
- **A reading text:** add it to `src/data/reading.ts`. `textVi` must have one entry per `text` paragraph.

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
- Content covers A0 → A1. A2 and B1 are listed on the course page as a roadmap but have no content yet.
- A1 units still use the phrase format: their new words are derived and listed automatically, but their examples were not hand-checked against the dependency rule like A0. The 23 grammar lessons (`/grammar`) are a separate library, not yet units of the course.
- Grammar example highlights use a word-boundary regex, so a highlighted word must not start or end with ä/ö/ü/ß.
