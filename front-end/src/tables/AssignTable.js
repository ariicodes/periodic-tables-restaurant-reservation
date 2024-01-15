import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { listTables, assignTable, updateReservationStatus } from '../utils/api';

const AssignTable = () => {
	const history = useHistory();
	const { reservation_id } = useParams();
	const [tableError, setTableError] = useState(null);
	const [selectedTable, setSelectedTable] = useState(null);
	const [tables, setTables] = useState([]);

	useEffect(() => {
		const abortController = new AbortController();
		function loadTables() {
			setTableError(null);
			listTables(abortController.signal)
				.then(res => setTables(res))
				.catch(err => setTableError(err));
		}

		loadTables();

		return () => abortController.abort();
	}, []);

	const handleChange = e => {
		setSelectedTable(parseInt(e.target.value));
	};

	const handleSubmit = async e => {
		e.preventDefault();
		const abortController = new AbortController();

		try {
			await assignTable(selectedTable, parseInt(reservation_id));
			await updateReservationStatus(
				reservation_id,
				'seated',
				abortController.signal
			);
			history.push(`/dashboard`);
		} catch (err) {
			setTableError(err);
			console.error('ERROR ASSIGNING TABLE:', err);
		}
	};

	return (
		<div className='container'>
			<header>
				<h1 className='text-center font-weight-bold'>Assign Table</h1>
			</header>
			<ErrorAlert error={tableError} />
			<form onSubmit={handleSubmit}>
				<div className='container d-flex flex-column'>
					<label htmlFor='seat' className='font-weight-bold'>
						Assign Reservation to a Table:
					</label>
					<select
						name='table_id'
						id='seat'
						onChange={handleChange}
						className='custom-select'
						style={{ marginBottom: '8px' }}
					>
						<option value=''>--Please choose a seat--</option>
						{tables.map(table => (
							<option key={table.table_id} value={table.table_id}>
								{table.table_name} - {table.capacity}
							</option>
						))}
					</select>
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
							// style={{ marginRight: '10px' }}
						>
							Cancel
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default AssignTable;
