"use client"
import UserWrapper from '@/app/wrapper/UserWrapper'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getProjects } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

interface Project {
    title: string,
    amount: number,
    deadline: string,
    status: string,
    framework: string,
    author?: string,
    isActive: boolean,
    time: string,
    _id: string,
    isPaid: boolean,
}

export default function page() {

    const { data, isLoading, isError } = useQuery({
        queryKey: ["projects"],
        queryFn: () => getProjects()
    })


    if (isError) {
        return <div className='w-full h-screen flex items-center justify-center'>
            Error loading projects.
        </div>
    }


    return (
        <UserWrapper>
            <div className="px-6 pt-8">
                <h2 className="md:text-3xl text-2xl font-semibold">History</h2>
            </div>

            <div className="w-full p-6">
                <div className="overflow-hidden rounded-md border">
                    {
                        isLoading ? (
                            <div className='w-full h-96 flex items-center justify-center'>
                                <Spinner />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Framework</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Payment</TableHead>
                                    </TableRow>
                                </TableHeader>


                                <TableBody>
                                    {
                                        data.projects.map((project: Project, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{project.title}</TableCell>
                                                <TableCell><Badge>{project.framework}</Badge></TableCell>
                                                <TableCell>{new Date(project.deadline).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}{' '}
                                                    &nbsp;-&nbsp; {project.time.split(':').slice(0, 2).join(':')}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            project.status === "progress" || project.status === "pending"
                                                                ? "outline"
                                                                : project.status === "completed"
                                                                    ? "default"
                                                                    : "destructive"
                                                        }
                                                    >
                                                        {project.status}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell>Rs {project.amount}</TableCell>
                                                <TableCell><Badge variant="default">{project.isPaid ? "Paid" : "Unpaid"}
                                                </Badge></TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        )
                    }


                </div>
            </div>
        </UserWrapper>

    )
}
