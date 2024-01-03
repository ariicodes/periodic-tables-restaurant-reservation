import React from 'react';
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
	handleCancel,
}) => {
	const history = useHistory();

	const statusHandler = async e => {
		e.preventDefault();
		try {
			history.push(`/reservations/${reservation_id}/seat`);
		} catch (err) {
			console.error(err);
		}
	};

	const editClickHandler = async e => {
		e.preventDefault();
		try {
			history.push(`/reservations/${reservation_id}/edit`);
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
				<>
					<a href={`/reservations/${reservation_id}/seat`}>
						<button type='button' onClick={statusHandler}>
							Seat
						</button>
					</a>
					<a href={`/reservations/${reservation_id}/edit`}>
						<button type='button' onClick={editClickHandler}>
							Edit
						</button>
					</a>
					<button
						data-reservation-id-cancel={reservation_id}
						onClick={() => handleCancel(reservation_id)}
					>
						Cancel
					</button>
				</>
			)}
		</div>
	);
};

export default Reservation;
