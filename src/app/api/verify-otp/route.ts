import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const { email, otp, hash } = await request.json();

        if (!email || !otp || !hash) {
            return NextResponse.json(
                { error: "Email, OTP, and Hash are required" },
                { status: 400 }
            );
        }

        const [hashValue, expiresAt] = hash.split(".");
        const now = Date.now();

        // Check expiration
        if (now > parseInt(expiresAt)) {
            return NextResponse.json(
                { success: false, message: "Verification code expired" },
                { status: 400 }
            );
        }

        // Recompute Hash to Verify
        const data = `${email}.${otp}.${expiresAt}`;
        const secret = process.env.OTP_SECRET || process.env.BREVO_API_KEY || "default-dev-secret";

        const expectedHash = crypto
            .createHmac("sha256", secret)
            .update(data)
            .digest("hex");

        if (expectedHash === hashValue) {
            return NextResponse.json({
                success: true,
                message: "Email verified successfully"
            });
        } else {
            return NextResponse.json(
                { success: false, message: "Invalid verification code" },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("[OTP-VERIFY-ERROR]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
