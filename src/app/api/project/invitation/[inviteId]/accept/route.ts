import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { DBconnection } from "@/app/config/DBConection";
import ProjectInvite from "@/models/projectInviteModel";

await DBconnection();

export async function POST(request: NextRequest, { params }: { params: Promise<{ inviteId: string }> }) {
    try {
        // 1️⃣ Verify token
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized — no token found", success: false }, { status: 401 });
        }

        let userId: string;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
            userId = decoded.id;
        } catch {
            return NextResponse.json({ message: "Invalid token", success: false }, { status: 401 });
        }

        const { inviteId } = await params;

        // 2️⃣ Find the invite
        const invite = await ProjectInvite.findById(inviteId);
        if (!invite) {
            return NextResponse.json({ message: "Invite not found", success: false }, { status: 404 });
        }

        // 3️⃣ Validate ownership
        if (String(invite.invitee) !== userId) {
            return NextResponse.json({ message: "You are not the invitee", success: false }, { status: 403 });
        }

        // 4️⃣ Check status
        if (invite.status === "accepted") {
            return NextResponse.json({ message: "Invite already accepted", success: false }, { status: 409 });
        }
        if (invite.status === "declined") {
            return NextResponse.json({ message: "Invite was declined", success: false }, { status: 409 });
        }

        // 5️⃣ Accept invite
        invite.status = "accepted";
        await invite.save();

        return NextResponse.json({ message: "Invite accepted successfully", success: true }, { status: 200 });
    } catch (error: any) {
        console.error("Accept invite error:", error);
        return NextResponse.json(
            { message: "Failed to accept invite", success: false, error: error.message },
            { status: 500 }
        );
    }
}
