/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import ModalComponent from "../reusableComponents/ModalComponent";
import CardBody from "../cardbody/CardBody";
import { useDispatch, useSelector } from "react-redux";
import { FETCH_ALL_CARDS_DATA } from "@/app/Redux/CardsReducer";
import { RootState } from "@/app/Redux/cards.Type";

export default function CalendarView() {
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [selectedCardTitle, setSelectedCardTitle] = useState<string>("");
  const [selectedCardComplete, setSelectedCardComplete] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  
  const { columns } = useSelector((state: RootState) => state.board);
  const handleModalClose = () => {
    setOpenModal(false);
    
    fetchTasks();
    
    setTimeout(() => {
      setSelectedCardId("");
      setSelectedCardTitle("");
      setSelectedCardComplete(false);
    }, 300);
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:5000/api/board", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "SUCCESS") {
        const columns = response.data.columns || [];
        
        dispatch({ type: FETCH_ALL_CARDS_DATA, payload: columns });

        console.log("Calendar data updated");
      }
    } catch (err) {
      console.error("Error fetching board data:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const events = React.useMemo(() => {
    const formattedEvents = columns.flatMap((col: any) =>
      col.cards
        .filter((card: any) => card.startDate || card.dueDate)
        .map((card: any) => ({
          id: card._id,
          title: card.title,
          start: card.startDate || card.dueDate,
          end: card.dueDate || card.startDate,
          backgroundColor: card.complete ? "#22c55e" : "#a855f7",
          borderColor: card.complete ? "#22c55e" : "#a855f7",
          extendedProps: {
            cardId: card._id,
            complete: card.complete || false,
            description: card.description,
            labels: card.label || [],
            columnTitle: col.title,
          },
        }))
    );

    return formattedEvents;
  }, [columns]); 

  const handleEventClick = (clickInfo: any) => {
    console.log("Event clicked:", clickInfo.event);

    const cardId = clickInfo.event.id;
    const cardTitle = clickInfo.event.title;
    const cardComplete = clickInfo.event.extendedProps.complete || false;

    setSelectedCardId(cardId);
    setSelectedCardTitle(cardTitle);
    setSelectedCardComplete(cardComplete);
    setOpenModal(true);
  };

  return (
    <div className="calendar-wrapper p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="85vh"
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
      />

      {selectedCardId && (
        <ModalComponent
          open={openModal}
          onClose={handleModalClose}
          cardId={selectedCardId}
          title={selectedCardTitle}
          initialComplete={selectedCardComplete}
        >
          <CardBody cardId={selectedCardId} />
        </ModalComponent>
      )}
    </div>
  );
}