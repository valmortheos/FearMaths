/**
 * app.js — Main Application Entry Point
 * Coordinates algorithm, UI rendering, timer, routing, and IndexedDB data binding.
 */

import { generateQuestion } from './algorithm/generator.js';
import { evaluateAnswer, checkAchievements } from './algorithm/evaluator.js';
import { saveProgress, getAllProgress, saveAchievement, getAllAchievements, resetAllData } from './db/indexedDB.js';
import { exportBinaryData, importBinaryData } from './db/exportImport.js';
import { startTimer, stopTimer } from './ui/timer.js';
import { initNavigation } from './ui/navigation.js';
import {
  renderQuestion,
  initVirtualKeypad,
  renderStats,
  renderAchievements,
  showToast,
  showAchievementToast
} from './ui/renderer.js';

let currentQuestionObj = null;
let cachedHistory = [];
let cachedAchievements = [];

/**
 * Initializes the FearMaths application.
 */
async function initApp() {
  try {
    // 1. Load Data from IndexedDB
    cachedHistory = await getAllProgress();
    cachedAchievements = await getAllAchievements();

    // 2. Setup Navbar Select Event Listeners
    const levelSelect = document.getElementById('level-select');
    const operationSelect = document.getElementById('operation-select');

    if (levelSelect) {
      levelSelect.addEventListener('change', () => loadNewQuestion());
    }
    if (operationSelect) {
      operationSelect.addEventListener('change', () => loadNewQuestion());
    }

    // 3. Setup Virtual Keypad & Quiz Form Listener
    initVirtualKeypad();

    const quizForm = document.getElementById('quiz-form');
    if (quizForm) {
      quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleAnswerSubmit();
      });
    }

    // 4. Setup Settings Listeners (Export, Import, Reset)
    setupSettingsListeners();

    // 5. Setup Navigation Routing
    initNavigation(async (activeTab) => {
      if (activeTab === 'learn') {
        if (!currentQuestionObj) {
          loadNewQuestion();
        } else {
          // Restart timer on returning to learn tab
          startTimer((formattedTime) => {
            const timerDisplay = document.getElementById('timer-display');
            if (timerDisplay) timerDisplay.textContent = formattedTime;
          });
        }
      } else {
        stopTimer();
      }

      if (activeTab === 'stats') {
        cachedHistory = await getAllProgress();
        renderStats(cachedHistory);
      } else if (activeTab === 'achievements') {
        cachedAchievements = await getAllAchievements();
        renderAchievements(cachedAchievements);
      }
    });

    // 6. Initial Question Load
    loadNewQuestion();

  } catch (error) {
    console.error('Inisialisasi aplikasi gagal:', error);
  }
}

/**
 * Generates and renders a new question, resetting and starting the timer.
 */
function loadNewQuestion() {
  const levelSelect = document.getElementById('level-select');
  const operationSelect = document.getElementById('operation-select');

  const selectedLevel = levelSelect ? levelSelect.value : 'normal';
  const selectedOperation = operationSelect ? operationSelect.value : 'acak';

  currentQuestionObj = generateQuestion(selectedLevel, selectedOperation, cachedHistory);
  renderQuestion(currentQuestionObj);

  // Start question timer
  startTimer((formattedTime) => {
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) timerDisplay.textContent = formattedTime;
  });
}

/**
 * Handles question answer submission, evaluation, saving, and achievement checks.
 */
async function handleAnswerSubmit() {
  const answerInput = document.getElementById('answer-input');
  if (!answerInput || !currentQuestionObj) return;

  const rawInput = answerInput.value.trim();
  if (rawInput === '') {
    showToast('Masukkan jawaban terlebih dahulu', 'warning');
    return;
  }

  // Stop timer & get duration
  const timeTaken = stopTimer();

  // Evaluate Answer
  const isCorrect = evaluateAnswer(currentQuestionObj.answer, rawInput);

  // Save Progress to IndexedDB
  const progressRecord = {
    level: currentQuestionObj.level,
    operation: currentQuestionObj.operation,
    question: currentQuestionObj.question,
    userAnswer: rawInput,
    correct: isCorrect,
    timeTaken: timeTaken
  };

  await saveProgress(progressRecord);
  cachedHistory = await getAllProgress();

  // Show SweetAlert2 Feedback Toast
  if (isCorrect) {
    showToast(`Benar! 🎉 (${timeTaken.toFixed(1)} detik)`, 'success');
  } else {
    showToast(`Salah! Jawaban: ${currentQuestionObj.answer}`, 'error');
  }

  // Check Achievements
  cachedAchievements = await getAllAchievements();
  const newAchievements = checkAchievements(cachedHistory, cachedAchievements);

  for (const ach of newAchievements) {
    await saveAchievement(ach);
    showAchievementToast(ach);
  }

  // Load Next Question
  loadNewQuestion();
}

/**
 * Sets up event listeners for settings tab buttons.
 */
function setupSettingsListeners() {
  const exportBtn = document.getElementById('export-btn');
  const importBtn = document.getElementById('import-btn');
  const importFileInput = document.getElementById('import-file-input');
  const resetBtn = document.getElementById('reset-btn');

  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      try {
        await exportBinaryData();
        showToast('Data biner berhasil diekspor!', 'success');
      } catch (err) {
        showToast('Gagal mengekspor data', 'error');
      }
    });
  }

  if (importBtn && importFileInput) {
    importBtn.addEventListener('click', () => {
      importFileInput.click();
    });

    importFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
          title: 'Konfirmasi Impor Data',
          text: 'Impor data akan menimpa seluruh progres dan pencapaian kamu saat ini. Lanjutkan?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#355872',
          cancelButtonColor: '#C62828',
          confirmButtonText: 'Ya, Impor Data',
          cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
          try {
            const arrayBuffer = await file.arrayBuffer();
            const summary = await importBinaryData(arrayBuffer);

            cachedHistory = await getAllProgress();
            cachedAchievements = await getAllAchievements();

            Swal.fire({
              icon: 'success',
              title: 'Impor Berhasil!',
              text: `Berhasil memulihkan ${summary.progressCount} progres dan ${summary.achievementsCount} pencapaian.`,
              confirmButtonColor: '#355872'
            });

            loadNewQuestion();
          } catch (err) {
            Swal.fire({
              icon: 'error',
              title: 'Gagal Mengimpor',
              text: err.message || 'Format file biner tidak valid.',
              confirmButtonColor: '#355872'
            });
          }
        }
      }
      importFileInput.value = ''; // Reset input
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
          title: 'Reset Seluruh Data?',
          text: 'Tindakan ini akan menghapus seluruh riwayat dan pencapaian secara permanen!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#C62828',
          cancelButtonColor: '#355872',
          confirmButtonText: 'Ya, Hapus Semua',
          cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
          await resetAllData();
          cachedHistory = [];
          cachedAchievements = [];

          Swal.fire({
            icon: 'success',
            title: 'Data Direset',
            text: 'Seluruh riwayat pengerjaan telah dibersihkan.',
            confirmButtonColor: '#355872'
          });

          loadNewQuestion();
        }
      }
    });
  }
}

// Start app on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initApp);
