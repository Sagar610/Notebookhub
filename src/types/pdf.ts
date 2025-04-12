export interface PDF {
  _id: string;
  title: string;
  author: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
  isApproved: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy?: string;
  views: number;
  downloads: number;
}

export type { PDF }; 