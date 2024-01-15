import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { createReservation } from '../utils/api';
import ReservationForm from './ReservationForm';

const CreateReservation = () => {
	const history = useHistory();
	const [reservationsError, setReservationsError] = useState(null);

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

	const handleChange = e => {
		const { name, value } = e.target;
		const newValue =
			name === 'mobile_number'
				? formatPhoneNumber(value)
				: name === 'people'
				? parseInt(value, 10)
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
			const newReservation = await createReservation(
				formData,
				abortController.signal
			);
			console.log('RESERVATION ADDED:', newReservation);
			history.push(`/dashboard?date=${formData.reservation_date}`);
		} catch (err) {
			setReservationsError(err);
			console.error('ERROR ADDING RESERVATION:', err);
		}

		return () => abortController.abort();
	};

	return (
		<div className='d-flex flex-column align-items-center'>
			<header>
				<h1 className='text-center font-weight-bold'>Create Reservation</h1>
			</header>
			<ErrorAlert error={reservationsError} />
			<ReservationForm
				formData={formData}
				handleChange={handleChange}
				handleSubmit={handleSubmit}
			/>
		</div>
	);
};

export default CreateReservation;
