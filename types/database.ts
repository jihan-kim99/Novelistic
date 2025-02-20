export interface Novel {
  id?: number;
  author?: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  notes: {
    characters: string[];
    settings: string[];
    plotPoints: string[];
  };
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
