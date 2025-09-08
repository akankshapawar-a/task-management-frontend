import React, { useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link,
} from "lucide-react"; // nice clean icons

export default function TextArea() {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto border rounded-2xl shadow-sm bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b px-2 py-1 bg-gray-50 rounded-t-2xl">
        <button
          onClick={() => handleFormat("bold")}
          className="p-2 hover:bg-gray-200 rounded-lg"
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleFormat("italic")}
          className="p-2 hover:bg-gray-200 rounded-lg"
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleFormat("underline")}
          className="p-2 hover:bg-gray-200 rounded-lg"
        >
          <Underline className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleFormat("strikeThrough")}
          className="p-2 hover:bg-gray-200 rounded-lg"
        >
          <Strikethrough className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleFormat("insertUnorderedList")}
          className="p-2 hover:bg-gray-200 rounded-lg"
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleFormat("insertOrderedList")}
          className="p-2 hover:bg-gray-200 rounded-lg"
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleFormat("createLink")}
          className="p-2 hover:bg-gray-200 rounded-lg"
        >
          <Link className="w-5 h-5" />
        </button>
      </div>

      {/* Editable Text Box */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[150px] p-3 focus:outline-none text-gray-800"
      >
        Type your message here...
      </div>

      {/* Send Bar */}
      <div className="flex justify-end border-t px-3 py-2 bg-gray-50 rounded-b-2xl">
        <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
  );
}
