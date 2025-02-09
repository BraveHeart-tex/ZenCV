export interface TableOfContentItem {
  text: string;
  id: string;
  level: number;
  children?: TableOfContentItem[];
}
