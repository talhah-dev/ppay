"use client"
import UserWrapper from '@/app/wrapper/UserWrapper'
import CreateProjectCard from '@/components/CreateProjectCard'
import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardDescription, CardTitle, CardFooter, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteProject, editProject, getProjects } from '@/lib/api'
import { Spinner } from '@/components/ui/spinner'
import { Trash2, PlayCircle, Edit } from 'lucide-react';
import EditProject from '@/components/EditProject'
import { toast } from 'sonner'
import { EmptyDemo } from '@/components/EmptyDemo'

const CreateProject = () => {
    const [status, setStatus] = useState<string>("pending")
    const [id, setId] = useState<string>("")


    const queryClient = useQueryClient();

    const { data, isError, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: getProjects,
    })

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
    }

    const {
        mutate: editStatus,
        isPending: isEditingStatus,
    } = useMutation({
        mutationFn: () => {
            return editProject({ id, status })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success("Status updated successfully");
        },
    })

    const {
        mutate: activeProject,
        isPending,
    } = useMutation({
        mutationFn: ({ id }: { id: string }) => {
            return editProject({ isActive: true, id, status: 'pending' })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success("Project activated successfully");
        },
    })


    return (
        <UserWrapper>
            <div className="md:px-10 px-3 mt-8">
                <CreateProjectCard />
            </div>

            <div className="md:px-10 px-3">
                {
                    isLoading ? (
                        <div className="w-full h-96 flex items-center justify-center">
                            <Spinner className="size-8" />
                        </div>
                    ) : data.length < 1 ? (
                        <div className="py-10">
                            <EmptyDemo />
                        </div>
                    ) : (
                        <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-5 my-8">
                            {
                                data.projects.map((project: Project, index: number) => (
                                    <Card key={index} className='border-none'>
                                        <CardHeader>
                                            <CardTitle className='flex items-center justify-between'>
                                                {project.title}
                                                <Badge variant={'default'}>
                                                    {project.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </CardTitle>
                                            <CardDescription className='flex items-center gap-2'>
                                                <Badge variant='outline'>{project.framework}</Badge>
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className='grid grid-cols-2 gap-4 items-center'>
                                            <div className='flex flex-col'>
                                                <span className='text-xs font-medium uppercase'>Price</span>
                                                <span className='text-lg font-semibold'>Rs {project.amount}</span>
                                            </div>
                                            <div className='flex flex-col'>
                                                <span className='text-xs font-medium uppercase'>Deadline</span>
                                                <span className='text-lg font-semibold'>
                                                    {new Date(project.deadline).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}{' '}
                                                    &nbsp;-&nbsp; {project.time.split(':').slice(0, 2).join(':')}
                                                </span>
                                            </div>
                                        </CardContent>

                                        {project.isActive ? (
                                            <CardFooter className='flex gap-2 justify-between items-end'>


                                                <div className='flex flex-col w-full space-y-1.5'>
                                                    <Label htmlFor='framework'>Status</Label>
                                                    {
                                                        isEditingStatus && id === project._id ? (
                                                            <div className="w-full flex items-center justify-center border p-[9.3px] rounded-lg">
                                                                <Spinner />
                                                            </div>
                                                        ) : (
                                                            <Select
                                                                required
                                                                value={project.status}
                                                                onValueChange={(value) => {
                                                                    setStatus(value)
                                                                    setId(project._id)
                                                                    editStatus()
                                                                }}
                                                            >
                                                                <SelectTrigger className='w-full' id='framework'>
                                                                    <SelectValue placeholder='Select' />
                                                                </SelectTrigger>
                                                                <SelectContent className='w-full'>
                                                                    <SelectItem value='pending'>Pending</SelectItem>
                                                                    <SelectItem value='progress'>Progress</SelectItem>
                                                                    <SelectItem value='completed'>Completed</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )
                                                    }
                                                </div>

                                                <div className="flex items-center">
                                                    <EditProject projectId={project._id} />
                                                    <AlertDialogDemo projectId={project._id} />
                                                </div>
                                            </CardFooter>
                                        ) : (
                                            <CardFooter className='flex gap-2 justify-between items-end'>
                                                <div className='w-full'>
                                                    <Label className='select-none'>&nbsp;</Label>
                                                    <Button disabled={isPending && id === project._id} onClick={() => {
                                                        setId(project._id)
                                                        activeProject({ id: project._id })
                                                    }} className='w-full flex items-center justify-center gap-2'>
                                                        {
                                                            isPending && id === project._id ? (
                                                                <Spinner />
                                                            ) : (
                                                                <>
                                                                    <PlayCircle className='w-5 h-5' />
                                                                    Active Now
                                                                </>
                                                            )
                                                        }
                                                    </Button>
                                                </div>

                                                <div className="flex items-center">
                                                    <EditProject projectId={project._id} />
                                                    <AlertDialogDemo projectId={project._id} />
                                                </div>
                                            </CardFooter>
                                        )}
                                    </Card>
                                ))}
                        </div>
                    )
                }
            </div>

        </UserWrapper>
    )
}

export default CreateProject


export function AlertDialogDemo({ projectId }: { projectId: string }) {


    if (!projectId) {
        return toast.error("Project Not Found");
    }

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => {
            if (!projectId) throw new Error("Project ID is required");
            return deleteProject({ id: projectId });
        },
        onSuccess: () => {
            toast.success("Project deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Something went wrong");
        },
    })

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant='ghost'
                    size='icon'
                    className='text-red-500 hover:text-red-600 hover:bg-red-50 '
                >
                    <Trash2 className='w-5 h-5' />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please confirm that you want to delete this item. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}> {mutation.isPending ? <Spinner /> : "Delete"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

