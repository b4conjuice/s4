import { useState } from 'react'
import { NavLink as Link } from 'react-router'
import { Bars2Icon } from '@heroicons/react/20/solid'

import Modal from '@/components/modal'

export default function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <>
      <button
        type='button'
        className='text-cb-yellow hover:text-cb-yellow/75'
        onClick={() => {
          setIsMenuOpen(true)
        }}
      >
        <Bars2Icon className='h-6 w-6' />
      </button>
      <Modal isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
        <ul className='divide-cb-dusty-blue flex flex-col space-y-4 divide-y'>
          <li>
            <Link to='/history' className='text-cb-pink hover:text-cb-pink/75'>
              history
            </Link>
          </li>
          <li>
            <Link to='/books' className='text-cb-pink hover:text-cb-pink/75'>
              books
            </Link>
          </li>
        </ul>
      </Modal>
    </>
  )
}
