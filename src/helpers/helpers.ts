export function formatNumber(num:number){
	const formatted_price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
	return formatted_price;
}
export function handleInputChange(e:any) {
	let target = e.target
	if (e.target.type !== 'range') {
		target = document.getElementById('range')
	}
	const min = target.min
	const max = target.max
	const val = target.value
	let percentage = (val - min) * 100 / (max - min)

	if (document.documentElement.dir === 'rtl') {
		percentage = (max - val)
	}

	target.style.backgroundSize = percentage + '% 100%'
}


/*
export function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(async (position) => {
		const lat = position.coords.latitude;
		const long =position.coords.longitude;
		const address = await getAddress(lat, long);
		return address.city;
	});
	}
}

export async function getAddress( latitude:number, longitude:number ) {
	const res = await fetch(
		`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`
	);
	if (!res.ok) throw Error("Failed getting address");

	const data = await res.json();
	return data;
}
*/