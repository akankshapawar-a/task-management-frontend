"use client";
import React, { useEffect, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddAnotherbtn from "./AddAnotherbtn";
import axios from "axios";

interface Card {
  _id: string;
  title: string;
  color: string;
}

interface Column {
  _id: string;
  title: string;
  cards: Card[];
}

const AddCards = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [newColumnTitle, setNewColumnTitle] = useState<string>("");
  const [showNewColumnForm, setShowNewColumnForm] = useState<boolean>(false);
  const [showAddCard, setShowAddCard] = useState<{ [key: string]: boolean }>({});
  const [newCardText, setNewCardText] = useState<{ [key: string]: string }>({});
 
  const handleAddNewColumn = async() => {
    if (newColumnTitle.trim() === "") return;
  
    try{                                                                      
        const token=localStorage.getItem('token');
        console.log('token',token);
    const newCol = {
      title: newColumnTitle,
    };
    const response=await axios.post('http://127.0.0.1:5000/api/createColumn',newCol,{
      headers:{
         Authorization:`Bearer ${token}`,
      }
    });
          
    if(response.data.status==='SUCCESS'){
      handleGetColumn();
    }
    // setColumns(response.data);
    setNewColumnTitle("");
    setShowNewColumnForm(false);

    }catch(error){
      //emptyu
    }
  };


const handleGetColumn=async()=>{
     const token=localStorage.getItem('token');
  const response= await axios.get('http://127.0.0.1:5000/api/board',{
    headers:{
      Authorization:`Bearer ${token}`
    }
  });
  if(response.data.status==='SUCCESS'){
   const datauser=response.data.columns;
   setColumns(datauser);
   setNewColumnTitle(response.data.columns.title);
  }
  console.log(columns);

}

useEffect(()=>{
  handleGetColumn()
},[]);

  const handleAddCardToColumn = async(columnId: string) => {
     const token=localStorage.getItem('token');
    const cardTitle = newCardText[columnId];
    if (!cardTitle || cardTitle.trim() === "") return;
    const url=`http://127.0.0.1:5000/api/addcards/${columnId}`;
    const newCard= {
      title: cardTitle,
      color: "blue", 
    };
   try{
   const response =await axios.post(url,newCard,{
    headers:{
      Authorization:`Bearer ${token}`
    }
  });
   if(response.data.status==='SUCCESS'){
    handleGetColumn();
    setNewCardText((prev)  => ({ ...prev, [columnId]: "" }));
    setShowAddCard((prev) => ({ ...prev, [columnId]: false }));
   }
   }catch(error){
//empty
   }
   
  };

  return (
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
            <div key={card._id} className="p-2 mb-1 bg-white rounded shadow">
              {card.title}
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

      {showNewColumnForm ? (
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
            <IconButton onClick={() => setShowNewColumnForm(false)}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      ) : (
        <AddAnotherbtn onClick={() => setShowNewColumnForm(true)} />
      )}
    </div>
  );
};

export default AddCards;
