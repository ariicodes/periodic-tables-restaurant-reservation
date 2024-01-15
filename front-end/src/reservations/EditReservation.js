import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { readReservation, updateReservation } from '../utils/api';
import { formatAsTime } from '../utils/date-time';

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
			<div>
				<form onSubmit={handleSubmit} className='container d-flex flex-column'>
					<div className='d-flex flex-column flex-md-row'>
						<label
							htmlFor='first_name'
							className='font-weight-bold'
							style={{ marginRight: '10px' }}
						>
							First Name:
							<input
								id='first_name'
								name='first_name'
								type='text'
								value={formData.first_name}
								onChange={handleChange}
								required
								className='form-control'
							/>
						</label>
						<label
							htmlFor='last_name'
							className='font-weight-bold'
							style={{ marginRight: '10px' }}
						>
							Last Name:
							<input
								id='last_name'
								name='last_name'
								type='text'
								value={formData.last_name}
								onChange={handleChange}
								required
								className='form-control'
							/>
						</label>
						<label
							htmlFor='mobile_number'
							className='font-weight-bold'
							style={{ marginRight: '10px' }}
						>
							Number:
							<input
								id='mobile_number'
								name='mobile_number'
								type='text'
								value={formData.mobile_number}
								onChange={handleChange}
								required
								className='form-control'
							/>
						</label>
						<label
							htmlFor='reservation_date'
							className='font-weight-bold'
							style={{ marginRight: '10px' }}
						>
							Date:
							<input
								id='reservation_date'
								name='reservation_date'
								type='date'
								value={formData.reservation_date}
								onChange={handleChange}
								required
								className='form-control'
							/>
						</label>
						<label
							htmlFor='reservation_time'
							className='font-weight-bold'
							style={{ marginRight: '10px' }}
						>
							Time:
							<input
								id='reservation_time'
								name='reservation_time'
								type='time'
								value={formData.reservation_time}
								onChange={handleChange}
								required
								className='form-control'
							/>
						</label>
						<label
							htmlFor='people'
							className='font-weight-bold'
							style={{ marginRight: '10px' }}
						>
							Party Size:
							<input
								id='people'
								name='people'
								type='number'
								min='1'
								value={formData.people}
								onChange={handleChange}
								className='form-control'
								required
							/>
						</label>
					</div>
					<div className='align-self-center align-self-md-end'>
						<button
							type='submit'
							className='btn btn-primary'
							style={{ marginRight: '10px' }}
						>
							Submit
						</button>
						<button
							type='button'
							onClick={() => history.goBack()}
							className='btn btn-danger'
							style={{ marginRight: '10px' }}
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditReservation;
