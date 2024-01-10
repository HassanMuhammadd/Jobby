import React from 'react'

export default function Landing() {
  return (
	<div className='landing'>
		<div className="content text-white">
			<div className="text px-16 md:px-32 lg:px-52 flex flex-col justify-center h-full">
				<h1 className='text-8xl uppercase'>Find</h1>
				<h2 className='text-xl sm:text-3xl '> Your Dream Job and start your career</h2>
			</div>
		</div>
			<div className="boxes flex flex-row justify-between">
				<div className="box box1 w-1/3 p-4 sm:p-6 text-white">
					<h3 className='text-xs md:text-xl uppercase mb-4'>Web Development</h3>
					<p className='text-xs opacity-75 md:text-md lg:text-base'>Unleash the digital realm with our web wizards! Elevate your online presence with cutting-edge design.</p>
				</div>
				<div className="box box2 w-1/3 p-4 sm:p-6 text-white">
					<h3 className='text-xs md:text-xl uppercase mb-4 '>Engineering</h3>
					<p className='text-xs opacity-75  md:text-md lg:text-base'>Transform dreams into reality with precision and innovation. Our engineering prowess builds bridges to tomorrow, one breakthrough at a time.</p>
				</div>
				<div className="box box3 w-1/3 p-4 sm:p-6 text-white">
					<h3 className='text-xs md:text-xl uppercase mb-4'>Creativity</h3>
					<p className='text-xs opacity-75  md:text-md lg:text-base '>Ignite imagination's spark! We craft wonders from whimsy, turning visions into vibrant realities that captivate and inspire in every brushstroke.</p>
				</div>

			</div>
	</div>
  )
}
