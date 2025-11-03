import { DBconnection } from "@/app/config/DBConection";
import Project from "@/models/projectModel";
import { NextRequest, NextResponse } from "next/server";

DBconnection()

export async function GET(request: NextRequest) {
    try {

        const { searchParams } = new URL(request.url);
        const isPaidParam = searchParams.get("isPaid"); // "true" | "false" | null

        // ✅ Build dynamic filter
        const filter: any = {};

        if (isPaidParam !== null) {
            filter.isPaid = isPaidParam === "true";
        }

        const [projects, summaryArr] = await Promise.all([
            Project.find(filter).sort({ createdAt: -1 }),
            Project.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: { $cond: [{ $eq: ["$isPaid", false] }, "$amount", 0] } },
                        pendingProject: { $sum: { $cond: [{ $in: ["$status", ["pending", "progress"]] }, 1, 0] } },
                        inactiveProject: { $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] } },
                        completedProject: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
                    }
                }
            ])
        ])


        const summary = summaryArr[0] ?? { totalAmount: 0, activeProject: 0, inactiveProject: 0, completedProject: 0 };

        return NextResponse.json({ projects, summary }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Error while getting profile", success: false, error: error }, { status: 500 })
    }
}