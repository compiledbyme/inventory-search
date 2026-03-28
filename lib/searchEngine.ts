import { InventoryItem, SearchParams, SearchResult } from "@/types";
import inventoryData from "@/data/inventory.json";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 25;

interface SearchableInventoryItem {
  item: InventoryItem;
  productNameLower: string;
}

export class SearchEngine {
  private data: SearchableInventoryItem[];
  private categoryIndex: Map<string, SearchableInventoryItem[]>;
  private categories: string[];

  constructor(data: InventoryItem[]) {
    this.data = data.map((item) => ({
      item,
      productNameLower: item.productName.toLowerCase(),
    }));

    this.categoryIndex = new Map();

    for (const entry of this.data) {
      const categoryKey = entry.item.category.toLowerCase();
      const categoryItems = this.categoryIndex.get(categoryKey) ?? [];
      categoryItems.push(entry);
      this.categoryIndex.set(categoryKey, categoryItems);
    }

    this.categories = Array.from(
      new Set(this.data.map((entry) => entry.item.category)),
    ).sort();
  }

  search(params: SearchParams): SearchResult {
    let results =
      params.category && params.category !== "all"
        ? [...(this.categoryIndex.get(params.category.toLowerCase()) ?? [])]
        : [...this.data];

    if (params.q && params.q.trim()) {
      const searchTerm = params.q.toLowerCase().trim();
      results = results.filter((entry) =>
        entry.productNameLower.includes(searchTerm),
      );
    }

    if (params.minPrice !== undefined && !isNaN(params.minPrice)) {
      results = results.filter((entry) => entry.item.price >= params.minPrice!);
    }

    if (params.maxPrice !== undefined && !isNaN(params.maxPrice)) {
      results = results.filter((entry) => entry.item.price <= params.maxPrice!);
    }

    const items = results.map((entry) => entry.item);
    const total = items.length;

    if (params.page === undefined && params.pageSize === undefined) {
      return {
        data: items,
        total,
      };
    }

    const pageSize = clamp(
      params.pageSize ?? DEFAULT_PAGE_SIZE,
      1,
      MAX_PAGE_SIZE,
    );
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = clamp(params.page ?? 1, 1, totalPages);
    const startIndex = (page - 1) * pageSize;

    return {
      data: items.slice(startIndex, startIndex + pageSize),
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  getCategories(): string[] {
    return this.categories;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export const searchEngine = new SearchEngine(inventoryData as InventoryItem[]);
