import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { DBconnection } from "@/app/config/DBConection";
import Project from "@/models/projectModel";

await DBconnection();

/** Helper: read & verify JWT and return userId */
function getUserIdFromReq(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        return (decoded as { id: string }).id;
    } catch {
        return null;
    }
}

/** GET /api/project/:id  -> fetch a single project (owned by user) */
export async function GET(_req: NextRequest, context: { params: { id: string } }) {
    const userId = getUserIdFromReq(_req);
    if (!userId) {
        return NextResponse.json(
            { message: "Unauthorized — no/invalid token", success: false },
            { status: 401 }
        );
    }

    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ message: "Invalid project id" }, { status: 400 });
    }

    try {
        const project = await Project.findOne({ _id: id }).lean();
        if (!project) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, project }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}

/** PUT /api/project/:id  -> update fields (edit) */
export async function PUT(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const userId = getUserIdFromReq(req);
    if (!userId) {
        return NextResponse.json(
            { message: "Unauthorized — no/invalid token", success: false },
            { status: 401 }
        );
    }

    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ message: "Invalid project id" }, { status: 400 });
    }

    try {
        // Body can contain any subset of these fields
        const { title, status, deadline, amount, framework, time, isActive } = await req.json();

        const update: Record<string, any> = {};
        if (typeof title !== "undefined") update.title = title;
        if (typeof status !== "undefined") update.status = status;
        if (typeof amount !== "undefined") update.amount = amount;
        if (typeof framework !== "undefined") update.framework = framework;
        if (typeof time !== "undefined") update.time = time;
        if (typeof isActive !== "undefined") update.isActive = isActive;
        if (typeof deadline !== "undefined") update.deadline = deadline;

        // Ownership check is enforced in the query:
        const updated = await Project.findOneAndUpdate(
            { _id: id, author: userId },
            { $set: update },
            { new: true }
        ).lean();

        if (!updated) {
            return NextResponse.json(
                { message: "Project not found or not yours" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Project updated", success: true, project: updated },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "Server error", success: false, error: error.message },
            { status: 500 }
        );
    }
}

/** DELETE /api/project/:id  -> optional */
export async function DELETE(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const userId = getUserIdFromReq(req);
    if (!userId) {
        return NextResponse.json(
            { message: "Unauthorized — no/invalid token", success: false },
            { status: 401 }
        );
    }

    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ message: "Invalid project id" }, { status: 400 });
    }

    try {
        const deleted = await Project.findOneAndDelete({ _id: id, author: userId });
        if (!deleted) {
            return NextResponse.json(
                { message: "You cannot delete this project" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}
