import { TagIcon } from '@heroicons/react/20/solid'

export default function NoteListSkeleton() {
  const allTags = Array.from(
    {
      length: 6,
    },
    (_, i) => i + 1
  )
  const results = Array.from(
    {
      length: 15,
    },
    (_, i) => i + 1
  )
  return (
    <>
      {/* TODO: add back after adding to note-list */}
      {/* <div className='flex'>
        <input
          type='text'
          className='bg-cb-blue w-full disabled:pointer-events-none disabled:opacity-25'
          placeholder='search'
        />
      </div> */}
      <ul className='flex space-x-2 overflow-x-auto'>
        {allTags.map((tag, index) => (
          <li key={index}>
            <button className='border-cb-blue bg-cb-blue h-[42px] w-[34px] rounded-lg border'></button>
          </li>
        ))}
      </ul>
      <ul className='divide-cb-dusty-blue divide-y'>
        {results.map((note, index) => (
          <li key={index} className='group flex h-[56px] space-x-2'>
            <div className='text-cb-pink hover:text-cb-pink/75 flex grow items-center justify-between py-4 group-first:pt-0'></div>
            <div className='flex space-x-2'>
              <button
                type='button'
                className='text-cb-yellow hover:text-cb-yellow/75'
              >
                <TagIcon className='h-6 w-6' />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
