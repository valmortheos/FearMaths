/**
 * timer.js — Question Timer for FearMaths
 * Real-time question duration counter.
 */

let timerInterval = null;
let startTime = 0;
let elapsedTime = 0;

/**
 * Starts the timer for a question.
 * @param {Function} onTick Callback receiving current elapsed time formatted (e.g. "2.4s")
 */
export function startTimer(onTick) {
  stopTimer(); // Ensure any existing timer is cleared
  startTime = performance.now();
  elapsedTime = 0;

  timerInterval = setInterval(() => {
    const now = performance.now();
    elapsedTime = (now - startTime) / 1000;
    if (typeof onTick === 'function') {
      onTick(elapsedTime.toFixed(1) + 's');
    }
  }, 100);
}

/**
 * Stops the timer and returns total time taken in seconds (number).
 * @returns {number} Time taken in seconds with 2 decimal precision
 */
export function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  const now = performance.now();
  if (startTime > 0) {
    elapsedTime = (now - startTime) / 1000;
  }
  return parseFloat(elapsedTime.toFixed(2));
}

/**
 * Resets the timer display state.
 */
export function resetTimer() {
  stopTimer();
  startTime = 0;
  elapsedTime = 0;
}
