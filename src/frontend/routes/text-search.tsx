import { useNavigate } from 'react-router'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { Main } from '@/components/ui'
import { transformScripturetoText, transformTextToScripture } from '@/lib/books'
import Menu from '@/components/menu'
import BookMenu from '@/components/book-menu'
import BookSearch from '@/components/book-search'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

type FormData = {
  text: string
}

export default function TextSearchPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      text: '',
    },
  })
  const onSubmit: SubmitHandler<FormData> = async data => {
    const { text } = data
    void navigate(`/text/${text}`)
  }
  console.log({ errors })
  return (
    <>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col justify-end space-y-4'>
          {errors && errors.text && (
            <div className='text-red-500'>{errors.text.message}</div>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='bg-cobalt flex items-center space-x-2 rounded-xl px-4'>
              <MagnifyingGlassIcon className='text-cb-yellow h-6 w-6' />
              <input
                type='text'
                {...register('text', {
                  required: true,
                  validate: value =>
                    value.length !== 8
                      ? 'must be 8 characters'
                      : transformTextToScripture(value) === ''
                        ? 'invalid bible param'
                        : true,
                })}
                className='placeholder-cb-yellow/75 h-12 w-full border-0 bg-transparent focus:ring-0 focus:outline-0'
                placeholder='enter text / bible param (45014008)'
              />
            </div>
          </form>
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex flex-col space-y-2 px-2 pt-2 pb-6'>
        <BookSearch
          onSelectBook={async scripture => {
            const { bookNumber, chapter, verse } = scripture
            if (verse) {
              const text = transformScripturetoText(scripture)
              await navigate(`/text/${text}`)
            } else {
              await navigate(`/books/${bookNumber}/${chapter}`)
            }
          }}
          showRecentCommands
        />
        <div className='flex items-center justify-between'>
          <div className='flex space-x-4'>
            <Menu />
            <BookMenu />
          </div>
          <div className='flex space-x-4'></div>
        </div>
      </footer>
    </>
  )
}
