import { NavLink as Link } from 'react-router'
import { Bars2Icon } from '@heroicons/react/20/solid'
import {
  Menu as MenuRoot,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'

const nav = [
  { text: 'home', href: '/' },
  { text: 'history', href: '/history' },
  { text: 'books', href: '/books' },
]

export default function Menu() {
  return (
    <MenuRoot>
      <MenuButton className='text-cb-yellow hover:text-cb-yellow/75'>
        <Bars2Icon className='h-6 w-6' />
      </MenuButton>

      <MenuItems
        className='bg-cb-dusty-blue/90 flex flex-col space-y-4 rounded p-4'
        anchor='bottom start'
      >
        {nav.map(({ text, href }) => (
          <MenuItem key={href}>
            <Link to={href} className='text-cb-pink hover:text-cb-pink/75'>
              {text}
            </Link>
          </MenuItem>
        ))}
      </MenuItems>
    </MenuRoot>
  )
}
