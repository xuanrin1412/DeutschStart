# DeutschStart – Learn German from zero

A React + TypeScript web app for Vietnamese beginners learning German from A0 to A1/A2.
The UI is in Vietnamese and German is the language being taught.

## Getting started

Requires **Node.js 18+** ([nodejs.org](https://nodejs.org), LTS version).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

No API keys are needed. Audio uses the browser's German text-to-speech voice, and progress is stored in the browser.

> **Audio tip:** For the best pronunciation, install a German voice. On Windows go to *Settings → Time & language → Speech → Add voices → Deutsch*. On macOS go to *System Settings → Accessibility → Spoken content*. Chrome and Edge already include good German voices.

## What's inside (MVP)

| Area | Route | Highlights |
|---|---|---|
| Dashboard | `/` | Continue learning, A1 progress, streak, due reviews, daily challenge, word of the day |
| Start from zero | `/learn`, `/learn/:id` | 12 Level-0 lessons, step-by-step player, auto-generated quizzes |
| Alphabet | `/alphabet` | A–Z + Ä Ö Ü ß, letter name + IPA + example word/sentence, pronunciation tips |
| Vocabulary | `/vocabulary`, `/vocabulary/topic/:id`, `/vocabulary/word/:id` | 61 words across 14 topics: image, IPA, audio, article, plural, example + translation |
| Flashcards | `/flashcards` | Flip cards; *Không nhớ / Nhớ / Rất dễ* feed spaced repetition (1→3→7→14→30 days) |
| Articles | `/articles` | der/die/das quiz, per-article accuracy, questions weighted toward your weakest article |
| Grammar | `/grammar`, `/grammar/:id` | 8 full lessons (explanation, table, highlighted structure, examples, sentence builder, mini quiz) |
| Listening | `/listening` | 3 levels: word → meaning, sentence recognition, fill the gap; replay and slow mode |
| Pronunciation | `/pronunciation` | 16 difficult sounds with Vietnamese explanations, mouth diagrams, and a mic check (Chrome/Edge) |
| Conversations | `/conversations/:id` | 10 real-life dialogues with per-line audio, slow mode, translation toggle and role-play |
| Review | `/review` | Due words (most-missed first), SRS state overview, daily challenge |
| Quiz | `/quiz` | Multiple choice, article, listening, image, translation, sentence ordering |
| Mistake book | `/mistakes` | Every wrong answer is saved with a count; "Ôn lại" re-asks it |
| Progress | `/progress` | Level, vocab/grammar/listening/quiz/pronunciation stats, study time, achievements |
| Search | `/search?q=` | German or Vietnamese, with or without diacritics ("qua tao" → der Apfel) |
| Accounts | `/login`, `/register`, `/reset-password`, `/profile` | Validated forms; guest progress moves into the new account |

## Architecture

```
src/
  types/models.ts          # All domain models (content + user progress)
  data/                    # Learning content – add lessons/words here, no UI changes needed
  services/
    content/               # ContentRepository  (local files today → Supabase later)
    auth/                  # AuthService        (local demo → Supabase Auth)
    progressRepository.ts  # ProgressRepository (localStorage → Supabase tables)
    audio/                 # AudioService: recorded file → fallback to browser TTS
    speech/                # SpeechRecognizer: Web Speech API; swap for Whisper/Azure later
    srs.ts                 # Spaced-repetition scheduling
    quiz.ts                # Question generators & answer checking
    search.ts              # Diacritic-insensitive search
    selectors.ts           # Derived stats (A1 %, due count, accuracy…)
  context/                 # Content, Auth, Progress, Toast providers
  components/              # UI building blocks (QuizRunner, SentenceBuilder, Flashcard, VocabCard…)
  pages/                   # One lazy-loaded file per route
supabase/schema.sql        # Postgres schema + RLS policies for the backend
```

### Adding content

- **Vocabulary:** add a row to `src/data/vocabulary.ts`. Quizzes, flashcards, search and topics pick it up automatically.
- **A curriculum lesson:** add a `Lesson` to `src/data/lessons.ts` made of steps (`intro`, `phrases`, `letters`, `sounds`, `builder`, `quiz`, `tip`).
- **A grammar lesson:** fill in an entry in `src/data/grammar.ts` and set `available: true`.
- **A conversation:** add it to `src/data/conversations.ts`.

### Connecting a backend (Supabase)

1. Run `supabase/schema.sql` in your Supabase project.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Implement `SupabaseAuthService`, `SupabaseProgressRepository` and (optionally) `SupabaseContentRepository` against the existing interfaces, then export them instead of the local ones. No UI component needs to change.

### Recorded or AI-generated audio

Set `audio.url` on a word, or set `VITE_AUDIO_BASE_URL` to a folder or CDN of `<text>.mp3` files. `AudioService` plays the file first and falls back to TTS if the file is missing. To add a cloud TTS API, implement the `AudioProvider` interface.

## Accessibility

- Every control can be reached by keyboard. Shortcuts: 1–4 answer a quiz question; Space flips a flashcard and 1/2/3 grade it.
- The skip link, visible focus rings, labelled audio buttons, `aria-live` feedback and alt text for images all work.
- German text is marked with `lang="de"` so screen readers use a German voice.
- The layout is mobile-first and uses a bottom navigation bar on small screens. `prefers-reduced-motion` is respected.
