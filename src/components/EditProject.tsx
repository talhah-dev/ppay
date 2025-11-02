"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChevronDownIcon, Edit, Plus } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { editProject, getSingleProject } from "@/lib/api"

export default function EditProject({ projectId }: { projectId: string }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant='ghost'
                        size='icon'
                        className=' hover:bg-zinc-100'
                    >
                        <Edit className='w-5 h-5' />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>
                            Update a project in one-click.
                        </DialogDescription>
                    </DialogHeader>
                    <CreateProjectForm projectId={projectId} setOpen={setOpen} />
                </DialogContent>
            </Dialog>
        </>
    )
}

interface CreateProjectFormProps {
    projectId: string;
    setOpen: (open: boolean) => void;
}

function CreateProjectForm({ projectId, setOpen }: CreateProjectFormProps) {
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [time, setTime] = useState<string>("")
    const [framework, setFramework] = useState<string>("")
    const [price, setPrice] = useState<number>(0)
    const [name, setName] = useState<string>("")
    const [isActive, setIsActive] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [popoverOpen, setPopoverOpen] = useState(false)

    const queryClient = useQueryClient();

    const {
        isPending,
        mutate: mutateGetSingleProject,
        error,
    } = useMutation({
        mutationFn: () => {
            return getSingleProject({ id: projectId })
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setName(data.project.title);
            setFramework(data.project.framework);
            setPrice(data.project.amount);
            setIsActive(data.project.isActive);
            setTime(data.project.time);
            setDate(new Date(data.project.deadline));
        },
        onError: (error: any) => {
            console.error("Create project failed:", error);
            toast.error(error.message);
        }
    })


    useEffect(() => {
        mutateGetSingleProject();
    }, [mutateGetSingleProject]);

    const {
        isPending: isSavingProject,
        mutate: mutateEditProject,
    } = useMutation({
        mutationFn: () => {
            return editProject({ id: projectId, title: name, deadline: date, time, framework, amount: price, isActive })
        }
        ,
        onSuccess: () => {
            setDate(undefined);
            setTime("");
            setFramework("");
            setPrice(0);
            setName("");
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success("Project updated successfully");
        },
        onError: (error: any) => {
            console.error("Edit project failed:", error);
            toast.error(error.message);
        },
    })

    const {
        isPending: isDraftSavingProject,
        mutate: mutateDraftProject,
    } = useMutation({
        mutationFn: () => {
            return editProject({ id: projectId, title: name, deadline: date, time, framework, amount: price, isActive: false })
        }
        ,
        onSuccess: () => {
            setDate(undefined);
            setTime("");
            setFramework("");
            setPrice(0);
            setName("");
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success("Project saved as draft successfully");
        },
        onError: (error: any) => {
            console.error("Edit project failed:", error);
            toast.error(error.message);
        },
    })


    return (
        <Card className="w-full shadow-none border-0 py-4">
            {isPending ? (
                <div className="flex justify-center items-center p-8">
                    <Spinner />
                </div>
            ) : (
                <div>
                    <CardContent className="p-0">
                        <div className="grid w-full gap-4">
                            {/* Project Name */}
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    type="text"
                                    required
                                    id="name"
                                    placeholder="Project name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-7 gap-5 md:mt-5 mt-1.5">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="date">Date</Label>
                                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-between font-normal"
                                            >
                                                {date ? date.toLocaleDateString() : "Select date"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                captionLayout="dropdown"
                                                onSelect={(d) => {
                                                    setDate(d)
                                                    setPopoverOpen(false)
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="time">Time</Label>
                                    <Input
                                        type="time"
                                        id="time"
                                        step="1"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                                    />
                                </div>
                            </div>

                            {/* Framework & Price */}
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-7 gap-5 md:mt-5 mt-1.5">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="framework">Framework</Label>
                                    <Select
                                        required
                                        value={framework}
                                        onValueChange={(value) => setFramework(value)}
                                    >
                                        <SelectTrigger className="w-full" id="framework">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            <SelectItem value="html">HTML</SelectItem>
                                            <SelectItem value="react">React</SelectItem>
                                            <SelectItem value="nextjs">Nextjs</SelectItem>
                                            <SelectItem value="nodejs">Nodejs</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        type="number"
                                        id="price"
                                        placeholder="3000"
                                        required
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex gap-2 mt-8 px-0 justify-end">
                        <Button onClick={() => {
                            mutateDraftProject()
                        }} variant="outline" disabled={isDraftSavingProject}>{isDraftSavingProject ? <Spinner /> : "Save draft"}</Button>
                        <Button onClick={() => mutateEditProject()} type="submit" disabled={isSavingProject}>{isSavingProject ? <Spinner /> : "Save Changes"}</Button>
                    </CardFooter>
                </div>
            )}
        </Card>
    )
}
