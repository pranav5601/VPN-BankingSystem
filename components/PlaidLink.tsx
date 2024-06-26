import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
import {
  createLinkToken,
  exchangePublicToken,
} from '@/lib/actions/user.actions'

import { PlaidLinkProps } from '@/types'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter()

  const [token, setToken] = useState('')

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user)

      setToken(data?.linkToken)
    }

    getLinkToken()
  }, [user])

  const onSuccess = useCallback(
    async (public_token: string) => {
      await exchangePublicToken({
        publicToken: public_token,
        user,
      })

      router.push('/')
    },
    [user]
  )

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  }

  const { open, ready } = usePlaidLink(config)

  return (
    <>
      {variant === 'primary' ? (
        <Button
          onClick={() => open()}
          disabled={!ready}
          className="plaidlink-primary"
        >
          Connect Bank
        </Button>
      ) : variant === 'rightSideBar' ? (
        <Button variant="ghost" onClick={() => open()} className="flex gap-2">
          <Image src="/icons/plus.svg" alt="plus" width={20} height={20} />

          <h2 className="text-14 font-semibold text-gray-600">Add Banks</h2>
        </Button>
      ) : (
        <Button onClick={() => open()} className="plaidlink-default">
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={23}
            height={23}
          />

          <p className="hiddenl text-[16px] font-semibold text-black-2">
            Connect Bank
          </p>
        </Button>
      )}
    </>
  )
}

export default PlaidLink
