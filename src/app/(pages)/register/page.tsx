"use client"
import Otp from '@/components/Otp'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { LoaderCircle, Ratio } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, {  useState } from 'react'
import { toast } from 'sonner'

const Register = () => {

    const [loading, setLoading] = useState(false)
    const [otp, setOtp] = useState(false)

    const [user, setUser] = useState({
        username: '',
        email: '',
        password: ''
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axios.post('/api/auth/register', user)
            if (!res.data.success) {
                setLoading(false)
                return toast(res.data.message)
            }
            
            setLoading(false)
            toast(res.data.message)
            setOtp(true)

        } catch (error) {
            console.log(error)
            toast('Something went wrong')
            setLoading(false)
        }
    }

    return (
        <>
            <div className="grid min-h-svh lg:grid-cols-2">
                {
                    !otp && (
                        <div className="flex flex-col gap-4 p-6 md:p-10">
                            <div className="flex justify-center gap-2 md:justify-start">
                                <Link href="#" className="flex items-center gap-2 font-medium">
                                    <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
                                        <Ratio className='p-0.5' />
                                    </div>
                                    PPay
                                </Link>
                            </div>
                            <div className="flex flex-1 items-center justify-center">
                                <div className="w-full max-w-xs">
                                    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6")}>
                                        <FieldGroup>
                                            <div className="flex flex-col items-center gap-1 text-center">
                                                <h1 className="text-2xl mb-1 font-semibold">Register to your account</h1>
                                                <p className="text-muted-foreground text-sm text-balance">
                                                    Enter your email to Register to your account
                                                </p>
                                            </div>
                                            <Field className='gap-1'>
                                                <FieldLabel htmlFor="email">Username</FieldLabel>
                                                <Input onChange={(e) => setUser({ ...user, username: e.target.value })} value={user.username} id="username" type="text" placeholder='Talha' required />
                                            </Field>
                                            <Field className='gap-1'>
                                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                                <Input onChange={(e) => setUser({ ...user, email: e.target.value })} value={user.email} id="email" type="email" placeholder="m@example.com" required />
                                            </Field>
                                            <Field className='gap-1'>
                                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                                <Input onChange={(e) => setUser({ ...user, password: e.target.value })} value={user.password} id="password" placeholder="Password" type="password" required />
                                            </Field>
                                            <Field>
                                                <Button className='cursor-pointer' disabled={loading} type="submit">
                                                    {
                                                        loading ?
                                                            <LoaderCircle className='animate-spin' />
                                                            : "Register"
                                                    }

                                                </Button>
                                            </Field>
                                            <Field>
                                                <FieldDescription className="text-center">
                                                    already have an account?{" "}
                                                    <Link href="/login" className="underline underline-offset-4">
                                                        Login
                                                    </Link>
                                                </FieldDescription>
                                            </Field>
                                        </FieldGroup>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    otp && (
                        <Otp email={user.email} />
                    )
                }
                <div className="bg-muted relative hidden lg:block">
                    <img
                        src="/auth.png"
                        alt="Image"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </div >
        </>
    )
}

export default Register