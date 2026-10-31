import { supabase } from './supabase';
import { fetchSiteSettings } from './api';
import type { SiteSettings } from '@/types/database';

export const SUSPENSION_TOKEN = '__SUPABASE_SUSPENDED__';
const STORAGE_KEY = '__amkas_site_suspended__';
const MASTER_PIN_STORAGE_KEY = '__amkas_master_pin__';
export const DEFAULT_MASTER_PIN = 'amkas2026';

/**
 * Checks if the site is marked as suspended based on SiteSettings or local cache.
 */
export function isSiteSuspended(settings?: SiteSettings | null): boolean {
  if (settings && typeof settings.seo_keywords === 'string') {
    return settings.seo_keywords.includes(SUSPENSION_TOKEN);
  }
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Strips the suspension token so that admins viewing SEO Keywords in AdminSettings
 * never see any trace of the hidden switch.
 */
export function cleanKeywordsForDisplay(keywords?: string | null): string {
  if (!keywords) return '';
  return keywords.replace(new RegExp(`\\s*${SUSPENSION_TOKEN}\\s*`, 'g'), ' ').trim();
}

/**
 * Preserves the suspension state when saving SiteSettings from AdminSettings.
 */
export function prepareKeywordsForSave(cleanKeywords: string, wasSuspended: boolean): string {
  const clean = cleanKeywords ? cleanKeywords.replace(new RegExp(`\\s*${SUSPENSION_TOKEN}\\s*`, 'g'), '').trim() : '';
  if (wasSuspended) {
    return clean ? `${clean} ${SUSPENSION_TOKEN}` : SUSPENSION_TOKEN;
  }
  return clean;
}

/**
 * Direct check of the current suspension status against Supabase.
 */
export async function checkCurrentSuspensionStatus(): Promise<boolean> {
  try {
    const settings = await fetchSiteSettings();
    const suspended = isSiteSuspended(settings);
    try {
      localStorage.setItem(STORAGE_KEY, suspended ? 'true' : 'false');
    } catch {}
    return suspended;
  } catch (err) {
    console.warn('[SiteSuspension] Fallback to cached state:', err);
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }
}

/**
 * Toggles the site suspension flag in Supabase site_settings and local cache.
 */
export async function toggleSiteSuspension(targetSuspended: boolean): Promise<boolean> {
  const currentSettings = await fetchSiteSettings();
  const currentCleanKeywords = cleanKeywordsForDisplay(currentSettings.seo_keywords);
  const updatedKeywords = prepareKeywordsForSave(currentCleanKeywords, targetSuspended);

  // Update in Supabase site_settings table (id: 1)
  const { error } = await supabase
    .from('site_settings')
    .update({
      seo_keywords: updatedKeywords,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1);

  if (error) {
    throw error;
  }

  try {
    localStorage.setItem(STORAGE_KEY, targetSuspended ? 'true' : 'false');
    // Dispatch storage event so other tabs on the same origin react instantly
    window.dispatchEvent(new Event('amkas_suspension_change'));
  } catch {}

  return targetSuspended;
}

/**
 * Master PIN verification helper
 */
export function verifyMasterPin(inputPin: string): boolean {
  let storedPin = DEFAULT_MASTER_PIN;
  try {
    storedPin = localStorage.getItem(MASTER_PIN_STORAGE_KEY) || DEFAULT_MASTER_PIN;
  } catch {}
  return inputPin.trim() === storedPin;
}

export function updateMasterPin(newPin: string): void {
  try {
    localStorage.setItem(MASTER_PIN_STORAGE_KEY, newPin.trim());
  } catch {}
}
