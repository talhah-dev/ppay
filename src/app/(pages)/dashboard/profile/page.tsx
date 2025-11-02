"use client";

import React, { useState } from "react";
import UserWrapper from "@/app/wrapper/UserWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, User2, Camera, PencilLine, Shield, CalendarDays, Verified, User } from "lucide-react";

export default function Profile() {
  // In a real app, replace these with data from your API/user session
  const user = {
    name: "M Talha",
    email: "talha185133@gmail.com",
    role: "Full‑Stack Developer",
    location: "Karachi, Pakistan",
    phone: "+92 300 0000000",
    memberSince: "Jan 2024",
    avatarUrl: "https://i.pravatar.cc/300?img=12",
    stats: {
      posts: 24,
      followers: 1_240,
      following: 312,
    },
  };

  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }



  return (
    <UserWrapper>
      <div className="">
        <div className="mx-auto max-w-5xl p-4 md:p-8">
          {/* Cover + Header */}
          <div className="relative mb-16 overflow-hidden rounded-2xl p-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">

              <div className="relative -mb-12 sm:mb-0">
                <Avatar className="size-28 ring-4 ring-background shadow-lg">
                  <AvatarImage src={data.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">{data.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>

              <div className="mt-16 sm:mt-0 text-center md:text-start sm:ml-6">
                <h1 className="text-2xl font-semibold leading-tight md:text-3xl">{data.name}</h1>
                <div className="mt-2 flex justify-center md:justify-start flex-wrap items-center gap-2 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="size-4" /> {data.username}
                  </span>
                </div>

                <div className="mt-3 flex md:justify-start justify-center flex-wrap gap-2">
                  <Badge> <Verified /> Verified</Badge>
                  <Badge className="gap-1" variant="outline">
                    <CalendarDays className="size-3" /> Member since {new Date(data.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Badge>
                </div>
              </div>

              <div className="ml-auto flex md:w-auto w-full gap-2">
                <Button className="gap-2 md:w-auto w-full" onClick={() => setOpen(true)}>
                  <PencilLine className="size-4" /> Edit Profile
                </Button>
              </div>

            </div>
          </div>


          <Card className="">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Full name</p>
                  <p className="font-medium">{data.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium flex items-center gap-2"><Mail className="size-4" /> {data.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium flex items-center gap-2"><Phone className="size-4" /> {user.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium flex items-center gap-2"><MapPin className="size-4" /> {user.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="font-medium flex items-center gap-2"><User2 className="size-4" /> {data.role}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Member since</p>
                  <p className="font-medium flex items-center gap-2"><CalendarDays className="size-4" />
                    {new Date(data.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Modal */}
        <EditProfileDialog
          open={open}
          onOpenChange={setOpen}
          user={data}
        />

      </div>
    </UserWrapper>
  );
}

// ---- Dialog Component ----
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EditProfile, getProfile } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { uploadImageToCloudinary } from "@/lib/uploadImage";
import { toast } from "sonner";

function EditProfileDialog({ open, onOpenChange, user }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: any;
}) {

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [file, setFile] = useState<File | null>(null);


  const queryClient = useQueryClient();


  const {
    mutate: mutateEditProfile,
    isPending,
  } = useMutation({
    mutationFn: async () => {

      let imageUrl: string | undefined = undefined;

      if (file) {
        const url = await uploadImageToCloudinary(file);
        imageUrl = url;
      }

      return EditProfile({ name, username, bio, avatar: imageUrl })
    },

    onSuccess: (data) => {
      setFile(null);
      toast.success("Updated successfully");

      // 2) Tell React Query that are outdated → trigger refetch wherever they’re used
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Unauthorized access');
    },
  });

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update your avatar and basic information.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Avatar picker */}
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex relative items-center gap-2">
              <input
                type="file"
                accept="image/*"
                className="absolute w-40 h-8 opacity-0"
                onChange={handleFileChange}
              />
              <Button size="sm" variant="secondary">
                <Camera className="mr-2 size-4" /> Change photo
              </Button>
            </div>
          </div>

          {/* Simple editable fields (demo only) */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" type="text" onChange={(e) => setName(e.target.value)} value={name} />
            </div>
            {/* <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" readOnly defaultValue={user.email} />
            </div> */}
            {/* <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue={user.location} />
            </div> */}
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" onChange={(e) => setUsername(e.target.value)} value={username} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" onChange={(e) => setBio(e.target.value)} value={bio} placeholder="Tell something about yourself..." />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={isPending} onClick={() => {
            onOpenChange(false)
            mutateEditProfile()
          }}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
