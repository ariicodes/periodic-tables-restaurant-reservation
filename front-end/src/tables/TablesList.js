import React from 'react';

const TablesList = ({ tables }) => {
	return (
		<div>
			{tables.map(table => (
				<div key={table.table_id}>
					<p>Table Name: {table.table_name}</p>
					<p>Capacity: {table.capacity}</p>
					<p>Status: {table.reservation_id ? 'Occupied' : 'Free'}</p>
				</div>
			))}
		</div>
	);
};

export default TablesList;
