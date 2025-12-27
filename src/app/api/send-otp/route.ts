import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const { email, name } = await request.json();

        if (!email || !name) {
            return NextResponse.json(
                { error: "Email and Name are required" },
                { status: 400 }
            );
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log(`[OTP-DEBUG] Generated OTP for ${email}: ${otp}`);

        // Generate Secure Hash (Stateless Verification)
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
        const data = `${email}.${otp}.${expiresAt}`;
        const secret = process.env.OTP_SECRET || process.env.BREVO_API_KEY || "default-dev-secret";

        const hash = crypto
            .createHmac("sha256", secret)
            .update(data)
            .digest("hex");

        // Send via Brevo
        const apiKey = process.env.BREVO_API_KEY;

        // Debug API Key loading (masked)
        if (apiKey) {
            console.log(`[OTP-DEBUG] Using API Key starting with: ${apiKey.substring(0, 10)}...`);
        } else {
            console.error("[OTP-ERROR] BREVO_API_KEY is missing in environment variables!");
        }

        let emailSent = false;

        if (apiKey) {
            try {
                const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                    method: "POST",
                    headers: {
                        "accept": "application/json",
                        "api-key": apiKey,
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({
                        sender: { name: "ThriveUp", email: "guptayas9837@gmail.com" }, // Verified sender
                        to: [{ email: email, name: name }],
                        subject: "Your ThriveUp Verification Code",
                        htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #FF5900 0%, #FF8C00 100%); padding: 40px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ThriveUp</h1>
                                    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Email Verification</p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px;">
                                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Verify Your Email Address</h2>
                                    <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                                        Thank you for signing up with ThriveUp! To complete your registration, please use the verification code below:
                                    </p>
                                    
                                    <!-- OTP Box -->
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td align="center" style="padding: 30px 0;">
                                                <div style="background-color: #f9fafb; border: 2px dashed #FF5900; border-radius: 12px; padding: 20px; display: inline-block;">
                                                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                                                    <p style="margin: 0; color: #1f2937; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="color: #6b7280; margin: 30px 0 0 0; font-size: 14px; line-height: 1.6;">
                                        This code will expire in <strong>5 minutes</strong>. If you didn't request this code, please ignore this email.
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                                        Need help? Contact us at <a href="mailto:support@thriveup.com" style="color: #FF5900; text-decoration: none;">support@thriveup.com</a>
                                    </p>
                                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                        © 2025 ThriveUp. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
            `,
                    }),
                });

                if (response.ok) {
                    emailSent = true;
                    console.log(`[OTP-DEBUG] Email sent successfully to ${email}`);
                } else {
                    const errorData = await response.json();
                    console.error("[OTP-ERROR] Failed to send email via Brevo:", errorData);
                    return NextResponse.json({
                        success: false,
                        message: "Failed to send email. Check API Key or Sender.",
                        error: errorData
                    }, { status: 500 });
                }
            } catch (error) {
                console.error("[OTP-ERROR] Error calling Brevo API:", error);
                return NextResponse.json({
                    success: false,
                    message: "Network error sending email",
                    error: String(error)
                }, { status: 500 });
            }
        } else {
            console.warn("[OTP-WARN] No BREVO_API_KEY found. Mocking send.");
        }

        return NextResponse.json({
            success: true,
            message: emailSent ? "Verification code sent" : "Verification simulated",
            hash: `${hash}.${expiresAt}`,
            email: email
        });

    } catch (error) {
        console.error("[OTP-ERROR] Internal Server Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
