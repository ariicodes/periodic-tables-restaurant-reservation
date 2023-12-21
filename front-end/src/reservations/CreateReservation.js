import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { createReservation } from '../utils/api';

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
		<div>
			<ErrorAlert error={reservationsError} />
			<div>
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor='first_name'>
							First Name:
							<input
								type='text'
								name='first_name'
								id='first_name'
								required
								value={formData.first_name}
								onChange={handleChange}
							/>
						</label>
						<label htmlFor='last_name'>
							Last Name:
							<input
								type='text'
								name='last_name'
								id='last_name'
								required
								value={formData.last_name}
								onChange={handleChange}
							/>
						</label>
						<label htmlFor='mobile_number'>
							Phone Number:
							<input
								type='tel'
								name='mobile_number'
								id='mobile_number'
								required
								value={formData.mobile_number}
								onChange={handleChange}
							/>
						</label>
						<label htmlFor='reservation_date'>
							Reservation Date:
							<input
								type='date'
								placeholder='YYYY-MM-DD'
								pattern='\d{4}-\d{2}-\d{2}'
								name='reservation_date'
								id='reservation_date'
								required
								value={formData.reservation_date}
								onChange={handleChange}
							/>
						</label>
						<label htmlFor='reservation_time'>
							Reservation Time:
							<input
								type='time'
								placeholder='HH:MM'
								pattern='[0-9]{2}:[0-9]{2}'
								name='reservation_time'
								id='reservation_time'
								required
								value={formData.reservation_time}
								onChange={handleChange}
							/>
						</label>
						<label htmlFor='people'>
							Number of People:
							<input
								type='number'
								name='people'
								id='people'
								value={formData.people}
								onChange={handleChange}
							/>
						</label>
					</div>
					<div>
						<button type='submit'>Submit</button>
						<button type='button' onClick={() => history.goBack()}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateReservation;
