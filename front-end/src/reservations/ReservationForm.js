import React from 'react';
import { useHistory } from 'react-router-dom';

const ReservationForm = ({
	formData,
	handleChange,
	handleSubmit,
}) => {
	const history = useHistory();

	return (
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
							value={formData.people}
							onChange={handleChange}
							required
							className='form-control'
						/>
					</label>
				</div>
				<div className='d-flex flex-column flex-md-row'>
					<button
						type='submit'
						className='btn btn-primary'
						style={{ marginRight: '10px' }}
					>
						Submit
					</button>
					<button
						type='button'
						className='btn btn-secondary'
						onClick={() => history.goBack()}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default ReservationForm;
