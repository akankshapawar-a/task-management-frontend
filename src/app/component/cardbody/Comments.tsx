"use client";
import React, { useEffect, useState } from "react";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import TipTapFullEditor from "./TextArea";
import axios from "axios";
import { SHOW_COMMENTS } from "@/app/Redux/CardsReducer";
import { useDispatch, useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { RootState } from "@/app/Redux/cards.Type";
import moment from "moment";
import {IconButton } from "@mui/material";
import { stripHtml } from "@/app/utils/utils";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
interface CommentProps {
  cardIds: string;
}
const Comments = ({ cardIds }: CommentProps) => {
  const [showEditor, setShowEditior] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const comment = useSelector((state: RootState) => state.board.comment);
  const ParticularComment = comment.filter(
    (Comments) => Comments.cardId === cardIds
  );
  // console.log("comment", comment);
  const dispatch = useDispatch();

  const handleGetComment = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/card/getcomment"
      );
      if (response.data.status === "SUCCESS") {
        const datauser = response.data.comments;
        dispatch({ type: SHOW_COMMENTS, payload: datauser });
        // console.log("data comment", datauser);
      }
      // console.log(response.data);
    } catch (error) {
      // console.error("Error saving comments:", error);
    } finally {
      // dispatch({ type: SET_LOADING, payload: false });
    }
  };

  useEffect(() => {
    handleGetComment();
  }, []);

  const handleComments = async (value: string) => {
    const URL = "http://127.0.0.1:5000/api/";
    const username = localStorage.getItem("username");
    const payload = {
      name: username,
      cardId: cardIds,
      comments: value,
    };
    try {
      const response = await axios.post(`${URL}card/newcomment`, payload);

      if (response.data.status !== "SUCCESS") {
        // console.error("Save failed:", response.data);
        return;
      }
      handleGetComment();
    } catch (error) {
      // console.error("Error saving description:", error);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:5000/api/commentdelete/${id}`
      );
      if (response.data.status === "SUCCESS") {
        handleGetComment();
      }
    } catch (error) {
      // console.error("Error saving comments:", error);
    }
  };
  const handleCommentEdit = async (id: string, newText: string) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/api/comment/edit/${id}`,
        { comments: newText }
      );
      if (response.data.status === "SUCCESS") {
        handleGetComment();
      }
    } catch (error) {
      // console.error("Error saving comments:", error);
    }
  };
  return (
    <div>
      <div className="flex space-x-2">
        <ChatOutlinedIcon sx={{ color: "#626f86" }} />
        <p className=" text-xl mb-4">Comments</p>
      </div>
      <TipTapFullEditor
        type="comment"
        initalValue=""
        showEditor={showEditor}
        setShowEditior={setShowEditior}
        cardId={cardIds}
        onSave={handleComments}
      />
      {ParticularComment.map((user, index) => (
        <div key={index}>
          <div className="inline-flex space-x-1.5 mt-4">
            <AccountCircleIcon fontSize="large" />

            <div className="space-x-2">
              <span className="text-lg">{user.name}</span>
              <span className=" text-xs text-blue-500">
                {moment(user.date).format("MMM DD, YYYY, h:mm A")}
              </span>
            </div>
          </div>
          {!editMode ? (
            <>
              <div
                dangerouslySetInnerHTML={{ __html: user.comments }}
                className=" pl-7 rounded-lg p-1.5 border-0 border-gray-500 shadow-sm"
              />
              <div className="flex space-x-2 float-right">
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => setEditMode(true)}
                >
                  <EditIcon fontSize="inherit" sx={{ color: "blue" }} />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => handleDeleteComment(user._id)}
                >
                  <DeleteForeverIcon fontSize="inherit" sx={{ color: "red" }} />
                </IconButton>
              </div>
            </>
          ) : (
            <TipTapFullEditor
              type="comment"
              initalValue={stripHtml(user.comments)}
              showEditor={editMode}
              setShowEditior={setEditMode}
              onSave={(newText) => handleCommentEdit(user._id, newText)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Comments;
