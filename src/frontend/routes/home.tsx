import Swordle from '@/components/swordle'
import Mwt from '@/components/mwt'
import Sword from '@/components/sword'
import { Main, Title } from '@/components/ui'

export default function Home() {
  return (
    <Main className='flex flex-col p-4'>
      <div className='flex flex-grow flex-col space-y-4'>
        <Title>s4 ⚔️</Title>
        <Swordle />
        <Mwt />
        <Sword />
      </div>
    </Main>
  )
}
