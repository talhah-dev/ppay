import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { DBconnection } from "@/app/config/DBConection";
import ProjectInvite from "@/models/projectInviteModel";

await DBconnection();

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized — no token found", success: false },
                { status: 401 }
            );
        }

        // 2️⃣ Verify & decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = (decoded as { id: string }).id;

        const { inviteeId } = await request.json();

        if (!inviteeId) {
            return NextResponse.json(
                { message: "Invite ID is required", success: false },
                { status: 400 }
            );
        }

        if (inviteeId === userId) {
            return NextResponse.json({ message: 'You cannot invite yourself' }, { status: 400 });
        }

        const alreadyLinked = await ProjectInvite.exists({
            status: "accepted",
            $or: [
                { inviter: userId, invitee: inviteeId },
                { inviter: inviteeId, invitee: userId },
            ],
        });

        if (alreadyLinked) {
            return NextResponse.json(
                { message: "You are already collaborators", success: false },
                { status: 409 }
            );
        }

        const pendingExists = await ProjectInvite.exists({
            status: "pending",
            $or: [
                { inviter: userId, invitee: inviteeId },
                { inviter: inviteeId, invitee: userId },
            ],
        });

        if (pendingExists) {
            return NextResponse.json(
                { message: "An invite is already pending between you two", success: false },
                { status: 409 }
            );
        }

        const invite = await ProjectInvite.create({
            inviter: userId,
            invitee: inviteeId,
            status: 'pending',
        });

        return NextResponse.json(
            { message: "Invite sent successfully", success: true },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Invite error:", error);
        return NextResponse.json(
            {
                message: "Something went wrong while inviting user",
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}