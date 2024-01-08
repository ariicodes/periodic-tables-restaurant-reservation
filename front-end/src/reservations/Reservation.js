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
		<div
			className={`card ${
				status === 'seated'
					? 'bg-success-subtle'
					: status === 'cancelled'
					? 'bg-danger-subtle'
					: status === 'booked'
					? 'bg-primary-subtle'
					: 'bg-secondary-subtle'
			}`}
			style={{ marginBottom: '10px' }}
		>
			<div className='card-body'>
				<div className='d-flex flex-column align-items-center'>
					<div>
						<h5 className='text-center fw-bold'>
							{first_name} {last_name}
						</h5>
						<p>
							<span className='fw-bold'>Phone Number</span> {mobile_number}
						</p>
						<p>
							<span className='fw-bold'>Reservation Date</span>{' '}
							{formatAsDate(reservation_date)}
						</p>
						<p>
							<span className='fw-bold'>Reservation Time</span>{' '}
							{formatAsTime(reservation_time)}
						</p>
						<p className='text-center'>
							<span className='fw-bold'>Party of</span> {people}
						</p>
						<p
							className={`text-center ${
								status === 'seated'
									? 'text-success'
									: status === 'cancelled'
									? 'text-danger'
									: status === 'booked'
									? 'text-primary'
									: 'text-secondary'
							}`}
							data-reservation-id-status={reservation_id}
						>
							<span className='fw-bold'>Status</span> {status}
						</p>
					</div>
				</div>
				{status === 'booked' && (
					<div className='d-flex flex-column'>
						<div className='d-flex flex-row mb-3 justify-content-evenly'>
							<a
								href={`/reservations/${reservation_id}/seat`}
								style={{ width: '31%' }}
							>
								<button
									type='button'
									onClick={statusHandler}
									className='w-100 px-0 btn btn-primary'
								>
									Seat
								</button>
							</a>
							<a
								href={`/reservations/${reservation_id}/edit`}
								style={{ width: '31%' }}
							>
								<button
									type='button'
									onClick={editClickHandler}
									className='w-100 px-0 btn btn-secondary'
								>
									Edit
								</button>
							</a>
						</div>
						<button
							className='w-75 align-self-center btn btn-danger'
							data-reservation-id-cancel={reservation_id}
							onClick={() => handleCancel(reservation_id)}
						>
							Cancel
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Reservation;
