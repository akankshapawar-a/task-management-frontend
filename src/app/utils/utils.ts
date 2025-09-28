// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stripHtml = (html:any) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};
export {stripHtml};
