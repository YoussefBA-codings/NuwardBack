const sqr = (x) => {
	return x * x;
};

const distanceBetweenTwoPoints = (x1, y1, x2, y2) => {
	return Math.sqrt(sqr(y2 - y1) + sqr(x2 - x1));
};

const findPlace = (caseAlloue, lRepere, xMax, yMax, lDefault, id) => new Promise(
	(resolve, reject) => {
		const keys = Object.keys(JSON.parse(caseAlloue));
		if (keys.includes(id) === true) {
			// eslint-disable-next-line prefer-promise-reject-errors
			reject({ error: 'user already existing' });
		}
		if (lDefault < lRepere) {
		// eslint-disable-next-line prefer-promise-reject-errors
			reject({ error: 'size of the box not adapted' });
		}
		caseAlloue = JSON.parse(caseAlloue);
		const total = keys.length;
		let findX;
		let findY;
		let noPlace = 0;
		if ((lDefault / lRepere) % 2 === 0) {
			findX = (lDefault / lRepere) * (lRepere / 2);
			findY = (lDefault / lRepere) * (lRepere / 2);
			for (let i = 0; i < total; i++) {
				if (findX === caseAlloue[keys[i]].x || findY === caseAlloue[keys[i]].y) {
					const plusGrandCote = lDefault > caseAlloue[keys[i]].d ? lDefault : caseAlloue[keys[i]].d;
					if (distanceBetweenTwoPoints(findX, findY, caseAlloue[keys[i]].x, caseAlloue[keys[i]].y) < plusGrandCote) {
						if (findX <= (xMax - lRepere)) {
							findX += lRepere;
							i = -1;
						} else if (findX === (xMax - lRepere) && findY <= (yMax - lRepere)) {
							findY += lRepere;
							findX = lRepere;
							i = -1;
						} else if (findX === (xMax - lRepere) && findY === (yMax - lRepere)) {
							i = total - 1;
							noPlace = 1;
						}
					}
				} else {
					const distanceEntreLesDeuxCentres = distanceBetweenTwoPoints(findX, findY, caseAlloue[keys[i]].x, caseAlloue[keys[i]].y);
					const ref = Math.round(Math.sqrt(Math.abs(sqr(distanceEntreLesDeuxCentres) - sqr(1 / 2 * lRepere))));
					if (ref < ((lDefault + caseAlloue[keys[i]].d) / 2)) {
						if (findX < (xMax - lRepere)) {
							findX += lRepere;
							i = -1;
						} else if (findX === (xMax - lRepere) && findY <= (yMax - lRepere)) {
							findY += lRepere;
							findX = lRepere;
							i = -1;
						} else if (findX === (xMax - lRepere) && findY === (yMax - lRepere)) {
							i = total - 1;
							noPlace = 1;
						}
					}
				}
			}
		} else {
			findX = (lDefault / lRepere) * (lRepere / 2);
			findY = (lDefault / lRepere) * (lRepere / 2);
			for (let j = 0; j < total; j++) {
				if (findX === caseAlloue[keys[j]].x || findY === caseAlloue[keys[j]].y) {
					const plusGrandCote = lDefault > caseAlloue[keys[j]].d ? lDefault : caseAlloue[keys[j]].d;
					if (distanceBetweenTwoPoints(findX, findY, caseAlloue[keys[j]].x, caseAlloue[keys[j]].y) < plusGrandCote) {
						if (findX <= (xMax - lRepere)) {
							findX += (lRepere / 2);
							j = -1;
						} else if (findX === (xMax - lRepere) && findY <= (yMax - lRepere)) {
							findY += (lRepere / 2);
							findX = (lRepere / 2);
							j = -1;
						} else if (findX === (xMax - (lRepere / 2)) && findY === (yMax - (lRepere / 2))) {
							j = total - 1;
							noPlace = 1;
						}
					}
				} else {
					const distanceEntreLesDeuxCentres = distanceBetweenTwoPoints(findX, findY, caseAlloue[keys[j]].x, caseAlloue[keys[j]].y);
					const ref = Math.round(Math.sqrt(Math.abs(sqr(distanceEntreLesDeuxCentres) - sqr(1 / 2 * lRepere))));
					if (ref < ((lDefault + caseAlloue[keys[j]].d) / 2)) {
						if (findX <= (xMax - lRepere)) {
							findX += (lRepere / 2);
							j = -1;
						} else if (findX === (xMax - lRepere) && findY <= (yMax - lRepere)) {
							findY += (lRepere / 2);
							findX = (lRepere / 2);
							j = -1;
						} else if (findX === (xMax - (lRepere / 2)) && findY === (yMax - (lRepere / 2))) {
							j = total - 1;
							noPlace = 1;
						}
					}
				}
			}
		}

		if (noPlace !== 1) {
			caseAlloue[id] = {
				x: findX,
				y: findY,
				d: lDefault
			};
		}
		resolve(caseAlloue);
	}
);

module.exports = findPlace;
