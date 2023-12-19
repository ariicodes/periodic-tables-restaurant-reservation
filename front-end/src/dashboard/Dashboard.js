import React, { useEffect, useState } from 'react';
import { listReservations } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import ReservationsList from '../reservations/ReservationsList';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
const Dashboard = ({ date }) => {
	const [reservations, setReservations] = useState([]);
	const [reservationsError, setReservationsError] = useState(null);

	useEffect(() => {
		const loadDashboard = () => {
			const abortController = new AbortController();
			setReservationsError(null);
			listReservations({ date }, abortController.signal)
				.then(setReservations)
				.catch(setReservationsError);
			return () => abortController.abort();
		};
		loadDashboard();
	}, [date]);

	return (
		<main>
			<h1>Dashboard</h1>
			<div className='d-md-flex mb-3'>
				<h4 className='mb-0'>Reservations for date</h4>
			</div>
			{reservations.length === 0 ? (
				<p>No reservations for this date.</p>
			) : (
				<>
					<ErrorAlert error={reservationsError} />
					<ReservationsList reservations={reservations} />
				</>
			)}
		</main>
	);
};

export default Dashboard;
