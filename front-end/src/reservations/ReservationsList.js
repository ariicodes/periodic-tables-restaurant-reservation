import React from 'react';

const ReservationsList = ({
	first_name,
	last_name,
	mobile_number,
	reservation_date,
	reservation_time,
	people,
	reservation_id,
	formatAsDate,
	formatAsTime,
}) => {
	return (
		<div>
			<p>
				Name: {first_name} {last_name}
			</p>
			<p>Phone Number: {mobile_number}</p>
			<p>Reservation Date: {formatAsDate(reservation_date)}</p>
			<p>Reservation Time: {formatAsTime(reservation_time)}</p>
			<p>Party of: {people}</p>
			<a href={`/reservations/${reservation_id}/seat`}>
				<button type='button'>Seat</button>
			</a>
		</div>
	);
};

export default ReservationsList;
