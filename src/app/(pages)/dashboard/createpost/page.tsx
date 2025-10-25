'use client'

import React, { useRef, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ImagePlus, Upload } from 'lucide-react'
import UserWrapper from '@/app/wrapper/UserWrapper'
import { Spinner } from "@/components/ui/spinner"
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '@/lib/api'
import { uploadImageToCloudinary } from '@/lib/uploadImage'

const CreatePost = () => {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // gives us access to the cache so we can invalidate after create
    const queryClient = useQueryClient();

    const {
        mutate: mutateCreatePost,
        isPending: isCreating,
    } = useMutation({
        mutationFn: async () => {

            let imageUrl: string | undefined = undefined;

            if (file) {
                const url = await uploadImageToCloudinary(file);
                console.log("Cloudinary OK url =", url);   // <-- must be a https URL
                imageUrl = url;
            }

            return createPost({ title, description, image: imageUrl })
        },
        onSuccess: (data) => {
            // 1) Clear form
            setTitle('');
            setDescription('');
            setFile(null);
            setPreview(null);
            toast.success(data?.message || 'Post created successfully');

            // 2) Tell React Query that "posts" are outdated → trigger refetch wherever they’re used
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (err: any) => {
            toast.error(err?.message || 'Unauthorized access');
        },
    });


    const handlePickFile = () => fileInputRef.current?.click();

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const f = e.target.files?.[0] || null;
        setFile(f);
        setPreview(f ? URL.createObjectURL(f) : null);
    };


    return (
        <UserWrapper>
            <div className="mx-auto w-full p-4">
                <Card className="border-muted/40 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">Create Post</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Image upload */}
                        <section className="space-y-2">
                            <Label htmlFor="post-image">Upload image</Label>

                            {/* Single hidden input + ref + onChange */}
                            <input
                                ref={fileInputRef}
                                id="post-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            <div className="relative flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-muted-foreground/30 p-4 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="preview"
                                            className="h-40 w-auto rounded-md object-cover"
                                        />
                                    ) : (
                                        <>
                                            <ImagePlus className="h-8 w-8" aria-hidden />
                                            <p className="text-sm text-muted-foreground">Choose an image to upload</p>
                                        </>
                                    )}

                                    <Button
                                        type="button"
                                        className="relative"
                                        variant="secondary"
                                        size="sm"
                                        onClick={handlePickFile}
                                        disabled={isCreating}
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        {file ? 'Change image' : 'Select image'}
                                    </Button>
                                </div>
                            </div>
                        </section>

                        {/* 2) Heading */}
                        <section className="space-y-2">
                            <Label htmlFor="post-title">Heading</Label>
                            <Input onChange={(e) => setTitle(e.target.value)} value={title} id="post-title" placeholder="Enter a short heading" />
                        </section>

                        {/* 3) Description */}
                        <section className="space-y-2">
                            <Label htmlFor="post-desc">Description</Label>
                            <Textarea onChange={(e) => setDescription(e.target.value)} value={description} id="post-desc" placeholder="Tell us more about this post..." className="min-h-32" />
                        </section>
                    </CardContent>

                    <CardFooter className="flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            onClick={() => {
                                if (!title.trim() || !description.trim()) {
                                    toast.error('Please fill title and description');
                                    return;
                                }
                                mutateCreatePost(); // triggers the mutation
                            }}
                            disabled={isCreating}
                        >
                            {isCreating ? <Spinner /> : 'Create Post'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </UserWrapper>
    )
}

export default CreatePost
