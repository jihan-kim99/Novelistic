export interface Novel {
  id?: number;
  author?: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Episode {
  id?: number;
  novelId: number;
  title: string;
  content: string;
  order: number;
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
