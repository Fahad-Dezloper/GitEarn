import crypto from 'crypto';

// Make sure you have these in your .env file
const ENCRYPTION_KEY = process.env.ENCRYPTION_SECRET_KEY;
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';

// Add validation to ensure encryption key exists
if (!ENCRYPTION_KEY) {
  console.error("ENCRYPTION_KEY environment variable is missing");
  // We'll throw the error during the encryption process for better debugging
}

/**
 * Encrypts a string using AES-256-CBC
 * @param text The text to encrypt
 * @returns The encrypted data and initialization vector
 */
export function encrypt(text: string) {
  if (!text) {
    throw new Error('Cannot encrypt empty or undefined text');
  }
  
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is missing');
  }
  
  try {
    // Create a buffer from the encryption key
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    
    // Create initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create cipher
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encryptedData: encrypted,
      iv: iv.toString('hex')
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error(`Failed to encrypt data: ${error}`);
  }
}

/**
 * Decrypts encrypted data using AES-256-CBC
 * @param encryptedData The encrypted data in hex format
 * @param iv The initialization vector in hex format
 * @returns The decrypted text
 */
export function decrypt(encryptedData: string, iv: string) {
  if (!encryptedData || !iv) {
    throw new Error('Cannot decrypt with empty data or iv');
  }
  
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is missing');
  }
  
  try {
    // Create a buffer from the encryption key
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    
    // Convert iv from hex to buffer
    const ivBuffer = Buffer.from(iv, 'hex');
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, ivBuffer);
    
    // Decrypt the data
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error(`Failed to decrypt data: ${error}`);
  }
}