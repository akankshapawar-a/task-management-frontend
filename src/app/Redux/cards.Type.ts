export  interface LabelData{
  labelColor:string,
  labelTitle:string,
}
export interface Card {
  _id: string;
  title: string;
  color: string;
  label:LabelData[],
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
}

export interface RootState{
    board:Columns;
}