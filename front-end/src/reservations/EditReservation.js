import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { readReservation, updateReservation } from '../utils/api';
import { formatAsTime } from '../utils/date-time';
import ReservationForm from './ReservationForm';

const EditReservation = () => {
	const history = useHistory();
	const [reservationsError, setReservationsError] = useState(null);
	const { reservation_id } = useParams();

	const initialFormData = {
		first_name: '',
		last_name: '',
		mobile_number: '',
		reservation_date: '',
		reservation_time: '',
		people: 1,
	};

	const [formData, setFormData] = useState(initialFormData);

	const formatPhoneNumber = input => {
		const cleaned = input.replace(/\D/g, ''); // Removes non-digit characters
		const formattedNumber = cleaned.replace(
			/(\d{3})(\d{3})(\d{4})/,
			'$1-$2-$3'
		);
		return formattedNumber;
	};

	useEffect(() => {
		const abortController = new AbortController();

		async function loadReservation() {
			setReservationsError(null);
			try {
				const reservation = await readReservation(
					reservation_id,
					abortController.signal
				);
				setFormData({
					...reservation,
					reservation_date: reservation.reservation_date.slice(0, 10),
					reservation_time: formatAsTime(reservation.reservation_time),
				});
			} catch (err) {
				setReservationsError(err);
			}
		}

		loadReservation();
	}, [reservation_id]);

	const handleChange = e => {
		const { name, value } = e.target;
		const newValue =
			name === 'mobile_number'
				? formatPhoneNumber(value)
				: name === 'people'
				? parseInt(value, 10)
				: name === 'reservation_time'
				? formatAsTime(value)
				: value;

		setFormData({
			...formData,
			[name]: newValue,
		});
	};

	const handleSubmit = async e => {
		e.preventDefault();
		const abortController = new AbortController();

		try {
			await updateReservation(formData, abortController.signal);

			history.push(`/dashboard?date=${formData.reservation_date}`);
		} catch (err) {
			setReservationsError(err);
			console.error('ERROR UPDATING RESERVATION:', err);
		}

		return () => abortController.abort();
	};

	return (
		<div className='d-flex flex-column align-items-center'>
			<header>
				<h1 className='text-center font-weight-bold'>Edit Reservation</h1>
			</header>
			<ErrorAlert error={reservationsError} />
			<ReservationForm
				formData={formData}
				handleChange={handleChange}
				handleSubmit={handleSubmit} />
		</div>
	);
};

export default EditReservation;
