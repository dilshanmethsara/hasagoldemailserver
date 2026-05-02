import { auth } from "./firebase";
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

/**
 * Manually verify a user's email in Firebase
 * This bypasses the email verification requirement
 */
export const manuallyVerifyEmail = async (user: any) => {
  try {
    // Firebase doesn't allow direct email verification without actual verification
    // But we can work around this by using a custom token approach
    // For now, we'll handle this in the frontend by skipping the emailVerified check
    
    console.log("Manual email verification bypass activated");
    return true;
  } catch (error) {
    console.error("Error with manual verification:", error);
    return false;
  }
};

/**
 * Create a custom token for email verification bypass
 * This is a workaround for Firebase's email verification
 */
export const createEmailVerificationBypass = async (email: string, password: string) => {
  try {
    // This would normally require Firebase Admin SDK
    // For frontend, we'll handle this differently
    console.log("Email verification bypass for:", email);
    return true;
  } catch (error) {
    console.error("Error creating bypass:", error);
    return false;
  }
};

/**
 * Check if user should bypass email verification
 */
export const shouldBypassEmailVerification = (email: string) => {
  // List of emails that should bypass verification
  const bypassEmails = [
    'dmcreatorstudio04@proton.me',
    // Add more emails here if needed
  ];
  
  return bypassEmails.includes(email);
};
