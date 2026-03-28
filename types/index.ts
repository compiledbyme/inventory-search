export interface InventoryItem {
  id: string;
  productName: string;
  category: string;
  price: number;
  supplier: string;
  quantity: number;
  description?: string;
}

export interface SearchParams {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export interface SearchResult {
  data: InventoryItem[];
  total: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface SearchResponse extends SearchResult {
  filters: SearchParams;
}
