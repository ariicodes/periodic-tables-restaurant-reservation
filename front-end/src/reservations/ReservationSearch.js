import React, { useState } from 'react';
import { listReservations } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import Reservation from './Reservation';
import { formatAsDate, formatAsTime } from '../utils/date-time';

const ReservationSearch = () => {
	const [mobileNumber, setMobileNumber] = useState('');
	const [reservations, setReservations] = useState([]);
	const [reservationsError, setReservationsError] = useState(null);

	const handleChange = ({ target }) => {
		setMobileNumber(target.value);
	};

	const findReservations = async () => {
		const abortController = new AbortController();
		setReservationsError(null);
		try {
			const response = await listReservations(
				{ mobile_number: mobileNumber },
				abortController.signal
			);
			setReservations(response);
		} catch (error) {
			setReservationsError(error);
		}
		return () => abortController.abort();
	};

	const handleSubmit = event => {
		event.preventDefault();
		findReservations();
	};

	return (
		<div>
			<ErrorAlert error={reservationsError} />
			<form onSubmit={handleSubmit}>
				<label htmlFor='mobile_number'>Enter a customer's phone number:</label>
				<input
					name='mobile_number'
					id='mobile_number'
					type='tel'
					onChange={handleChange}
					value={mobileNumber}
					required
				/>
				<button type='submit'>Find</button>
			</form>
			<div>
				{reservations.length > 0 ? (
					<div>
          <h4>Reservations:</h4>
						{reservations.map(
							({
								first_name,
								last_name,
								mobile_number,
								reservation_date,
								reservation_time,
								people,
								reservation_id,
								status,
							}) => (
								<div key={reservation_id}>
									<Reservation
										first_name={first_name}
										last_name={last_name}
										mobile_number={mobile_number}
										reservation_date={reservation_date}
										reservation_time={reservation_time}
										people={parseInt(people)}
										reservation_id={parseInt(reservation_id)}
										formatAsDate={formatAsDate}
										formatAsTime={formatAsTime}
										status={status}
									/>
								</div>
							)
						)}
					</div>
				) : (
					<h5>No reservations found</h5>
				)}
			</div>
		</div>
	);
};

export default ReservationSearch;
