/**
 * Privacy & DLP (Data Loss Prevention) Engine
 * Designed for "Just Doubts" by Saitechverse Solutions
 * 
 * Strict enforcement:
 * 1. Obfuscates Indian mobile phone numbers (+91, 10-digit formats, spaced or hyphens)
 * 2. Obfuscates email addresses
 * 3. Detects contact sharing attempts in chat and WebRTC metadata
 */

// Regex patterns for Indian mobile numbers (starts with 6, 7, 8, or 9)
const PHONE_REGEXES = [
  // +91 98765 43210 or +91-9876543210 or 919876543210
  /(?:\+?91[\-\s]?)?[6789]\d{9}/g,
  // 5 digits space 5 digits (e.g. 98765 43210)
  /\b[6789]\d{4}[\s\-]?\d{5}\b/g,
  // 3 digits space 3 digits space 4 digits (e.g. 987 654 3210)
  /\b[6789]\d{2}[\s\-]?\d{3}[\s\-]?\d{4}\b/g,
];

// Standard Email Regex
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// External link / handles regex
const SOCIAL_REGEX = /(?:wa\.me|t\.me|telegram\.me|instagram\.com\/|chat\.whatsapp\.com\/)[^\s]+/gi;

export interface MaskResult {
  maskedText: string;
  hasViolation: boolean;
  violationTypes: ('phone' | 'email' | 'social')[];
}

/**
 * Masks user input text to prevent direct exchange of contact information.
 */
export function sanitizeAndMaskMessage(text: string): MaskResult {
  let masked = text;
  const violationTypes: ('phone' | 'email' | 'social')[] = [];

  // Check and mask phone numbers
  let phoneFound = false;
  PHONE_REGEXES.forEach((regex) => {
    if (regex.test(masked)) {
      phoneFound = true;
      masked = masked.replace(regex, '[Phone Number Masked by Just Doubts]');
    }
  });
  if (phoneFound) violationTypes.push('phone');

  // Check and mask email addresses
  if (EMAIL_REGEX.test(masked)) {
    violationTypes.push('email');
    masked = masked.replace(EMAIL_REGEX, '[Email Masked by Just Doubts]');
  }

  // Check and mask external social or messaging links
  if (SOCIAL_REGEX.test(masked)) {
    violationTypes.push('social');
    masked = masked.replace(SOCIAL_REGEX, '[Social Handle Masked]');
  }

  return {
    maskedText: masked,
    hasViolation: violationTypes.length > 0,
    violationTypes,
  };
}

/**
 * Masks an official phone number for UI display (e.g., +91 98******10)
 */
export function maskPhoneNumberForDisplay(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 2)}******${clean.slice(8)}`;
  } else if (clean.length > 10) {
    const last10 = clean.slice(-10);
    return `+91 ${last10.slice(0, 2)}******${last10.slice(8)}`;
  }
  return '+91 **********';
}
