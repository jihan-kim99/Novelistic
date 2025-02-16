export interface Novel {
  id?: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NovelImage {
  id?: number;
  novelId: number;
  imageData: string; // base64 encoded image
  description: string;
  createdAt: Date;
}
