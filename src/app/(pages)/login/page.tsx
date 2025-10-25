"use client"
import ForgotOtp from '@/components/ForgotOtp'
import Otp from '@/components/Otp'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { ArrowLeft, LoaderCircle, Ratio } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { toast } from 'sonner'

const Login = () => {

    const naviate = useRouter()

    const [forgetPassword, setForgetPassword] = useState("login")
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axios.post('/api/auth/login', user)

            if (!res.data.success) {
                setLoading(false)
                return toast(res.data.message)
            }

            setLoading(false)
            toast(res.data.message)
            naviate.push('/dashboard')

            setUser({
                email: '',
                password: ''
            })

        } catch (error) {
            console.log(error)
            setLoading(false)
            toast('Incorrect email or password')
        }
    }

    const forgetHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {

            const res = await axios.post('/api/auth/forgetpassword', { email: user.email })

            if (!res.data.success) {
                setLoading(false)
                return toast('Something went wrong')
            }

            setLoading(false)
            toast(res.data.message)
            setForgetPassword("otp")

        } catch (error) {
            console.log(error)
            setLoading(false)
            toast('Something went wrong')
        }
    }

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            {
                forgetPassword === "login" &&
                (
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
                                            <h1 className="text-2xl mb-1 font-semibold">Login to your account</h1>
                                            <p className="text-muted-foreground text-sm text-balance">
                                                Enter your email to Login to your account
                                            </p>
                                        </div>
                                        <Field>
                                            <FieldLabel htmlFor="email">Email</FieldLabel>
                                            <Input onChange={(e) => setUser({ ...user, email: e.target.value })} value={user.email} id="email" type="email" placeholder="m@example.com" required />
                                        </Field>
                                        <Field>
                                            <div className="flex items-center">
                                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                                <p onClick={() => setForgetPassword("forgetpassword")}
                                                    className="ml-auto cursor-pointer text-sm underline-offset-4 hover:underline"
                                                >
                                                    Forgot your password?
                                                </p>
                                            </div>
                                            <Input onChange={(e) => setUser({ ...user, password: e.target.value })} value={user.password} id="password" placeholder="Password" type="password" required />
                                        </Field>
                                        <Field>
                                            <Button disabled={loading} type="submit">
                                                {
                                                    loading ?
                                                        <LoaderCircle className='animate-spin' />
                                                        : "Login"
                                                }
                                            </Button>
                                        </Field>
                                        <FieldSeparator>Or continue with</FieldSeparator>
                                        <Field>
                                            <Button variant="outline" type="button">
                                                <FaGoogle />
                                                Login with Google
                                            </Button>
                                            <FieldDescription className="text-center">
                                                Don&apos;t have an account?{" "}
                                                <Link href="/register" className="underline underline-offset-4">
                                                    Sign up
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
                forgetPassword === "forgetpassword" &&
                (
                    <div className="flex flex-col gap-4 p-6 md:p-10">
                        <div className="flex justify-center gap-2 md:justify-start">
                            <p onClick={() => setForgetPassword("login")} className="flex cursor-pointer items-center gap-2 font-medium">
                                <ArrowLeft className='size-5' />
                                Back
                            </p>
                        </div>
                        <div className="flex flex-1 items-center justify-center">
                            <div className="w-full max-w-xs">
                                <form onSubmit={forgetHandleSubmit} className={cn("flex flex-col gap-6")}>
                                    <FieldGroup>
                                        <div className="flex flex-col items-center gap-1 text-center">
                                            <h1 className="text-2xl mb-1 font-semibold">Forget Password</h1>
                                            <p className="text-muted-foreground text-sm text-balance">
                                                Enter your email to forget password
                                            </p>
                                        </div>
                                        <Field className='gap-1'>
                                            <FieldLabel htmlFor="email">Email</FieldLabel>
                                            <Input onChange={(e) => setUser({ ...user, email: e.target.value })} value={user.email} id="email" type="email" placeholder="m@example.com" required />
                                        </Field>
                                        <Field>
                                            <Button disabled={loading} className='cursor-pointer' type="submit">
                                                {
                                                    loading ?
                                                        <LoaderCircle className='animate-spin' />
                                                        : "Send"
                                                }
                                            </Button>
                                        </Field>
                                        <Field>
                                            <FieldDescription className="text-center">
                                                OTP code will be sent to your email.
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
                forgetPassword === "otp" &&
                (
                    <ForgotOtp email={user.email} />
                )
            }

            <div className="bg-muted relative hidden lg:block">
                <img
                    src="/auth.png"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}

export default Login