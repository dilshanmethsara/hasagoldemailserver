import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  setDoc,
  updateDoc,
  deleteDoc,
  or
} from "firebase/firestore";
import { db } from "./firebase";
import { Game, GAMES } from "@/data/games";
import { sendPurchaseConfirmationEmail } from "./purchaseEmail";

// Collection Names
const GAMES_COLLECTION = "games";
const ORDERS_COLLECTION = "orders";

/**
 * Seed Database: Call this once to upload your static games to Firestore
 */
export const seedDatabase = async () => {
  try {
    for (const game of GAMES) {
      await setDoc(doc(db, GAMES_COLLECTION, game.id), {
        ...game,
        updatedAt: Timestamp.now()
      });
    }
    console.log("Database seeded successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding database:", error);
    return false;
  }
};

/**
 * Fetch all available games from Firestore
 */
export const fetchGames = async () => {
  try {
    const q = query(collection(db, GAMES_COLLECTION));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Game);
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
};

/**
 * Fetch a single game by ID
 */
export const fetchGameById = async (id: string) => {
  try {
    const docRef = doc(db, GAMES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Game;
    }
    return null;
  } catch (error) {
    console.error("Error fetching game:", error);
    return null;
  }
};

/**
 * Create a new order in Firestore
 */
export const createOrder = async (orderData: any) => {
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      status: "pending", // Default
      ...orderData,
      createdAt: Timestamp.now(),
    });
    
    // Send purchase confirmation email
    if (orderData.userEmail && orderData.gameName) {
      try {
        await sendPurchaseConfirmationEmail({
          to: orderData.userEmail,
          userName: orderData.userName || 'Customer',
          orderDetails: {
            orderId: docRef.id,
            gameName: orderData.gameName,
            amount: orderData.amount || 0,
            currency: orderData.currency || 'LKR',
            status: 'pending',
            purchaseDate: new Date().toLocaleDateString()
          }
        });
        console.log('📧 Purchase confirmation email sent to:', orderData.userEmail);
      } catch (emailError) {
        console.error('Failed to send purchase email:', emailError);
        // Don't throw error - order creation should still succeed
      }
    }
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

/**
 * Fetch a single order by ID
 */
export const fetchOrderById = async (orderId: string) => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        date: (docSnap.data().createdAt as Timestamp).toDate().toLocaleDateString(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};

/**
 * Fetch all orders for Admin view
 */

export const fetchAllOrders = async () => {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: (doc.data().createdAt as Timestamp).toDate().toLocaleDateString(),
    }));
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return [];
  }
};


/**
 * Fetch orders for a specific user
 */
/**
 * Fetch orders for a specific user (by ID or Email as fallback)
 */
export const fetchUserOrders = async (userId: string, email?: string | null) => {
  try {
    console.log("Fetching orders for:", { userId, email });
    const ordersRef = collection(db, ORDERS_COLLECTION);
    let results: any[] = [];
    
    // Query by userId without orderBy to avoid index requirements
    if (userId && userId !== "guest") {
      console.log("Querying by userId:", userId);
      const qUid = query(ordersRef, where("userId", "==", userId));
      const snapUid = await getDocs(qUid);
      const uidResults = snapUid.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Found orders by userId:", uidResults.length);
      results = uidResults;
    }

    // If email provided, also check for "guest" orders with that email
    if (email) {
      console.log("Querying guest orders by email:", email);
      const qEmail = query(ordersRef, where("userEmail", "==", email), where("userId", "==", "guest"));
      const snapEmail = await getDocs(qEmail);
      const emailResults = snapEmail.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Found guest orders by email:", emailResults.length);
      
      // Merge and remove duplicates
      const existingIds = new Set(results.map(r => r.id));
      emailResults.forEach(r => {
        if (!existingIds.has(r.id)) results.push(r);
      });
    }

    // Also try querying by email regardless of userId (for orders created with wrong userId)
    if (email && userId && userId !== "guest") {
      console.log("Querying all orders by email as fallback:", email);
      try {
        const qEmailAll = query(ordersRef, where("userEmail", "==", email));
        const snapEmailAll = await getDocs(qEmailAll);
        const emailAllResults = snapEmailAll.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Found all orders by email:", emailAllResults.length);
        
        // Merge and remove duplicates
        const existingIds = new Set(results.map(r => r.id));
        emailAllResults.forEach(r => {
          if (!existingIds.has(r.id)) {
            console.log("Adding order by email fallback:", r.id);
            results.push(r);
          }
        });
      } catch (error) {
        console.log("Email fallback query failed (permission issue):", error.message);
        // Continue with results we have so far
      }
    }

    // Sort by createdAt in memory
    results.sort((a: any, b: any) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });

    console.log("Final results:", results.length, results);
    return results;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};

