const TablesList = ({ tables, handleFinish }) => {
	return (
		<div>
			{tables.map(table => {
				return (
					<div
						key={table.table_id}
						className='card'
						style={{ marginBottom: '10px' }}
					>
						<div className='card-body text-center'>
							<div style={{ marginBottom: '-10px'}}>
								<h5 className='font-weight-bold'>Table • {table.table_name}</h5>
								<p>
									<span className='font-weight-bold'>Capacity</span>{' '}
									{table.capacity}
								</p>
								<p
									data-table-id-status={table.table_id}
									className={
										table.reservation_id ? 'text-warning' : 'text-success'
									}
								>
									<span className='font-weight-bold'>Status</span>{' '}
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
