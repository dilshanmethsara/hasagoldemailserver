// src/lib/discord.ts
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1499718815783583895/25zI0r_3-66oExvgOukkvqXkJn9uDR-qHxwTPctfNBbDl3WhGjnx6ZvGR4Tm6DBSOKHl";

/**
 * Uploads a base64 receipt to Discord via Webhook and returns the attachment URL
 */
export const uploadReceiptToDiscord = async (base64Data: string, orderId: string) => {
  if (DISCORD_WEBHOOK_URL.includes("YOUR_DISCORD_WEBHOOK_URL_HERE")) {
    console.warn("Discord Webhook URL not set. Falling back to local storage simulation.");
    return base64Data; // Fallback to base64 if no webhook is set
  }

  try {
    // Convert base64 to Blob
    const response = await fetch(base64Data);
    const blob = await response.blob();

    // Prepare FormData
    const formData = new FormData();
    formData.append("file", blob, `receipt-${orderId}.png`);
    formData.append("content", `**New eZ Cash Receipt Uploaded**\nOrder ID: \`${orderId}\``);

    // Send to Discord
    const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      body: formData,
    });

    if (!discordRes.ok) throw new Error("Discord upload failed");

    const data = await discordRes.json();
    return data.attachments[0].url; // Return the hosted Discord image URL
  } catch (error) {
    console.error("Error uploading to Discord:", error);
    return base64Data; // Fallback
  }
};
