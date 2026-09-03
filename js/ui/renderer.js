/**
 * renderer.js — UI Renderer & DOM Controller
 * Handles UI interactions, question rendering, virtual keypad, stats display, and SweetAlert2 toasts.
 */

import { DEFINED_ACHIEVEMENTS } from '../algorithm/evaluator.js';

/**
 * Shows a SweetAlert2 Toast notification.
 */
export function showToast(title, icon = 'success') {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: icon,
      title: title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });
  }
}

/**
 * Shows an Achievement Unlock Toast.
 */
export function showAchievementToast(achievement) {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Lencana Terbuka! 🏆`,
      text: `${achievement.name} — ${achievement.description}`,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true
    });
  }
}

/**
 * Updates Question Display in UI.
 */
export function renderQuestion(questionObj) {
  const qEl = document.getElementById('question-text');
  const badgeEl = document.getElementById('quiz-level-badge');
  const inputEl = document.getElementById('answer-input');

  if (qEl) qEl.textContent = questionObj.question + ' = ?';
  if (badgeEl) {
    badgeEl.textContent = `${questionObj.level.toUpperCase()} (${questionObj.operation})`;
  }
  if (inputEl) {
    inputEl.value = '';
    inputEl.focus();
  }
}

/**
 * Initializes Virtual Numeric Keypad listeners.
 */
export function initVirtualKeypad(onInputSubmit) {
  const inputEl = document.getElementById('answer-input');
  const clearBtn = document.getElementById('clear-btn');
  const keypad = document.querySelector('.virtual-keypad');

  if (clearBtn && inputEl) {
    clearBtn.addEventListener('click', () => {
      inputEl.value = '';
      inputEl.focus();
    });
  }

  if (keypad && inputEl) {
    keypad.addEventListener('click', (e) => {
      const btn = e.target.closest('.keypad-btn');
      if (!btn) return;

      const key = btn.getAttribute('data-key');
      if (!key) return;

      if (key === 'backspace') {
        inputEl.value = inputEl.value.slice(0, -1);
      } else if (key === '-') {
        // Toggle negative sign or add decimal
        if (inputEl.value === '') {
          inputEl.value = '-';
        } else if (!inputEl.value.includes('.')) {
          inputEl.value += '.';
        }
      } else {
        inputEl.value += key;
      }
      inputEl.focus();
    });
  }
}

/**
 * Renders Statistics Tab data.
 */
export function renderStats(history) {
  const totalEl = document.getElementById('stat-total-questions');
  const accuracyEl = document.getElementById('stat-accuracy');
  const avgTimeEl = document.getElementById('stat-avg-time');
  const streakEl = document.getElementById('stat-current-streak');
  const historyTableBody = document.getElementById('history-table-body');

  if (!history || history.length === 0) {
    if (totalEl) totalEl.textContent = '0';
    if (accuracyEl) accuracyEl.textContent = '0%';
    if (avgTimeEl) avgTimeEl.textContent = '0s';
    if (streakEl) streakEl.textContent = '0';
    if (historyTableBody) {
      historyTableBody.innerHTML = `<tr><td colspan="6" class="text-center">Belum ada riwayat pengerjaan.</td></tr>`;
    }
    return;
  }

  const total = history.length;
  const correctCount = history.filter(h => h.correct).length;
  const accuracy = Math.round((correctCount / total) * 100);

  const totalTime = history.reduce((sum, h) => sum + (h.timeTaken || 0), 0);
  const avgTime = (totalTime / total).toFixed(1);

  // Calculate current streak
  let currentStreak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].correct) {
      currentStreak++;
    } else {
      break;
    }
  }

  if (totalEl) totalEl.textContent = total.toString();
  if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;
  if (avgTimeEl) avgTimeEl.textContent = `${avgTime}s`;
  if (streakEl) streakEl.textContent = currentStreak.toString();

  // Render History Table (Last 15)
  if (historyTableBody) {
    const recentHistory = [...history].reverse().slice(0, 15);
    historyTableBody.innerHTML = recentHistory.map(item => {
      const timeStr = item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
      const statusBadge = item.correct
        ? `<span class="badge-status badge-status--success">Benar</span>`
        : `<span class="badge-status badge-status--danger">Salah</span>`;

      return `
        <tr>
          <td>${timeStr}</td>
          <td><strong style="text-transform: uppercase;">${item.level}</strong></td>
          <td>${item.question}</td>
          <td>${item.userAnswer}</td>
          <td>${statusBadge}</td>
          <td>${item.timeTaken ? item.timeTaken.toFixed(1) + 's' : '-'}</td>
        </tr>
      `;
    }).join('');
  }
}

/**
 * Renders Achievements Tab.
 */
export function renderAchievements(unlockedAchievements) {
  const container = document.getElementById('achievements-container');
  if (!container) return;

  const unlockedMap = new Map(unlockedAchievements.map(a => [a.id, a]));

  container.innerHTML = DEFINED_ACHIEVEMENTS.map(ach => {
    const isUnlocked = unlockedMap.has(ach.id);
    const unlockedRecord = unlockedMap.get(ach.id);
    const timeStr = isUnlocked && unlockedRecord.unlockedAt
      ? new Date(unlockedRecord.unlockedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      : '';

    return `
      <div class="achievement-card ${isUnlocked ? 'achievement-card--unlocked' : ''}">
        <div class="achievement-card__icon">
          <i class="${ach.icon}"></i>
        </div>
        <div class="achievement-card__info">
          <h3>${ach.name}</h3>
          <p>${ach.description}</p>
          ${isUnlocked ? `<div class="achievement-card__time"><i class="fa-solid fa-circle-check"></i> Terbuka ${timeStr}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}
