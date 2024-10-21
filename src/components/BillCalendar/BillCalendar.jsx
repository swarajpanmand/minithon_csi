import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

function BillCalendar({ userData, setUserData }) {
  const handleDateClick = (arg) => {
    // Open a modal to add a new bill
  };

  const handleEventDrop = (info) => {
    // Update the bill date when it's dragged to a new date
    setUserData(prevData => ({
      ...prevData,
      bills: prevData.bills.map(bill => 
        bill.id === info.event.id ? { ...bill, date: info.event.start } : bill
      )
    }));
  };

  return (
    <div className="bill-calendar">
      <h2>Bill Payment Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        events={userData.bills}
        dateClick={handleDateClick}
        eventDrop={handleEventDrop}
      />
    </div>
  );
}

export default BillCalendar;