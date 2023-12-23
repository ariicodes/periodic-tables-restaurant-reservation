import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { listTables, assignTable } from '../utils/api';

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

		try {
			await assignTable(selectedTable, parseInt(reservation_id));
			history.push(`/dashboard`);
		} catch (err) {
			setTableError(err);
			console.error('ERROR ASSIGNING TABLE:', err);
		}
	};

	return (
		<div>
			<header>
				<h1>Assign Table</h1>
			</header>
			<ErrorAlert error={tableError} />
			<div>
				<form onSubmit={handleSubmit}>
					<label htmlFor='seat'>Assign Reservation to a Table:</label>
					<select name='table_id' id='seat' onChange={handleChange}>
						<option value=''>--Please choose a seat--</option>
						{tables.map(table => (
							<option key={table.table_id} value={table.table_id}>
								{table.table_name} - {table.capacity}
							</option>
						))}
					</select>
					<button type='submit'>Submit</button>
					<button type='button' onClick={() => history.goBack()}>
						Cancel
					</button>
				</form>
			</div>
		</div>
	);
};

export default AssignTable;
