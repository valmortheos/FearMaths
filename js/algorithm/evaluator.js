/**
 * evaluator.js — Answer Evaluator & Achievement Logic
 * Evaluates user answers and checks for unlockable achievements.
 */

export const DEFINED_ACHIEVEMENTS = [
  {
    id: 'streak_10',
    name: 'Fokus Tinggi 🎯',
    description: 'Menjawab 10 soal benar berturut-turut.',
    icon: 'fa-solid fa-fire'
  },
  {
    id: 'total_50',
    name: 'Pejuang Matematika ⚔️',
    description: 'Menyelesaikan total 50 soal.',
    icon: 'fa-solid fa-graduation-cap'
  },
  {
    id: 'nightmare_master',
    name: 'Penakluk Nightmare 😈',
    description: 'Menjawab setidaknya 1 soal level Nightmare dengan benar.',
    icon: 'fa-solid fa-skull'
  },
  {
    id: 'speed_demon',
    name: 'Kilat Berhitung ⚡',
    description: 'Menjawab benar dengan rata-rata waktu di bawah 5 detik.',
    icon: 'fa-solid fa-bolt'
  }
];

/**
 * Evaluates user answer with decimal tolerance (0.001).
 * @param {number} expected
 * @param {number|string} userRawInput
 * @returns {boolean}
 */
export function evaluateAnswer(expected, userRawInput) {
  if (userRawInput === null || userRawInput === undefined || userRawInput.toString().trim() === '') {
    return false;
  }

  // Normalize string (replace comma with dot for decimals, clean spaces)
  const normalizedStr = userRawInput.toString().trim().replace(',', '.');
  const userNum = parseFloat(normalizedStr);

  if (isNaN(userNum)) return false;

  const diff = Math.abs(expected - userNum);
  return diff < 0.001;
}

/**
 * Checks if new achievements are unlocked based on updated history.
 * @param {Array} history Entire progress history
 * @param {Array} existingAchievements Unlocked achievements list
 * @returns {Array} Newly unlocked achievements
 */
export function checkAchievements(history, existingAchievements) {
  const unlockedIds = new Set(existingAchievements.map(a => a.id));
  const newlyUnlocked = [];

  if (!history || history.length === 0) return newlyUnlocked;

  // 1. Streak 10 check
  if (!unlockedIds.has('streak_10')) {
    let currentStreak = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].correct) {
        currentStreak++;
        if (currentStreak >= 10) break;
      } else {
        break;
      }
    }
    if (currentStreak >= 10) {
      const ach = DEFINED_ACHIEVEMENTS.find(a => a.id === 'streak_10');
      if (ach) newlyUnlocked.push(ach);
    }
  }

  // 2. Total 50 questions check
  if (!unlockedIds.has('total_50')) {
    if (history.length >= 50) {
      const ach = DEFINED_ACHIEVEMENTS.find(a => a.id === 'total_50');
      if (ach) newlyUnlocked.push(ach);
    }
  }

  // 3. Nightmare master check
  if (!unlockedIds.has('nightmare_master')) {
    const nightmareCorrect = history.some(item => item.level === 'nightmare' && item.correct);
    if (nightmareCorrect) {
      const ach = DEFINED_ACHIEVEMENTS.find(a => a.id === 'nightmare_master');
      if (ach) newlyUnlocked.push(ach);
    }
  }

  // 4. Speed demon check (average time < 5s for correct answers with min 10 questions)
  if (!unlockedIds.has('speed_demon')) {
    const correctHistory = history.filter(item => item.correct);
    if (correctHistory.length >= 10) {
      const totalTime = correctHistory.reduce((sum, item) => sum + (item.timeTaken || 0), 0);
      const avgTime = totalTime / correctHistory.length;
      if (avgTime < 5.0) {
        const ach = DEFINED_ACHIEVEMENTS.find(a => a.id === 'speed_demon');
        if (ach) newlyUnlocked.push(ach);
      }
    }
  }

  return newlyUnlocked;
}
