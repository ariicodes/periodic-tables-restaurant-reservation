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
		<div>
			<header>
				<h1>Create Table</h1>
			</header>
			<ErrorAlert error={tableError} />
			<div>
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor='table_name'>Table Name:</label>
						<input
							type='text'
							name='table_name'
							id='table_name'
							minLength={2}
							required
							value={formData.table_name}
							onChange={handleChange}
						/>
					</div>
					<div>
						<label htmlFor='capacity'>Capacity:</label>
						<input
							type='number'
							name='capacity'
							id='capacity'
							required
							value={formData.capacity}
							onChange={handleChange}
						/>
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

export default CreateTable;