/**
 * Fetch all users from Firestore with real order statistics
 */
export const fetchAllUsers = async () => {
  try {
    // Fetch all users (temporarily removing deleted filtering to isolate issue)
    const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const usersSnapshot = await getDocs(usersQuery);
    
    console.log("DEBUG: Total users fetched:", usersSnapshot.docs.length);
    usersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      console.log("DEBUG: User data:", { id: doc.id, deleted: userData.deleted, email: userData.email });
    });
    
    // Fetch all orders to calculate statistics
    const ordersQuery = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
    const ordersSnapshot = await getDocs(ordersQuery);
    
    // Convert orders to array for processing
    const allOrders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];
    
    // Process each user and calculate real statistics
    const processedUsers = usersSnapshot.docs.map(doc => {
      const userData = doc.data() as any;
      const userId = doc.id;
      
      // Calculate real order statistics for this user
      const userOrders = allOrders.filter(order => 
        order.userId === userId || 
          (order.userEmail === userData.email && order.userId === "guest")
      );
      
      const completedOrders = userOrders.filter(order => order.status === 'completed');
      const totalSpent = completedOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
      
      return {
        id: userId,
        ...userData,
        joined: (userData.createdAt as Timestamp).toDate().toLocaleDateString(),
        orders: userOrders.length, // Total orders (all statuses)
        completedOrders: completedOrders.length, // Completed orders
        spent: totalSpent, // Real total spent from completed orders
        emailVerified: userData.emailVerified !== false, // Default to true unless explicitly false
      };
    });
    
    return processedUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

/**
 * Save user data to Firestore
 */
