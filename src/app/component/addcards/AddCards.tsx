"use client";
import React, { useEffect, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddAnotherbtn from "./AddAnotherbtn";
import axios from "axios";
import ModalComponent from "../reusableComponents/ModalComponent";
import CardBody from "../cardbody/CardBody";
import { RootState } from "@/app/Redux/cards.Type";
import { useSelector, useDispatch } from "react-redux";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  FETCH_ALL_CARDS_DATA,
  SET_LOADING,
  SHOW_NEW_COLUMN_FORM,
} from "@/app/Redux/CardsReducer";
import Loader from "../reusableComponents/Loader";
import moment from "moment";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { stripHtml} from "@/app/utils/utils";

const AddCards = () => {
  const [newColumnTitle, setNewColumnTitle] = useState<string>("");
  const [showAddCard, setShowAddCard] = useState<{ [key: string]: boolean }>({});
  const [newCardText, setNewCardText] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState<boolean>(false);
  const [selectCard, setSelectCard] = useState("");
  const [selectCardId, setSelectCardId] = useState("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const { columns, loading, showNewColumnForm } = useSelector(
    (state: RootState) => state.board
  );

  const dispatch = useDispatch();
  
  const handleModalClose = () => {
    setOpen(false);
  };

  const handleAddNewColumn = async () => {
    if (newColumnTitle.trim() === "") return;

    try {
      const token = localStorage.getItem("token");
      const newCol = {
        title: newColumnTitle,
      };
      const response = await axios.post(
        "http://127.0.0.1:5000/api/createColumn",
        newCol,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "SUCCESS") {
        handleGetColumn();
      }
      setNewColumnTitle("");
      dispatch({ type: SHOW_NEW_COLUMN_FORM, payload: false });
    } catch (error) {
      console.error("Error saving description:", error);
    }
  };

  const handleAddCard = (cardTitle: string, cardId: string, complete: boolean) => {
    setSelectCard(cardTitle);
    setSelectCardId(cardId);
    setOpen(true);
    setIsCompleted(complete);
  };

  const handleGetColumn = async () => {
    const token = localStorage.getItem("token");
    dispatch({ type: SET_LOADING, payload: true });
    dispatch({ type: SHOW_NEW_COLUMN_FORM, payload: false });
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/board", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === "SUCCESS") {
        const datauser = response.data.columns;
        dispatch({ type: FETCH_ALL_CARDS_DATA, payload: datauser });
        setNewColumnTitle(response.data.columns[0]?.title || "");
      }
    } catch (error) {
      console.error("Error saving description:", error);
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  useEffect(() => {
    handleGetColumn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddCardToColumn = async (columnId: string) => {
    const token = localStorage.getItem("token");
    const cardTitle = newCardText[columnId];
    if (!cardTitle || cardTitle.trim() === "") return;
    const url = `http://127.0.0.1:5000/api/addcards/${columnId}`;
    const newCard = {
      title: cardTitle,
      color: "blue",
    };
    try {
      const response = await axios.post(url, newCard, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === "SUCCESS") {
        handleGetColumn();
        setNewCardText((prev) => ({ ...prev, [columnId]: "" }));
        setShowAddCard((prev) => ({ ...prev, [columnId]: false }));
      }
    } catch (error) {
      console.error("Error saving description:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  const ShowDate = (startDate?: string, dueDate?: string) => {
    if (!startDate && !dueDate) return null;
    if (!startDate) return (
      <div className="flex space-x-1">
        <AccessTimeIcon sx={{ fontSize: '17px' }} />
        <p className='text-xs pt-0.5'>{moment(dueDate).format('MMM DD')}</p>
      </div>
    );
    else if (!dueDate) return (
      <div className="flex space-x-1">
        <AccessTimeIcon sx={{ fontSize: '17px' }} />
        <p className='text-xs pt-0.5'>Starts:{moment(startDate).format('MMM DD')}</p>
      </div>
    );
    else return (
      <div className="flex space-x-1">
        <AccessTimeIcon sx={{ fontSize: '17px' }} />
        <p className='text-xs pt-0.5'>{moment(startDate).format('MMM DD')}-{moment(dueDate).format('MMM DD')}</p>
      </div>
    );
  };

  const getStatus = (status: boolean) => {
    if (status) {
      return <div className="bg-green-500 rounded-lg py-0 px-2"><span className="text-xs">complete</span></div>;
    } else {
      return <div className="bg-amber-500 rounded-lg py-0 px-2"><span className="text-xs">pending</span></div>;
    }
  };

  return (
    <>
      <div className="flex overflow-x-auto space-x-4 pb-4 h-[calc(100vh-200px)]">
        {columns.map((col) => (
          <div
            key={col._id}
            className="rounded-xl w-64 flex-shrink-0 flex flex-col shadow-sm h-fit max-h-full"
            style={{backgroundColor:'#f1f2f4'}}
          >
            {/* Column Header */}
            <div className="flex justify-between items-center p-2 flex-shrink-0">
              <p className="font-semibold">{col.title}</p>
              <IconButton sx={{ padding: "0px" }}>
                <MoreHorizIcon />
              </IconButton>
            </div>

            {/* Cards Container - Grows with content, has scroll */}
            <div className="overflow-y-auto px-2 py-2 space-y-2 flex-1 min-h-0">
              {col.cards.map((card) => (
                <div
                  key={card._id}
                  className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border hover:border-blue-500"
                  onClick={() => handleAddCard(card.title, card._id, card.complete)}
                >
                  {/* Labels */}
                  {card.label.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {card.label.map((labels) => (
                        <div
                          key={labels.labelColor}
                          style={{
                            backgroundColor: labels.labelColor,
                            borderRadius: "5px",
                            padding: '3px 10px',
                            fontSize: '10px',
                            fontWeight: '600',
                            color: 'white'
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Card Title */}
                  <p className="text-sm font-medium mb-2">{card.title}</p>

                  {/* Card Meta Info */}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-2">
                      {ShowDate(card.startDate, card.dueDate)}
                      {card.description && (
                        <Tooltip title={stripHtml(card.description)}>
                          <DescriptionOutlinedIcon sx={{ color: '#626f86', fontSize: '1.2rem' }} />
                        </Tooltip>
                      )}
                    </div>
                    <div>{getStatus(card.complete)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Card Section - Always at bottom */}
            <div className="p-2 flex-shrink-0">
              {showAddCard[col._id] ? (
                <div>
                  <textarea
                    placeholder="Enter a title for this card..."
                    className="w-full p-2 rounded border resize-none"
                    rows={3}
                    value={newCardText[col._id] || ""}
                    onChange={(e) =>
                      setNewCardText((prev) => ({
                        ...prev,
                        [col._id]: e.target.value,
                      }))
                    }
                  />
                  <div className="flex items-center mt-2 space-x-1">
                    <Button
                      variant="contained"
                      onClick={() => handleAddCardToColumn(col._id)}
                      sx={{
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        padding: "4px 12px",
                        fontSize: "14px"
                      }}
                    >
                      Add Card
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setShowAddCard((prev) => ({ ...prev, [col._id]: false }))
                      }
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                </div>
              ) : (
                <Button
                  startIcon={<AddIcon />}
                  onClick={() =>
                    setShowAddCard((prev) => ({ ...prev, [col._id]: true }))
                  }
                  sx={{
                    textTransform: "capitalize",
                    width: "100%",
                    borderRadius: "8px",
                    justifyContent: "left",
                    color: "text.secondary",
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  Add a card
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Add New Column Section */}
        {!loading &&
          (showNewColumnForm ? (
            <div className="bg-gray-100 p-3 rounded-xl border-2 w-64 flex-shrink-0 h-fit">
              <textarea
                placeholder="Enter list title..."
                className="w-full p-2 rounded border resize-none"
                rows={2}
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
              />
              <div className="flex items-center mt-2 space-x-1">
                <Button
                  variant="contained"
                  onClick={handleAddNewColumn}
                  sx={{
                    textTransform: "capitalize",
                    borderRadius: "8px",
                    padding: "4px 12px",
                    fontSize: "14px"
                  }}
                >
                  Add List
                </Button>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch({ type: SHOW_NEW_COLUMN_FORM, payload: false })
                  }
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
          ) : (
            <AddAnotherbtn
              onClick={() =>
                dispatch({ type: SHOW_NEW_COLUMN_FORM, payload: true })
              }
            />
          ))}
      </div>

      <ModalComponent open={open} onClose={handleModalClose} title={selectCard} cardId={selectCardId} initialComplete={isCompleted}>
        <CardBody cardId={selectCardId} />
      </ModalComponent>
    </>
  );
};

export default AddCards;