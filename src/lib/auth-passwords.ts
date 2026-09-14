import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

// List of high-frequency commonly breached passwords to reject
const COMMON_PASSWORDS = new Set([
  "password", "12345678", "123456789", "qwertyui", "qwertyuiop",
  "password123", "password12", "password1", "admin123", "welcome1",
  "welcome123", "pass1234", "sprintflow", "sprintflow123", "letmein123",
  "changeme", "iloveyou", "princess", "sunshine", "football",
  "monkey123", "shadow123", "master12", "trustno1", "dragon123",
  "computer", "superman", "starwars", "batman12", "whatever",
  "secret12", "default12", "testing123", "database1"
]);

export interface PasswordValidationResult {
  isValid: boolean;
  error?: string;
}

export function validatePassword(password: string): PasswordValidationResult {
  if (!password || typeof password !== "string") {
    return { isValid: false, error: "Password is required" };
  }
  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long" };
  }
  if (password.length > 128) {
    return { isValid: false, error: "Password cannot exceed 128 characters" };
  }
  if (COMMON_PASSWORDS.has(password.toLowerCase().trim())) {
    return { isValid: false, error: "Password is too common. Please choose a stronger password." };
  }
  return { isValid: true };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash) return false;

  // Check if hash is a legacy mock hash
  if (storedHash.startsWith("mock_")) {
    // TODO(phase-2): remove legacy mock_ path
    const legacyPlain = storedHash.slice(5);
    return password === legacyPlain;
  }

  // Standard bcrypt comparison
  return bcrypt.compare(password, storedHash);
}

export function isLegacyMockHash(storedHash: string): boolean {
  // TODO(phase-2): remove legacy mock_ path
  return Boolean(storedHash && storedHash.startsWith("mock_"));
}
