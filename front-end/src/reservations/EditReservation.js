import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { readReservation, updateReservation } from '../utils/api';

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

	const handleChange = e => {
		const { name, value } = e.target;
		let newValue =
			name === 'mobile_number'
				? formatPhoneNumber(value)
				: name === 'people'
				? parseInt(value, 10)
				: name === 'reservation_time'
				? value.slice(0, 5)
				: value;

		setFormData({
			...formData,
			[name]: newValue,
		});
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
				});
			} catch (err) {
				setReservationsError(err);
			}
		}

		loadReservation();
	}, [reservation_id]);

	const handleSubmit = async e => {
		e.preventDefault();
		const abortController = new AbortController();

		try {
			const updatedReservation = await updateReservation(
				formData,
				abortController.signal
			);
			console.log('RESERVATION UPDATED:', updatedReservation);
			history.goBack();
		} catch (err) {
			setReservationsError(err);
			console.error('ERROR UPDATING RESERVATION:', err);
		}

		return () => abortController.abort();
	};

	return (
		<div>
			<h1>Edit Reservation</h1>
			<form onSubmit={handleSubmit}>
				<ErrorAlert error={reservationsError} />
				<div>
					<label htmlFor='first_name'>First Name:</label>
					<input
						id='first_name'
						name='first_name'
						type='text'
						value={formData.first_name}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label htmlFor='last_name'>Last Name:</label>
					<input
						id='last_name'
						name='last_name'
						type='text'
						value={formData.last_name}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label htmlFor='mobile_number'>Mobile Number:</label>
					<input
						id='mobile_number'
						name='mobile_number'
						type='text'
						value={formData.mobile_number}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label htmlFor='reservation_date'>Reservation Date:</label>
					<input
						id='reservation_date'
						name='reservation_date'
						type='date'
						value={formData.reservation_date}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label htmlFor='reservation_time'>Reservation Time:</label>
					<input
						id='reservation_time'
						name='reservation_time'
						type='time'
						value={formData.reservation_time}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label htmlFor='people'>Party Size:</label>
					<input
						id='people'
						name='people'
						type='number'
						min='1'
						value={formData.people}
						onChange={handleChange}
						required
					/>
				</div>
				<button type='submit'>Submit</button>
				<button type='button' onClick={history.goBack}>
					Cancel
				</button>
			</form>
		</div>
	);
};

export default EditReservation;
