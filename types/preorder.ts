export interface Preorder {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  quantity?: number;
  description?: string;
  scale?: string;
  status: 'new' | 'reviewed' | 'quoted' | 'converted' | 'closed';
  created_at: string;
  updated_at: string;
  preorder_files?: PreorderFile[];
}

export interface PreorderFile {
  id: string;
  preorder_id: string;
  file_url: string;
  file_name?: string;
  file_type?: string;
  file_size_bytes?: number;
  source: 'upload' | 'drive_link';
  uploaded_at: string;
}