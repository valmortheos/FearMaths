/**
 * exportImport.js — Binary Export & Import for FearMaths
 * Handles custom 16-byte header binary serialization (.fmd files).
 *
 * Header Specification (16 bytes):
 * - Magic Number (4B): "FEAR" (ASCII 0x46 0x45 0x41 0x52)
 * - Version (1B): 1 (uint8)
 * - Padding (3B): 0, 0, 0
 * - Timestamp (4B): Epoch seconds (uint32, Big-Endian)
 * - Data Length (4B): JSON payload length in bytes (uint32, Big-Endian)
 * - Payload: UTF-8 JSON payload string ({ progress: [], achievements: [] })
 */

import { getAllProgress, getAllAchievements, resetAllData, saveProgress, saveAchievement } from './indexedDB.js';

const MAGIC_NUMBER = 'FEAR';
const FORMAT_VERSION = 1;
const HEADER_SIZE = 16;

/**
 * Exports IndexedDB progress and achievements into a custom binary file (.fmd).
 */
export async function exportBinaryData() {
  const progress = await getAllProgress();
  const achievements = await getAllAchievements();

  const exportPayload = {
    progress,
    achievements,
    exportedAt: new Date().toISOString()
  };

  const jsonString = JSON.stringify(exportPayload);
  const encoder = new TextEncoder();
  const jsonBytes = encoder.encode(jsonString);

  const payloadLength = jsonBytes.byteLength;
  const epochSeconds = Math.floor(Date.now() / 1000);

  const buffer = new ArrayBuffer(HEADER_SIZE + payloadLength);
  const dataView = new DataView(buffer);
  const uint8Array = new Uint8Array(buffer);

  // 1. Magic Number "FEAR" (4 bytes)
  for (let i = 0; i < MAGIC_NUMBER.length; i++) {
    uint8Array[i] = MAGIC_NUMBER.charCodeAt(i);
  }

  // 2. Version (1 byte)
  uint8Array[4] = FORMAT_VERSION;

  // 3. Padding (3 bytes: indices 5, 6, 7)
  uint8Array[5] = 0;
  uint8Array[6] = 0;
  uint8Array[7] = 0;

  // 4. Timestamp uint32 Big-Endian (4 bytes: indices 8-11)
  dataView.setUint32(8, epochSeconds, false);

  // 5. Data Length uint32 Big-Endian (4 bytes: indices 12-15)
  dataView.setUint32(12, payloadLength, false);

  // Payload: Write JSON Bytes starting at offset 16
  uint8Array.set(jsonBytes, HEADER_SIZE);

  // Trigger browser download
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `FearMaths_Backup_${dateStr}.fmd`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Imports binary file (.fmd / ArrayBuffer), validates header, and overwrites IndexedDB data.
 * @param {ArrayBuffer} arrayBuffer
 * @returns {Promise<Object>} Import summary
 */
export async function importBinaryData(arrayBuffer) {
  if (arrayBuffer.byteLength < HEADER_SIZE) {
    throw new Error('File tidak valid: ukuran file terlalu kecil.');
  }

  const dataView = new DataView(arrayBuffer);
  const uint8Array = new Uint8Array(arrayBuffer);

  // Validate Magic Number
  const magicStr = String.fromCharCode(uint8Array[0], uint8Array[1], uint8Array[2], uint8Array[3]);
  if (magicStr !== MAGIC_NUMBER) {
    throw new Error('File tidak valid: Magic header ("FEAR") tidak ditemukan.');
  }

  // Validate Version
  const version = uint8Array[4];
  if (version !== FORMAT_VERSION) {
    throw new Error(`File tidak kompatibel: versi header ${version} tidak didukung.`);
  }

  const epochSeconds = dataView.getUint32(8, false);
  const payloadLength = dataView.getUint32(12, false);

  if (arrayBuffer.byteLength < HEADER_SIZE + payloadLength) {
    throw new Error('File rusak: ukuran payload tidak sesuai dengan header.');
  }

  // Read JSON Payload
  const jsonBytes = uint8Array.subarray(HEADER_SIZE, HEADER_SIZE + payloadLength);
  const decoder = new TextDecoder('utf-8');
  const jsonString = decoder.decode(jsonBytes);

  let payload;
  try {
    payload = JSON.parse(jsonString);
  } catch (e) {
    throw new Error('Gagal membaca data JSON dari file biner.');
  }

  if (!payload || !Array.isArray(payload.progress) || !Array.isArray(payload.achievements)) {
    throw new Error('Format isi data biner tidak sesuai.');
  }

  // Clear existing database and overwrite
  await resetAllData();

  for (const item of payload.progress) {
    const { id, ...progressData } = item; // Remove old autoincrement ID
    await saveProgress(progressData);
  }

  for (const ach of payload.achievements) {
    await saveAchievement(ach);
  }

  return {
    progressCount: payload.progress.length,
    achievementsCount: payload.achievements.length,
    exportedAt: payload.exportedAt || new Date(epochSeconds * 1000).toISOString()
  };
}
