"use client"
import React, { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { toast } from 'sonner';
import axios from 'axios';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/lib/api';

const BLog = () => {

  type BlogPost = {
    title: string;
    description: string;
    image: string;
    author: string;
  };

  const { data, isLoading, isError, error } = useQuery<BlogPost[], Error>({
    queryKey: ["posts"],           // cache key
    queryFn: getPosts,             // calls your axios helper
  });

  if (isLoading) {
    return (
      <section className="">
        <div className="container mx-auto flex items-center justify-center h-screen">
          <Spinner className="size-8" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-32">
        <div className="container mx-auto text-center">
          <p className="text-red-500">Failed to load posts: {error.message}</p>
        </div>
      </section>
    );
  }

  const posts = data ?? [];

  return (
    <section className="py-32">
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            Latest Updates
          </Badge>
          <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            Blog Posts
          </h2>
          <p className="text-muted-foreground mb-8 md:text-base lg:max-w-2xl lg:text-lg">
            Discover the latest trends, tips, and best practices in modern web development. From UI components to design systems, stay updated with our expert insights.
          </p>
          <Button variant="link" className="w-full sm:w-auto" asChild>
            <Link href={"/dashboard"}>
              View all articles
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post, index) => (
            <Card
              key={index}
              className="grid grid-rows-[auto_auto_1fr_auto] pt-0"
            >
              <div className="aspect-16/9 w-full">
                <a
                  href={"/"}
                  target="_blank"
                  className="fade-in transition-opacity duration-200 hover:opacity-70"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover object-center"
                  />
                </a>
              </div>
              <CardHeader>
                <h3 className="text-lg font-semibold hover:underline md:text-xl">
                  <a href={"/"} target="_blank">
                    {post.title}
                  </a>
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.description}</p>
              </CardContent>
              <CardFooter>
                <a
                  href={"/"}
                  target="_blank"
                  className="text-foreground flex items-center hover:underline"
                >
                  Read more
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}

export default BLog