import nodemailer from "nodemailer";

export const sendEmail = async (otp: string, email: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: `${email}`,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}`,
            html: `<p>Your OTP code is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
        });
    } catch (error) {
        console.log(error);
        throw new Error("Error sending email");
    }
}