export interface Idea {
  id: string;
  title: string;
  body: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type IdeaDraft = Pick<Idea, 'title'> & Partial<Pick<Idea, 'body'>>;
