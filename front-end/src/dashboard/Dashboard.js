import React, { useEffect, useState } from 'react';
import { listReservations } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import ReservationsList from '../reservations/ReservationsList';
import { formatAsDate, formatAsTime, previous, next } from '../utils/date-time';
import useQuery from '../utils/useQuery';
import { useHistory } from 'react-router-dom';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
	const query = useQuery();
	const urlDate = query.get('date');
	const history = useHistory();
	const [selectedDate, setSelectedDate] = useState(urlDate || date);
	const [reservations, setReservations] = useState([]);
	const [reservationsError, setReservationsError] = useState(null);

	useEffect(() => {
		const abortController = new AbortController();

		function loadDashboard() {
			setReservationsError(null);
			listReservations({ date: urlDate || date }, abortController.signal)
				.then(res => setReservations(res))
				.catch(err => setReservationsError(err));
		}

		loadDashboard();

		return () => abortController.abort();
	}, [urlDate, date]);

	const previousHandler = () => {
		const newDate = previous(selectedDate);
		setSelectedDate(newDate);
		history.push(`/dashboard?date=${newDate}`);
	};

	const todayHandler = () => {
		setSelectedDate(date);
		history.push(`/dashboard?date=${date}`);
	};

	const nextHandler = () => {
		const newDate = next(selectedDate);
		setSelectedDate(newDate);
		history.push(`/dashboard?date=${newDate}`);
	};

	return (
		<main>
			<h1>Dashboard</h1>
			<div className='d-md-flex mb-3'>
				<h4 className='mb-0'>Reservations for {urlDate || date}</h4>
			</div>
			<div>
				<button type='button' onClick={previousHandler}>
					Previous
				</button>
				<button type='button' onClick={todayHandler}>
					Today
				</button>
				<button type='button' onClick={nextHandler}>
					Next
				</button>
			</div>
			<ErrorAlert error={reservationsError} />
			<div>
				{reservations.length > 0 ? (
					<ReservationsList
						reservations={reservations}
						formatAsDate={formatAsDate}
						formatAsTime={formatAsTime}
					/>
				) : (
					<h5>No reservations</h5>
				)}
			</div>
		</main>
	);
}

export default Dashboard;
