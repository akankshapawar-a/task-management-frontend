
//rmdir /s /q .next
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
  startDate?:string,
  dueDate?:string,
}

export interface Column {
  _id: string;
  title: string;
  cards: Card[];
}

export interface Columns{
   columns:Column[], 
   loading:boolean,
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