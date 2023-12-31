import React from 'react';
import { updateReservationStatus } from '../utils/api';
import { useHistory } from 'react-router-dom';

const Reservation = ({
	first_name,
	last_name,
	mobile_number,
	reservation_date,
	reservation_time,
	people,
	reservation_id,
	formatAsDate,
	formatAsTime,
	status,
}) => {
	const history = useHistory();

	const statusHandler = async e => {
		e.preventDefault();
		const abortController = new AbortController();
		try {
			await updateReservationStatus(
				reservation_id,
				'seated',
				abortController.signal
			);
			history.push(`/reservations/${reservation_id}/seat`);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div>
			<p>
				Name: {first_name} {last_name}
			</p>
			<p>Phone Number: {mobile_number}</p>
			<p>Reservation Date: {formatAsDate(reservation_date)}</p>
			<p>Reservation Time: {formatAsTime(reservation_time)}</p>
			<p>Party of: {people}</p>
			<p data-reservation-id-status={reservation_id}>Status: {status}</p>
			{status === 'booked' && (
				<a href={`/reservations/${reservation_id}/seat`}>
					<button type='button' onClick={statusHandler}>
						Seat
					</button>
				</a>
			)}
		</div>
	);
};

export default Reservation;
