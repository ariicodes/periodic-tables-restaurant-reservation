import React, { useEffect, useState } from 'react';
import {
	listReservations,
	listTables,
	finishTable,
	updateReservationStatus,
} from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import Reservation from '../reservations/Reservation';
import { formatAsDate, formatAsTime, previous, next } from '../utils/date-time';
import useQuery from '../utils/useQuery';
import { useHistory } from 'react-router-dom';
import TablesList from '../tables/TablesList';

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
	const [tables, setTables] = useState([]);
	const [tablesError, setTablesError] = useState(null);

	useEffect(() => {
		const abortController = new AbortController();

		function loadDashboard() {
			setReservationsError(null);
			listReservations({ date: urlDate || date }, abortController.signal)
				.then(res => setReservations(res))
				.catch(err => setReservationsError(err));

			setTablesError(null);
			listTables(abortController.signal)
				.then(res => setTables(res))
				.catch(err => setTablesError(err));
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

	const handleFinish = async table => {
		const result = window.confirm(
			'Is this table ready to seat new guests? This cannot be undone.'
		);

		if (result) {
			const abortController = new AbortController();
			try {
				await finishTable(
					table.table_id,
					table.reservation_id,
					abortController.signal
				);

				const updatedReservations = await listReservations(
					{ date: selectedDate },
					abortController.signal
				);
				setReservations(updatedReservations);

				const updatedTables = await listTables(abortController.signal);
				setTables(updatedTables);

				history.push(`/dashboard?date=${selectedDate}`);
			} catch (err) {
				setTablesError(err);
			}
		}
	};

	const handleCancel = async reservationId => {
		const result = window.confirm(
			'Do you want to cancel this reservation? This cannot be undone.'
		);
		if (result) {
			const abortController = new AbortController();
			try {
				await updateReservationStatus(
					reservationId,
					'cancelled',
					abortController.signal
				);

				const updatedReservations = await listReservations(
					{ date: selectedDate },
					abortController.signal
				);
				setReservations(updatedReservations);

				history.push(`/dashboard?date=${selectedDate}`);
			} catch (err) {
				console.error(err);
			}
		}
	};

	return (
		<main>
			<div className='d-flex flex-column align-items-center'>
				<h1 className='font-weight-bold'>Dashboard</h1>
				<div className='d-md-flex mb-3'>
					<h4 className='mb-0 text-center'>
						Reservations for{' '}
						<span className='font-weight-bold'>{urlDate || date}</span>
					</h4>
				</div>
				<div className='container' style={{ marginBottom: '12px' }}>
					<div className='row gx-5 gy-2'>
						<div className='col-md' style={{ marginBottom: '12px' }}>
							<button
								type='button'
								onClick={previousHandler}
								className='btn btn-info w-100'
							>
								Previous
							</button>
						</div>
						<div className='col-md' style={{ marginBottom: '12px' }}>
							<button
								type='button'
								onClick={todayHandler}
								className='btn btn-info w-100 font-weight-bold'
							>
								Today
							</button>
						</div>
						<div className='col-md'>
							<button
								type='button'
								onClick={nextHandler}
								className='btn btn-info w-100'
							>
								Next
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className='container'>
				<div className='row g-4'>
					<div className='col-md'>
						<ErrorAlert error={reservationsError} />
						{reservations.length > 0 ? (
							reservations.map(
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
											handleCancel={handleCancel}
										/>
									</div>
								)
							)
						) : (
							<h4 className='font-weight-bold'>No reservations</h4>
						)}
					</div>
					<div className='col-md'>
						<h4 className='text-center font-weight-bold'>Tables</h4>
						<ErrorAlert error={tablesError} />
						<TablesList tables={tables} handleFinish={handleFinish} />
					</div>
				</div>
			</div>
		</main>
	);
}

export default Dashboard;
