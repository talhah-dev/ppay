"use client"
import React, { useState } from 'react'
import { Field, FieldDescription, FieldGroup, FieldLabel } from './ui/field'
import { cn } from '@/lib/utils'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './ui/input-otp'
import { Button } from './ui/button'
import axios from 'axios'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Input } from './ui/input'

const ForgotOtp = ({ email }: { email: string }) => {
    const navigate = useRouter()
    const [otp, setOtp] = useState('')
    const [password, setPassword] = useState({
        newPassword: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [verify, setVerify] = useState(false)

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axios.post('/api/auth/verifyemail', { otp, email })
            if (!res.data.success) {
                setLoading(false)
                return toast(res.data.message)
            }

            setOtp('')
            setLoading(false)
            setVerify(true)
            toast("Verify successfully")

        } catch (error) {
            console.log(error)
            toast('Something went wrong')
            setLoading(false)
        }
    }

    const changePasswordHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        if (password.newPassword !== password.confirmPassword) {
            setLoading(false)
            return toast('Password does not match')
        }

        try {
            const res = await axios.post('/api/auth/resetpassword', { email, password: password.newPassword })
            if (!res.data.success) {
                return toast(res.data.message)
            }

            setLoading(false)

            setPassword({
                newPassword: '',
                confirmPassword: ''
            })

            toast(res.data.message)
            window.location.reload()
            navigate.push('/login')

        } catch (error) {
            toast('Something went wrong')
            setLoading(false)
        }
    }


    return (
        <>
            {
                !verify && (
                    <div className="flex w-full items-center justify-center p-6">
                        <div className="w-full max-w-xs">
                            <div className={cn("flex flex-col gap-6")}>
                                <form onSubmit={submitHandler}>
                                    <FieldGroup>
                                        <div className="flex flex-col items-center gap-1 text-center">
                                            <h1 className="text-2xl font-semibold">Enter verification code</h1>
                                            <p className="text-muted-foreground text-sm text-balance">
                                                We sent a 6-digit code to your email.
                                            </p>
                                        </div>
                                        <Field>
                                            <FieldLabel htmlFor="otp" className="sr-only">
                                                Verification code
                                            </FieldLabel>
                                            <InputOTP value={otp} onChange={(val) => setOtp(val)} maxLength={6} id="otp" required>
                                                <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                            <FieldDescription className="text-center">
                                                Enter the 6-digit code sent to your email.
                                            </FieldDescription>
                                        </Field>
                                        <Button type="submit" disabled={loading}>
                                            {
                                                loading ?
                                                    <LoaderCircle className='animate-spin' />
                                                    : "Verify"
                                            }
                                        </Button>
                                        <FieldDescription className="text-center">
                                            Didn&apos;t receive the code? <a href="#">Resend</a>
                                        </FieldDescription>
                                    </FieldGroup>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                verify && (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-xs">
                            <form onSubmit={changePasswordHandler} className={cn("flex flex-col gap-6")}>
                                <FieldGroup>
                                    <div className="flex flex-col items-center gap-1 text-center">
                                        <h1 className="text-2xl mb-1 font-semibold">Reset Password</h1>
                                        <p className="text-muted-foreground text-sm text-balance">
                                            Enter your new password
                                        </p>
                                    </div>
                                    <Field className='gap-1'>
                                        <FieldLabel htmlFor="newpassword">New Password</FieldLabel>
                                        <Input onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} value={password.newPassword} id="newpassword" type="text" placeholder="password" required />
                                    </Field>
                                    <Field className='gap-1'>
                                        <FieldLabel htmlFor="confirmpassword">Confirm Password</FieldLabel>
                                        <Input onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })} value={password.confirmPassword} id="confirmpassword" type="text" placeholder="Confirm password" required />
                                    </Field>
                                    <Field>
                                        <Button className='cursor-pointer' type="submit"> {
                                            loading ?
                                                <LoaderCircle className='animate-spin' />
                                                : "Change Password"
                                        }</Button>
                                    </Field>
                                    <Field>
                                        <FieldDescription className="text-center">

                                        </FieldDescription>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </div>
                    </div >
                )
            }

        </>
    )
}

export default ForgotOtp