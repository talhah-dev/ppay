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

const Otp = ({ email }: { email: string }) => {
    const navigate = useRouter()
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(otp, email);
        setLoading(true)
        try {
            const res = await axios.post('/api/auth/verifyemail', { otp, email })
            if (!res.data.success) {
                setLoading(false)
                return toast(res.data.message)
            }

            setOtp('')
            setLoading(false)
            toast(res.data.message)
            navigate.push('/login')

        } catch (error) {
            console.log(error)
            toast('Something went wrong')
            setLoading(false)
        }
    }


    return (
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

export default Otp