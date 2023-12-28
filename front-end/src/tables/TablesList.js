const TablesList = ({ tables, handleFinish }) => {
	return (
		<div>
			{tables.map(table => {
				return (
					<div key={table.table_id}>
						<p>Table Name: {table.table_name}</p>
						<p>Capacity: {table.capacity}</p>
						<p data-table-id-status={table.table_id}>
							Status: {table.reservation_id ? 'Occupied' : 'Free'}
						</p>
						{table.reservation_id && (
							<button
								type='button'
								data-table-id-finish={table.table_id}
								onClick={() => handleFinish(table)}
							>
								Finish
							</button>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default TablesList;
