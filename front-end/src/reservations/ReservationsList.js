import React from 'react';

const ReservationsList = ({ reservations, formatAsDate, formatAsTime }) => {
	return (
		<div>
      {reservations.map((reservation) => (
        <div key={reservation.reservation_id}>
          <p>Name: {reservation.first_name} {reservation.last_name}</p>
          <p>Phone Number: {reservation.mobile_number}</p>
          <p>Reservation Date: {formatAsDate(reservation.reservation_date)}</p>
          <p>Reservation Time: {formatAsTime(reservation.reservation_time)}</p>
          <p>Party of {reservation.people}</p>
        </div>
      ))}
		</div>
	);
};

export default ReservationsList;
