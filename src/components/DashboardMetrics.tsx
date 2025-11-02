import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ActivityIcon, Book } from "lucide-react"
import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/lib/api'

export default function DashboardMetrics() {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: getProjects,
    })

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error: {isError}</div>
    }

    return (
        <div className="w-full p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Payment</CardTitle>
                        Rs
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">Rs {data.summary.totalAmount}</div>
                        <p className="text-xs text-muted-foreground">
                            From last 17 date
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Project</CardTitle>
                        <Book className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">{data.summary.completedProject}</div>
                        <p className="text-xs text-muted-foreground">
                            From last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                        <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">{data.summary.activeProject}</div>
                        <p className="text-xs text-muted-foreground">
                            Since last hour
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
