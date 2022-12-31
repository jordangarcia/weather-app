export const tempCtoF = (temp: number) => {
	return (temp * 9) / 5 + 32;
};

export const windToMPH = (mps: number) => {
	return mps * 2.23694;
};

// A measure of rainfall intensity shown as the amount of rain that would fall over the course of an hour. Rainfall can be categorized as light (< 0.1 in/h) (< 2.5 mm/h), medium (0.1-0.3 in/h) (2.5-7.6 mm/h), heavy (> 0.3 in/h) (> 7.6 mm/h), or violent (> 2.0 in/h) (> 50 mm/h).
export const rainToMMPerHour = (rain: number) => {
	return rain * 3600;
};
