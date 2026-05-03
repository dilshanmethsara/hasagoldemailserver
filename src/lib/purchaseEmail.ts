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
    const response = await fetch('https://hasagold-email-server.vercel.app/api/send-email', {
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
 * Create purchase confirmation email content - Attractive HASA GOLD STORE design
 */
export const createPurchaseEmailContent = (data: PurchaseEmailData) => {
  const { userName, orderDetails } = data;
  
  // Format customer name - use actual name or fallback to friendly greeting
  const customerName = userName && userName !== 'Customer' ? userName : 'Valued Customer';
  
  return {
    subject: `🎉 Purchase Confirmed - ${orderDetails.gameName} - HASA GOLD STORE`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Purchase Confirmation - HASA GOLD STORE</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: 'Poppins', Arial, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            padding: 20px; 
            line-height: 1.6;
          }
          
          .container { 
            max-width: 650px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 20px; 
            overflow: hidden; 
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
          }
          
          .header { 
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%); 
            padding: 50px 30px; 
            text-align: center; 
            position: relative;
            overflow: hidden;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px);
            background-size: 30px 30px;
            animation: shimmer 20s linear infinite;
          }
          
          @keyframes shimmer {
            0% { transform: translate(0, 0) rotate(0deg); }
            100% { transform: translate(-30px, -30px) rotate(360deg); }
          }
          
          .logo { 
            font-size: 42px; 
            font-weight: 900; 
            color: #000; 
            text-shadow: 3px 3px 6px rgba(0,0,0,0.1); 
            margin-bottom: 10px; 
            position: relative;
            z-index: 1;
            letter-spacing: 2px;
          }
          
          .tagline { 
            color: #000; 
            font-size: 16px; 
            font-weight: 600; 
            opacity: 0.9; 
            position: relative;
            z-index: 1;
            text-transform: uppercase;
            letter-spacing: 3px;
          }
          
          .success-badge {
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 18px;
            display: inline-block;
            margin-top: 20px;
            box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
            position: relative;
            z-index: 1;
          }
          
          .content { 
            padding: 50px 40px; 
            background: #ffffff;
          }
          
          .greeting { 
            font-size: 32px; 
            font-weight: 700; 
            color: #333; 
            margin-bottom: 15px; 
            text-align: center;
          }
          
          .customer-name {
            color: #FFA500;
            font-weight: 900;
          }
          
          .message { 
            font-size: 16px; 
            color: #666; 
            margin-bottom: 30px; 
            line-height: 1.8; 
            text-align: center;
          }
          
          .order-card { 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
            padding: 30px; 
            border-radius: 16px; 
            margin: 30px 0; 
            border-left: 5px solid #FFD700;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          }
          
          .order-card h3 {
            color: #333;
            font-size: 22px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .order-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px dashed #dee2e6;
          }
          
          .order-row:last-child {
            border-bottom: none;
          }
          
          .order-label {
            font-weight: 600;
            color: #495057;
          }
          
          .order-value {
            font-weight: 700;
            color: #333;
          }
          
          .amount-value {
            color: #28a745;
            font-size: 20px;
          }
          
          .status-badge {
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #000;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
          }
          
          .info-box {
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            border: 2px solid #FFD700;
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
          }
          
          .info-box h4 {
            color: #856404;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .info-box p {
            color: #856404;
            font-size: 14px;
            margin: 5px 0;
          }
          
          .footer { 
            background: linear-gradient(135deg, #2c3e50, #34495e); 
            color: #ecf0f1; 
            padding: 40px; 
            text-align: center; 
          }
          
          .footer-logo { 
            font-size: 28px; 
            font-weight: 900; 
            color: #FFD700; 
            margin-bottom: 15px; 
            letter-spacing: 2px;
          }
          
          .footer-links {
            margin: 20px 0;
          }
          
          .footer-links a {
            color: #FFD700;
            text-decoration: none;
            margin: 0 15px;
            font-size: 14px;
            font-weight: 600;
          }
          
          .copyright {
            font-size: 12px;
            color: #95a5a6;
            margin-top: 20px;
          }
          
          @media (max-width: 600px) {
            .content { padding: 30px 20px; }
            .logo { font-size: 32px; }
            .greeting { font-size: 24px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">� HASA GOLD STORE</div>
            <div class="tagline">Premium Game Top-Up Services</div>
            <div class="success-badge">✓ Purchase Confirmed</div>
          </div>
          
          <div class="content">
            <h2 class="greeting">Thank You, <span class="customer-name">${customerName}</span>! 🎮</h2>
            
            <p class="message">
              Your purchase has been successfully processed and confirmed. We're preparing your game credits for immediate delivery!
            </p>
            
            <div class="order-card">
              <h3>📋 Order Summary</h3>
              
              <div class="order-row">
                <span class="order-label">Order ID:</span>
                <span class="order-value">${orderDetails.orderId}</span>
              </div>
              
              <div class="order-row">
                <span class="order-label">Game:</span>
                <span class="order-value">${orderDetails.gameName}</span>
              </div>
              
              <div class="order-row">
                <span class="order-label">Amount Paid:</span>
                <span class="order-value amount-value">LKR ${orderDetails.amount.toLocaleString()}</span>
              </div>
              
              <div class="order-row">
                <span class="order-label">Status:</span>
                <span class="status-badge">${orderDetails.status}</span>
              </div>
              
              <div class="order-row">
                <span class="order-label">Purchase Date:</span>
                <span class="order-value">${orderDetails.purchaseDate}</span>
              </div>
            </div>
            
            <div class="info-box">
              <h4>⏱️ What's Next?</h4>
              <p>• Your game credits will be delivered within 5-10 minutes</p>
              <p>• You'll receive a notification once delivery is complete</p>
              <p>• Keep this email as your purchase receipt</p>
            </div>
            
            <p class="message">
              If you have any questions or concerns, our 24/7 support team is ready to help you!
            </p>
          </div>
          
          <div class="footer">
            <div class="footer-logo">HASA GOLD STORE</div>
            
            <div class="footer-links">
              <a href="https://hasagold.store">Website</a>
              <a href="https://hasagold.store/support">Support</a>
              <a href="https://hasagold.store/contact">Contact</a>
            </div>
            
            <div class="copyright">
              © 2024 HASA GOLD STORE. All rights reserved.<br>
              This email was sent to ${data.to} regarding your recent purchase.
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};
