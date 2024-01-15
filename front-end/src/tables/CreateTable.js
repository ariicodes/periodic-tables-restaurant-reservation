import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { createTable } from '../utils/api';

const CreateTable = () => {
	const history = useHistory();
	const [tableError, setTableError] = useState(null);

	const initialFormData = {
		table_name: '',
		capacity: 0,
	};

	const [formData, setFormData] = useState(initialFormData);

	const handleChange = e => {
		const { name, value } = e.target;
		const newValue = name === 'capacity' ? parseInt(value, 10) : value;

		setFormData({
			...formData,
			[name]: newValue,
		});
	};

	const handleSubmit = async e => {
		e.preventDefault();
		const abortController = new AbortController();

		try {
			const newTable = await createTable(formData, abortController.signal);
			console.log('TABLE ADDED:', newTable);
			history.push(`/dashboard`);
		} catch (err) {
			setTableError(err);
			console.error('ERROR ADDING TABLE:', err);
		}
	};

	return (
		<div className='d-flex flex-column align-items-center'>
			<header>
				<h1 className='text-center font-weight-bold'>Create Table</h1>
			</header>
			<ErrorAlert error={tableError} />
			<div>
				<form onSubmit={handleSubmit} className='container d-flex flex-column'>
					<div className='d-flex flex-column flex-md-row'>
						<label
							htmlFor='table_name'
							className='font-weight-bold'
							style={{ marginRight: '10px' }}
						>
							Table Name:
							<input
								type='text'
								name='table_name'
								id='table_name'
								minLength={2}
								required
								value={formData.table_name}
								onChange={handleChange}
								className='form-control'
							/>
						</label>
						<label
							htmlFor='capacity'
							className='font-weight-bold'
							style={{ marginRight: '10px' }}
						>
							Capacity:
							<input
								type='number'
								name='capacity'
								id='capacity'
								required
								value={formData.capacity}
								onChange={handleChange}
								className='form-control'
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

export default CreateTable;
