import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { createReservation } from '../utils/api';

const CreateReservation = () => {
	const initialFormData = {
		first_name: '',
		last_name: '',
		mobile_number: '',
		reservation_date: '',
		reservation_time: '',
		people: 1,
	};

	const [formData, setFormData] = useState(initialFormData);
	const [reservationsError, setReservationsError] = useState(null);

	const history = useHistory();

	const handleChange = e => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async e => {
		e.preventDefault();
		const abortController = new AbortController();

		try {
			const response = await createReservation(
				formData,
				abortController.signal
			);
			const data = await response.json();
			console.log('RESERVATION ADDED:', data);
			history.push(`/dashboard?date=${formData.reservation_date}`);
		} catch (err) {
			setReservationsError(err);
			console.error(err);
		}

		return () => abortController.abort();
	};

	return (
		<div>
			<ErrorAlert error={reservationsError} />
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
							required
							value={formData.people}
							onChange={handleChange}
						/>
					</label>
				</div>
				<div>
					<button type='submit'>Submit</button>
					<button type='cancel' onClick={() => history.goBack()}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreateReservation;
