import type { UserProgress } from '@/types/models';
import { storage } from './storage';
import { today } from './srs';

/**
 * Where learner progress lives. Local implementation today; a Supabase implementation would
 * read/write the user_progress, user_vocabulary, review_schedule and mistakes tables
 * (see supabase/schema.sql) so progress syncs across devices.
 */
export interface ProgressRepository {
  load(userId: string): Promise<UserProgress | null>;
  save(progress: UserProgress): Promise<void>;
  remove(userId: string): Promise<void>;
}

class LocalProgressRepository implements ProgressRepository {
  async load(userId: string) {
    return storage.get<UserProgress | null>(`progress.${userId}`, null);
  }
  async save(progress: UserProgress) {
    storage.set(`progress.${progress.userId}`, progress);
  }
  async remove(userId: string) {
    storage.remove(`progress.${userId}`);
  }
}

export const progressRepository: ProgressRepository = new LocalProgressRepository();

export function createEmptyProgress(userId: string): UserProgress {
  return {
    userId,
    version: 1,
    vocabulary: {},
    articleStats: { der: { correct: 0, total: 0 }, die: { correct: 0, total: 0 }, das: { correct: 0, total: 0 } },
    listening: { correct: 0, total: 0 },
    quiz: { correct: 0, total: 0 },
    grammar: { correct: 0, total: 0 },
    pronunciation: { practiced: 0, matched: 0, sounds: [] },
    lessons: {},
    grammarLessons: {},
    mistakes: {},
    alphabetSeen: [],
    streak: { current: 0, longest: 0 },
    daily: { date: today(), words: 0, grammar: 0, listening: 0, quiz: 0, pronunciation: 0, rewarded: false },
    studySeconds: 0,
    achievements: {},
  };
}
