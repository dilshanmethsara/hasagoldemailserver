import { auth } from "./firebase";

interface PurchaseEmailData {
  to: string;
  userName: string;
  orderDetails: {
    orderId: string;
    gameName: string;
    amount: number;
    currency: string;
    status: string;
    purchaseDate: string;
  };
}

/**
 * Send purchase confirmation email using Vercel serverless functions
 * This sends real emails using serverless functions (free 24/7)
 */
export const sendPurchaseConfirmationEmail = async (data: PurchaseEmailData): Promise<boolean> => {
  try {
    // Try to send email using Vercel serverless function
    const response = await fetch('https://hasagoldemailserver.vercel.app/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'purchase',
        to: data.to,
        userName: data.userName,
        orderDetails: data.orderDetails
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Purchase confirmation email sent via Vercel:', result.messageId);
      return true;
    } else {
      console.log('⚠️ Vercel email function not reachable, purchase email not sent');
      return false;
    }
  } catch (error) {
    console.log('⚠️ Vercel email function not reachable');
    console.error('Purchase email error:', error);
    return false;
  }
};

/**
 * Create purchase confirmation email content
 */
export const createPurchaseEmailContent = (data: PurchaseEmailData) => {
  const { userName, orderDetails } = data;
  
  return {
    subject: `Purchase Confirmation - ${orderDetails.gameName} - HASA GOLD STORE`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Purchase Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center; color: black; }
          .content { padding: 30px; }
          .order-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Purchase Confirmed!</h1>
            <p>HASA GOLD STORE</p>
          </div>
          <div class="content">
            <h2>Thank you, ${userName}!</h2>
            <p>Your purchase has been successfully processed.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p><strong>Game:</strong> ${orderDetails.gameName}</p>
              <p><strong>Amount:</strong> ${orderDetails.currency} ${orderDetails.amount}</p>
              <p><strong>Status:</strong> ${orderDetails.status}</p>
              <p><strong>Date:</strong> ${orderDetails.purchaseDate}</p>
            </div>
            
            <p>Your game credits/top-up will be delivered shortly.</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>© 2024 HASA GOLD STORE</p>
            <p>Thank you for your business!</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};
