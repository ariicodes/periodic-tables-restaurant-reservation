import React from 'react';

const CreateReservation = () => {
	return (
		<div>
			<form>
				<div>
					<label htmlFor='first_name'>
						First Name:
						<input type='text' name='first_name' id='first_name' />
					</label>
					<label htmlFor='last_name'>
						Last Name:
						<input type='text' name='last_name' id='last_name' />
					</label>
					<label htmlFor='mobile_number'>
						Phone Number:
						<input type='tel' name='mobile_number' id='mobile_number' />
					</label>
					<label htmlFor='reservation_date'>
						Reservation Date:
						<input type='date' name='reservation_date' id='reservation_date' />
					</label>
					<label htmlFor='reservation_time'>
						Reservation Time:
						<input type='time' name='reservation_time' id='reservation_time' />
					</label>
					<label htmlFor='people'>
						Number of People:
						<input type='number' name='people' id='people' />
					</label>
				</div>
        <div>
          <button type='submit'>Submit</button>
          <button type='cancel'>Cancel</button>
        </div>
			</form>
		</div>
	);
};

export default CreateReservation;
