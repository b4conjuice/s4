import { Main } from '@/components/ui'
import Menu from '@/components/menu'
import TopNav from '@/components/top-nav'
import NoteList from '@/components/note-list'
import { api } from '@/trpc/react'

export default function Notes() {
  const { data: notes } = api.note.getAll.useQuery()
  return (
    <>
      <TopNav title='notes' />
      <Main className='flex flex-col px-2'>
        <div className='flex flex-grow flex-col space-y-4'>
          <NoteList notes={notes ?? []} />
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <Menu />
        </div>
        <div className='flex space-x-4'></div>
      </footer>
    </>
  )
}
