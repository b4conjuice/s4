import { NavLink as Link, useNavigate, useParams } from 'react-router'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'

import { Main, Title } from '@/components/ui'
import { transformTextToScripture } from '@/lib/books'

export default function Notes() {
  const navigate = useNavigate()
  const { text } = useParams()
  if (!text) {
    return <Main className='flex flex-col p-4'>`text` is required</Main>
  }
  const scripture = transformTextToScripture(text)
  if (!scripture) {
    return (
      <Main className='flex flex-col p-4'>
        no scripture found for text {text}
      </Main>
    )
  }
  const notes: { id: string; title: string }[] = []
  return (
    <>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <Title>{scripture.asString}</Title>
          <div className='flex flex-grow flex-col justify-between space-y-4'>
            {notes.length > 0 && (
              <ul className='divide-cb-dusty-blue divide-y'>
                {notes.map((note, index) => (
                  <li key={index} className='py-4'>
                    <Link
                      to={`/text/${text}/${note.id}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-cb-pink hover:text-cb-pink/75 truncate'
                    >
                      {note.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <button
            className='text-cb-yellow hover:text-cb-yellow/75'
            onClick={async () => {
              await navigate(-1)
            }}
          >
            <ChevronLeftIcon className='h-6 w-6' />
          </button>
        </div>
        <div className='flex space-x-4'></div>
      </footer>
    </>
  )
}
