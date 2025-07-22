import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/20/solid'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/nextjs'

import { Title } from '@/components/ui'
import { DEFAULT_TITLE } from '@/lib/common'

export default function TopNav({ title }: { title?: string }) {
  const { user } = useUser()

  const username = user?.username
  return (
    <header className='container mx-auto mb-2 flex w-full max-w-screen-md items-center px-2 pt-2 md:px-0'>
      <Title>{title ?? DEFAULT_TITLE}</Title>
      <div className='flex flex-grow justify-end'>
        <SignedOut>
          <SignInButton>
            <ArrowRightStartOnRectangleIcon className='h-6 w-6 hover:cursor-pointer' />
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className='text-cb-white flex space-x-2'>
            {username && <span>{username}</span>}
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </header>
  )
}
