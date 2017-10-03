import { Request, Response, NextFunction } from 'express';
import { getEvents } from '../services/googleCal';


const all = (req: Request, res: Response, next: NextFunction) => {
	getEvents((events: any) => {
		const nextAvailableTime = getNextAvailableTime(events, 4);
		res.json({ data: nextAvailableTime} );
	})
}

function getNextAvailableTime(events: Array<object>, hourBlock: number) {
	let nextAvailableTime = null;
	
	for ( let i = 0; i < events.length - 1; i++) {
		const curEvent = (<any>events)[i];
		const nextEvent = (<any>events)[i+1];
		const curEventDateEnd = new Date(curEvent.end.dateTime);
		const nextEventDateStart = new Date(nextEvent.start.dateTime);
		const nextEventDateEnd = new Date(nextEvent.end.dateTime);

		if (nextEventDateStart.getHours() < 17) {
			continue;
		}

		const difMs : number = nextEventDateStart.getTime() - curEventDateEnd.getTime();
		const difHours = difMs / 1000 / 60 / 60;

		//opening time is 1pm
		const isOpen = curEventDateEnd.getHours() > 12;

		//closing time is 9pm
		const isClosedAfter = curEventDateEnd.getHours() > 17;

		const openMorningSlot = (difHours > hourBlock) && (nextEventDateStart.getHours() > 16);
		const openEveningSlot = (difHours > hourBlock && (curEventDateEnd.getHours() < 18));
		const options = { weekday: 'long', month: 'long', day: 'numeric'};
		if (isOpen) {
			if (openMorningSlot) {
				nextAvailableTime = new Date(nextEventDateStart);
				nextAvailableTime.setHours(13);
				return nextAvailableTime.toLocaleString('en-US', options);
			} else if (openEveningSlot) {
				nextAvailableTime = new Date(curEventDateEnd);
				nextAvailableTime.setHours(17);
				return nextAvailableTime.toLocaleString('en-US', options);		
			}
			
		}
		
	}

	return nextAvailableTime;
}

export {
	all
};