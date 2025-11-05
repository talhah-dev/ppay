import { notFound } from "next/navigation";
import { DBconnection } from "@/app/config/DBConection";
import User from "@/models/userModel";
// OPTIONAL: if you use shadcn/ui
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaBackward } from "react-icons/fa";
import { ArrowBigLeftIcon } from "lucide-react";

DBconnection();

type Props = { params: { id: string } };

export default async function UserProfilePage({ params: { id } }: Props) {
    const user = await User.findById(id).select("name email avatar bio");
    if (!user) return notFound();

    const avatar = user.avatar || "/placeholder-avatar.png"; // fallback image

    return (
        <main className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-6">
            {/* Centered container */}
            <Card className="w-full max-w-xl border border-border/60 shadow-sm">
                <CardContent className="p-6">
                    {/* Avatar + Name + Email */}
                    <div className="flex flex-col items-center text-center gap-3">
                        <img
                            src={avatar}
                            alt={user.name || "User"}
                            className="h-24 w-24 rounded-2xl object-cover ring-1 ring-border/50"
                        />
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {user.name || "Unnamed User"}
                            </h1>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="my-6 h-px w-full bg-border/60" />

                    {/* Bio */}
                    {user.bio ? (
                        <p className="text-sm leading-6 text-muted-foreground text-center">
                            {user.bio}
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground/80 text-center italic">
                            No bio yet.
                        </p>
                    )}

                    {/* Actions (optional) */}
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <Button>
                            <ArrowBigLeftIcon />
                            <Link href="/dashboard/project" className="btn btn-ghost">Back</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
