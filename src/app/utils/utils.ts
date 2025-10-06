import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stripHtml = (html:any) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const updateCardStatus = async (cardId: string, complete: boolean) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `http://127.0.0.1:5000/api/card/status/${cardId}`,
      { complete },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating card status:", error);
    return { status: "ERROR" };
  }
};

export {stripHtml,updateCardStatus};

//rmdir /s /q .next
