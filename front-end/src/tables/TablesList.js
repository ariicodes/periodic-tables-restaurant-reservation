const TablesList = ({ tables, handleFinish }) => {
	return (
		<div>
			{tables.map(table => {
				return (
					<div
						key={table.table_id}
						className='card bg-body-tertiary'
						style={{ marginBottom: '10px' }}
					>
						<div className='card-body d-flex flex-column align-items-center text-center'>
							<div>
								<h5 className='fw-bold'>Table • {table.table_name}</h5>
								<p>
									<span className='fw-bold'>Capacity</span> {table.capacity}
								</p>
								<p
									data-table-id-status={table.table_id}
									className={
										table.reservation_id ? 'text-warning' : 'text-success'
									}
								>
									<span className='fw-bold'>Status</span>{' '}
									{table.reservation_id ? 'occupied' : 'free'}
								</p>
							</div>
							{table.reservation_id && (
								<button
									className='btn btn-warning'
									style={{ width: '31%' }}
									type='button'
									data-table-id-finish={table.table_id}
									onClick={() => handleFinish(table)}
								>
									Finish
								</button>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default TablesList;
