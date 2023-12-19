import React from 'react';
import { formatAsDate, formatAsTime } from '../utils/date-time';

const ReservationsList = ({ reservations }) => {
	return (
		<div>
			{reservations.map(reservation => (
				<div key={reservation.reservation_id}>
					<p>
						Name: {reservation.first_name} {reservation.last_name}
					</p>
					<p>Phone Number: {reservation.mobile_number}</p>
					<p>
						Date: {formatAsDate(reservation.reservation_date)} | Time:{' '}
						{formatAsTime(reservation.reservation_time)}
					</p>
					<p>Party of {reservation.people}</p>
				</div>
			))}
		</div>
	);
};

export default ReservationsList;
