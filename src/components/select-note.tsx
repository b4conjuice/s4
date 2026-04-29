import { useEffect } from 'react'
import {
  NavLink as Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router'

import useSearch from '@/lib/useSearch'
import { api } from '@/trpc/react'
import NoteListSkeleton from '@/components/note-list-skeleton'
import type { Note } from '@/lib/types'

const NOTE_COUNT_DISPLAYED = 10

export default function SelectNote({
  onNoteSelect,
}: {
  onNoteSelect: (note: Note) => void
}) {
  const { data: notes, isFetching } = api.note.getAll.useQuery()
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')
  const { search, setSearch, results, searchRef } = useSearch({
    initialSearch: query ? String(query) : '',
    list: notes ?? [],
    options: {
      keys: ['title', 'body'],
    },
  })
  useEffect(() => {
    if (query) {
      setSearch(String(query))
    }
  }, [query, setSearch])
  if (isFetching) {
    return <NoteListSkeleton />
  }
  return (
    <>
      <div className='flex'>
        <input
          ref={searchRef}
          type='text'
          className='bg-cb-blue w-full disabled:pointer-events-none disabled:opacity-25'
          placeholder='search'
          value={search}
          onChange={e => {
            const { value } = e.target
            setSearch(value)
            const url = `${pathname}${value ? `?q=${value}` : ''}`
            void navigate(url)
          }}
          disabled={!(notes?.length && notes?.length > 0)}
        />
      </div>
      <ul className='divide-cb-dusty-blue divide-y'>
        {[...results].slice(0, NOTE_COUNT_DISPLAYED).map(note => (
          <li key={note.id} className='group flex space-x-2'>
            <button
              className='text-cb-pink hover:text-cb-pink/75 flex grow items-center justify-between py-4 group-first:pt-0'
              onClick={() => {
                onNoteSelect(note)
              }}
            >
              {note.title}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
