"use client";
import React, { useEffect, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddAnotherbtn from "./AddAnotherbtn";
import axios from "axios";
import ModalComponent from "../reusableComponents/ModalComponent";
import CardBody from "../cardbody/CardBody";
import { RootState } from "@/app/Redux/cards.Type";
import { useSelector, useDispatch } from "react-redux";
import {
  FETCH_ALL_CARDS_DATA,
  SET_LOADING,
  SHOW_NEW_COLUMN_FORM,
} from "@/app/Redux/CardsReducer";
import Loader from "../reusableComponents/Loader";

const AddCards = () => {
  // const [columns, setColumns] = useState<Column[]>([]);
  const [newColumnTitle, setNewColumnTitle] = useState<string>("");
  // const [showNewColumnForm, setShowNewColumnForm] = useState<boolean>(false);
  const [showAddCard, setShowAddCard] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [newCardText, setNewCardText] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState<boolean>(false);
  const [selectCard, setSelectCard] = useState("");
  const [selectCardId, setSelectCardId] = useState("");
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
      console.log("token", token);
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
      // setColumns(response.data);
      setNewColumnTitle("");
      // setShowNewColumnForm(false);
      dispatch({ type: SHOW_NEW_COLUMN_FORM, payload: false });
    } catch (error) {
      //emptyu
    }
  };
  const handleAddCard = (cardTitle: string, cardId: string) => {
    setSelectCard(cardTitle);
    setSelectCardId(cardId);
    setOpen(true);
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
      console.log(columns);
    } catch (error) {
      //empty
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  useEffect(() => {
    handleGetColumn();
  }, []);

  const handleAddCardToColumn = async (columnId: string) => {
    const token = localStorage.getItem("token");
    const cardTitle = newCardText[columnId];
    if (!cardTitle || cardTitle.trim() === "") return;
    const url = `http://127.0.0.1:5000/api/addcards/${columnId}`;
    const newCard = {
      title: cardTitle,
      color: "blue",
      // label:[
      //   {labelColor,labelTitle}
      // ]
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
      //empty
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-5 gap-4">
        {columns.map((col) => (
          <div
            key={col._id}
            className="bg-green-50 p-2 rounded-lg border-2 overflow-y-auto h-4/5"
          >
            <div className="flex justify-between items-center mb-2">
              <p>{col.title}</p>
              <IconButton sx={{ padding: "0px" }}>
                <MoreHorizIcon />
              </IconButton>
            </div>

            {col.cards.map((card) => (
              <div
                key={card._id}
                className="p-2 mb-1 bg-white rounded shadow"
                onClick={() => handleAddCard(card.title, card._id)}
              >
                <div className=" flex space-x-1">
                {card.label.map((labels) => (
                  <div
                    key={labels.labelColor}
                  
                  >
                    <div
                      style={{
                        backgroundColor: labels.labelColor,
                        borderRadius: "5px",
                         padding:'2px 5px',
                         fontSize:'10px'
                      }}
                    >
                      {labels.labelTitle}
                    </div>
                  </div>
                ))}
                </div>
                <p>{card.title}</p>
              </div>
            ))}

            {showAddCard[col._id] ? (
              <div>
                <textarea
                  placeholder="Enter a title for this card..."
                  className="w-full p-2 rounded border"
                  value={newCardText[col._id] || ""}
                  onChange={(e) =>
                    setNewCardText((prev) => ({
                      ...prev,
                      [col._id]: e.target.value,
                    }))
                  }
                />
                <div className="flex items-center mt-1">
                  <Button
                    variant="contained"
                    onClick={() => handleAddCardToColumn(col._id)}
                    sx={{
                      textTransform: "capitalize",
                      borderRadius: "8px",
                      padding: "0px 10px",
                    }}
                  >
                    Add Card
                  </Button>
                  <IconButton
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
                }}
              >
                Add Cards
              </Button>
            )}
          </div>
        ))}

        {!loading &&
          (showNewColumnForm ? (
            <div className="bg-gray-100 p-2 rounded-lg border-2 w-64">
              <textarea
                placeholder="Enter list title..."
                className="w-full p-2 rounded border"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
              />
              <div className="flex items-center mt-1">
                <Button
                  variant="contained"
                  onClick={handleAddNewColumn}
                  sx={{
                    textTransform: "capitalize",
                    borderRadius: "8px",
                    padding: "0px 10px",
                  }}
                >
                  Add Another Card
                </Button>
                <IconButton
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

      <ModalComponent open={open} onClose={handleModalClose} title={selectCard}>
        <CardBody cardId={selectCardId} />
      </ModalComponent>
    </>
  );
};

export default AddCards;