export const saveUser = async (userId: string, data: any) => {
  try {
    await setDoc(doc(db, "users", userId), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

/**
 * Soft delete a user (mark as deleted instead of removing)
 */
export const softDeleteUser = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      deleted: true,
      deletedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log("User soft deleted:", userId);
    return true;
  } catch (error) {
    console.error("Error soft deleting user:", error);
    return false;
  }
};

/**
 * Fetch a single user by ID
 */
export const fetchUser = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      // Don't return users marked as deleted
      if (userData?.deleted) {
        return null;
      }
      return userData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

/**
 * Update user profile data
 */
export const updateUser = async (userId: string, data: any) => {
  try {
    const docRef = doc(db, "users", userId);
    await setDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
};

/**
 * Generate password reset token
 */
export const generatePasswordResetToken = async (email: string) => {
  try {
    console.log("DEBUG: Starting password reset token generation for:", email);
    
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log("DEBUG: Generated token:", token);
    
    const resetData = {
      email,
      token,
      createdAt: Timestamp.now(),
      expiresAt: new Date(Date.now() + 3600000) // 1 hour expiry
    };
    
    console.log("DEBUG: Reset data prepared:", resetData);
    console.log("DEBUG: Attempting to write to Firestore...");
    
    await setDoc(doc(db, "passwordResets", token), resetData);
    
    console.log("Password reset token generated for:", email);
    return token;
  } catch (error) {
    console.error("Error generating reset token:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return null;
  }
};

/**
 * Verify password reset token
 */
export const verifyPasswordResetToken = async (token: string) => {
  try {
    const docRef = doc(db, "passwordResets", token);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { valid: false, message: "Invalid or expired token" };
    }
    
    const resetData = docSnap.data() as any;
    const now = new Date();
    const expiresAt = resetData.expiresAt.toDate();
    
    if (now > expiresAt) {
      return { valid: false, message: "Token has expired" };
    }
    
    return { valid: true, email: resetData.email };
  } catch (error) {
    console.error("Error verifying reset token:", error);
    return { valid: false, message: "Error verifying token" };
  }
};

/**
 * Update user password
 */
export const updateUserPassword = async (userId: string, newPassword: string) => {
  try {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, {
      password: newPassword,
      updatedAt: Timestamp.now()
    });
    console.log("Password updated for user:", userId);
    return true;
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
};

/**
 * Delete password reset token
 */
export const deletePasswordResetToken = async (token: string) => {
  try {
    await deleteDoc(doc(db, "passwordResets", token));
    console.log("Password reset token deleted:", token);
    return true;
  } catch (error) {
    console.error("Error deleting password reset token:", error);
    return false;
  }
};

/**
 * Generate OTP code for email verification
 */
export const generateOTPCode = async (userId: string, email: string) => {
  try {
    console.log("DEBUG: Starting OTP generation for:", { userId, email });
    
    // Validate inputs
    if (!userId || !email) {
      console.error("DEBUG: Invalid inputs for OTP generation:", { userId, email });
      return null;
    }
    
    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("DEBUG: Generated OTP code:", otp);
    
    // Set expiry to 15 minutes from now
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    console.log("DEBUG: OTP expiry time:", expiresAt);
    
    const otpData = {
      userId,
      email,
      otp,
      createdAt: Timestamp.now(),
      expiresAt,
      used: false
    };
    
    console.log("DEBUG: OTP data to be stored:", otpData);
    
    // Store OTP in Firestore
    await setDoc(doc(db, "otpCodes", otp), otpData);
    
    console.log("✅ OTP generated successfully for:", email, "Code:", otp);
    return otp;
  } catch (error) {
    console.error("❌ Error generating OTP:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return null;
  }
};

/**
 * Verify OTP code
 */
export const verifyOTPCode = async (otp: string, email: string) => {
  try {
    const otpDoc = await getDoc(doc(db, "otpCodes", otp));
    
    if (!otpDoc.exists()) {
      console.log("OTP not found:", otp);
      return { valid: false, message: "Invalid OTP code" };
    }
    
    const otpData = otpDoc.data() as any;
    
    // Check if OTP is expired
    if (new Date() > otpData.expiresAt.toDate()) {
      console.log("OTP expired:", otp);
      return { valid: false, message: "OTP code has expired" };
    }
    
    // Check if OTP matches email and is not used
    if (otpData.email !== email || otpData.used) {
      console.log("OTP mismatch or already used:", { email: otpData.email, used: otpData.used });
      return { valid: false, message: "Invalid or already used OTP code" };
    }
    
    console.log("OTP verified successfully for:", email);
    return { valid: true, message: "OTP verified successfully" };
    
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { valid: false, message: "Error verifying OTP code" };
  }
};

/**
 * Mark OTP as used and update user email verification
 */
export const markOTPUsedAndUpdateUser = async (otp: string, userId: string) => {
  try {
    // Mark OTP as used
    await updateDoc(doc(db, "otpCodes", otp), { used: true });
    
    // Update user email verification status
    await updateDoc(doc(db, "users", userId), {
      emailVerified: true,
      emailVerifiedAt: Timestamp.now()
    });
    
    console.log("OTP marked as used and user verified:", userId);
    return true;
  } catch (error) {
    console.error("Error marking OTP as used:", error);
    return false;
  }
};

/**
 * Handle wallet top-up (simulated)
 */
export const topupWallet = async (userId: string, amount: number) => {
  try {
    const docRef = doc(db, "users", userId);
    const user = await fetchUser(userId);
    const currentBalance = (user as any)?.balance || 0;
    
    await setDoc(docRef, {
      balance: currentBalance + amount,
      updatedAt: Timestamp.now()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error topping up wallet:", error);
    return false;
  }
};

/**
 * Update the status of an order
 */
export const updateOrderStatus = async (orderId: string, status: "completed" | "failed" | "pending") => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
};

/**
 * Fetch all payment method configurations
 */
export const fetchPaymentConfigs = async () => {
  try {
    const q = query(collection(db, "payment_configs"));
    const querySnapshot = await getDocs(q);
    const configs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    if (configs.length === 0) {
      // Initialize if empty
      const initial = [
        { id: "ezcash", label: "eZ Cash", sub: "Dialog, Hutch, Airtel", number: "0775352074", name: "HASA STORE", status: "active", type: "manual" },
        { id: "bank", label: "Bank Transfer", sub: "Local Bank Transfer", bankName: "Commercial Bank", number: "8010123456", name: "HASA GOLD STORE", status: "active", type: "manual" },
        { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, Amex", status: "active", type: "automatic" }
      ];
      for (const c of initial) {
        await setDoc(doc(db, "payment_configs", c.id), c);
      }
      return initial;
    }
    
    return configs;
  } catch (error) {
    console.error("Error fetching payment configs:", error);
    return [];
  }
};

/**
 * Update a payment method configuration
 */
export const updatePaymentConfig = async (id: string, data: any) => {
  try {
    const docRef = doc(db, "payment_configs", id);
    await setDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating payment config:", error);
    return false;
  }
};
