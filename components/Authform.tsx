'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import CustomInputs from './CustomInputs'
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import Error from 'next/error'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/actions/user.actions'
import PlaidLink from './PlaidLink'

const Authform = ({ type }: { type: string }) => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const formSchema = authFormSchema(type)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      address1: '',
      state: '',
      city: '',
      ssn: '',
      dateOfBirth: '',
      postalCode: '',
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      if (type === 'sign-up') {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          postalCode: data.postalCode!,
          city: data.city!,
          state: data.state!,
          email: data.email,
          ssn: data.ssn!,
          dateOfBirth: data.dateOfBirth!,
          password: data.password,
        }
        const newUser = await signUp(userData)
        setUser(newUser)
      }
      if (type === 'sign-in') {
        const response = await signIn({
          email: data.email,
          password: data.password,
        })
        if (response) router.push('/')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="auth-form">
      <header>
        <div className="flex flex-col gap-5 md:gap-8">
          <Link className="cursor-pointer flex items-center gap-1" href="/">
            <Image
              src="/icons/logo.svg"
              alt="app logo"
              width={34}
              height={34}
            />

            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
              NVP
            </h1>
          </Link>

          <div className="flex flex-col gap-1 md:gap-3">
            <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
              {user
                ? 'Link Account'
                : type === 'sign-in'
                ? 'Sign In'
                : 'Sign Up'}
            </h1>

            <p className="text-16 font-normal text-gray-600">
              {user ? 'Link your account...' : 'Please enter your details.'}
            </p>
          </div>
        </div>
      </header>

      {user ? (
        <div>
          <div className="flex flex-col gap-4">
            <PlaidLink user={user} variant="primary" />
          </div>
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === 'sign-up' && (
                <>
                  <div className="flex gap-4">
                    <CustomInputs
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="ex. Jhon"
                      type="text"
                    />
                    <CustomInputs
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="ex. Doe"
                      type="text"
                    />
                  </div>

                  <CustomInputs
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter your address"
                    type="text"
                  />

                  <CustomInputs
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="ex. Montreal"
                    type="text"
                  />

                  <div className="flex flex-col gap-6">
                    <div className="flex gap-4">
                      <CustomInputs
                        control={form.control}
                        name="state"
                        label="State"
                        placeholder="LA"
                        type="text"
                      />
                      <CustomInputs
                        control={form.control}
                        name="postalCode"
                        label="Postal Code"
                        placeholder="50309"
                        type="text"
                      />
                    </div>

                    <div className="flex gap-4">
                      <CustomInputs
                        control={form.control}
                        name="dateOfBirth"
                        label="Date of Birth"
                        placeholder="YYYY-MM-DD"
                        type="text"
                      />
                      <CustomInputs
                        control={form.control}
                        name="ssn"
                        label="SSN"
                        placeholder="ex. 1234"
                        type="text"
                      />
                    </div>
                  </div>
                </>
              )}

              <CustomInputs
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your Email"
                type="email"
              />

              <CustomInputs
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your Password"
                type="password"
              />

              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Loading...
                    </>
                  ) : type === 'sign-in' ? (
                    'Sign In'
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === 'sign-in'
                ? "Don't have an account?"
                : 'Already have an acoount?'}
            </p>

            <Link
              href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
              className="form-link"
            >
              {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
            </Link>
          </footer>
        </>
      )}
    </section>
  )
}

export default Authform
