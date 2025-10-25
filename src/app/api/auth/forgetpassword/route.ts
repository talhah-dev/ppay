import { DBconnection } from "@/app/config/DBConection";
import { sendEmail } from "@/helpers/sendEmail";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

await DBconnection()

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                {
                    message: "All fields are required",
                    success: false,
                }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                {
                    message: "User doesn't exists",
                    success: false,
                }, { status: 400 });
        }

        const otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 min
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.otp = otp;
        user.otpExpire = otpExpire;

        await user.save();

        await sendEmail(otp, email);

        return NextResponse.json(
            {
                message: "OTP sent successfully.",
                success: true,
            }, { status: 201 });

    } catch (error) {
        console.error("forget password error: ", error);
        return NextResponse.json(
            {
                message: "Something went wrong in the forget server",
                success: false,
            }, { status: 500 });
    }
}