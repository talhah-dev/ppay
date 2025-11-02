"use client"

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    Heart,
    LogOut,
    Sparkles,
    User,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getProfile, logout } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function NavUser({
    // user,
}: {
        // user: {
        //     name: string
        //     email: string
        //     avatar: string
        // }
    }) {
    const { isMobile } = useSidebar()

    const router = useRouter();

    const { data, isError, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    });

    const { mutate } = useMutation({
        mutationFn: logout, onSuccess: () => {
            toast.success("Logged out successfully");
            router.push("/login");
        },
    });



    if (isLoading) return <div>
        <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 bg-zinc-200 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 bg-zinc-200 w-[150px]" />
                <Skeleton className="h-4 bg-zinc-200 w-[80px]" />
            </div>
        </div>
    </div>;
    if (isError) return <div>Error loading profile</div>;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={data.avatar} alt={data.username} />
                                <AvatarFallback className="rounded-lg">{data.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{data.username}</span>
                                <span className="truncate text-xs">{data.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <Link href={"/dashboard/profile"}>
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={data.avatar} alt={data.username} />
                                        <AvatarFallback className="rounded-lg">{data.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{data.username}</span>
                                        <span className="truncate text-xs">{data.email}</span>
                                    </div>
                                </div>
                            </Link>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Heart />
                                Donation
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <Link href={"/dashboard/profile"}>
                                <DropdownMenuItem>
                                    <User />
                                    Profile
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>
                                <CreditCard />
                                Payments
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => mutate()}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
