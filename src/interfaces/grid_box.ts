export interface GridBoxHeader {
  id: string;
  title: string;
}

export interface GridBoxActions {
  icon: string;
  color: string;
  title: string;
  onClick: (item: any) => void;
  hide?: (item: any) => boolean;
}
