
//rmdir /s /q .next

export interface Attachment {
  _id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}
export  interface LabelData{
  labelColor:string,
  labelTitle:string,
}
export interface Card {
  _id: string;
  title: string;
  color: string;
  label:LabelData[],
  description:string,
  complete:boolean,
  startDate?:string,
  dueDate?:string,
   attachments?: Attachment[];
}

export interface Column {
  _id: string;
  title: string;
  cards: Card[];
}

export interface Columns{
   columns:Column[], 
   loading:boolean,
   cards: Card[];
   showNewColumnForm:boolean;
   comment:Comments[]
}

export interface Comments{
  _id:string;
  name:string,
  comments:string,
  date:string,
  cardId:string
}

export interface RootState{
    board:Columns;
}