import  {MouseEventHandler} from 'react'

interface props {
	onClick: MouseEventHandler<HTMLButtonElement>,
	text: string
}

export default function Button({onClick,text}: props) {
  return (
	<button className='w-28 border-black border-2 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-200 mb-3' onClick={onClick} >{text}</button>
	)
}
