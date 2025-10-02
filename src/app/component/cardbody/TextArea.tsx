"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ReactQuillProps } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Box, Button } from "@mui/material";
import axios from "axios";
import { FETCH_ALL_CARDS_DATA } from "@/app/Redux/CardsReducer";
import { useDispatch } from "react-redux";

const ReactQuill = dynamic<ReactQuillProps>(() => import("react-quill-new"), {
  ssr: false,
});

interface TextAreaProps {
  cardId?: string;
  showEditor: boolean;
  setShowEditior: React.Dispatch<React.SetStateAction<boolean>>;
  initalValue: string;
  type: "comment" | "description";
  onSave?: (value: string) => void;
}
export default function TextArea({
  cardId,
  showEditor,
  setShowEditior,
  initalValue,
  type,
  onSave,
}: TextAreaProps) {
  const [value, setValue] = useState<string>(initalValue || "");
  const dispatch = useDispatch();
  useEffect(() => {
    if (showEditor) {
      setValue(initalValue);
    }
  }, [showEditor, initalValue]);

  const handleDescription = async (value: string) => {
    const URL = "http://127.0.0.1:5000/api/";
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${URL}card/description/${cardId}`,
        { description: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status !== "SUCCESS") {
        console.error("Save failed:", response.data);
        return;
      }
      const boardResponse = await axios.get(`${URL}board`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (boardResponse.data.status === "SUCCESS") {
        setValue("");
        setShowEditior(false);
        dispatch({
          type: FETCH_ALL_CARDS_DATA,
          payload: boardResponse.data.columns,
        });
      }
    } catch (error) {
      console.error("Error saving description:", error);
    }
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(value);
      setValue("");
      setShowEditior(false);
      return;
    }
    if (type === "description") {
      await handleDescription(value);
    }
  };

  return (
    <div>
      <div className="p-4 bg-gray-50 rounded-lg shadow-md">
        {!showEditor && (
          <input
            type="text"
            placeholder="Click to write..."
            onFocus={() => setShowEditior(true)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}
        {showEditor && (
          <>
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              placeholder="Write your description here..."
              className="min-h-[100px] text-base leading-relaxed p-4"
            />
            <Box sx={{ display: "flex", gap: "4px", marginTop: "0.7rem" }}>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button onClick={() => setShowEditior(false)}>Cancel</Button>
            </Box>
          </>
        )}
      </div>
    </div>
  );
}
