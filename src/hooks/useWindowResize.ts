import {useEffect, useState} from "react";

export function useWindowResize(setter:Function,sizeLimit:number){

	const [screenWidth, setScreenWidth] = useState(window.innerWidth);

	const updateScreenWidth = () => {
		setScreenWidth(window.innerWidth);
	};

	useEffect(() => {
		window.onload = () => {
			if(window.innerWidth>sizeLimit)
			{
				setter(true);
			}

		}
		window.addEventListener('resize', updateScreenWidth);
		if (screenWidth > sizeLimit) {
			setter(true);
		}else
		setter(false)

		return () => {
			window.removeEventListener('resize', updateScreenWidth);
		};
	}, [screenWidth,setter,sizeLimit]);
	return screenWidth;
}