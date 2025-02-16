export interface Novel {
  id?: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  notes: {
    characters: string[];
    settings: string[];
    plotPoints: string[];
    style: string;
  };
}

export interface NovelImage {
  id?: number;
  novelId: number;
  imageData: string; // base64 encoded image
  description: string;
  createdAt: Date;
}
