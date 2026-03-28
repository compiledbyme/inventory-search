"use client";

import { useState, useEffect, useCallback } from "react";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { InventoryTable } from "@/components/InventoryTable";
import { InventoryItem, SearchResponse } from "@/types";
import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import debounce from "lodash/debounce";

const RESULTS_PER_PAGE = 10;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [results, setResults] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(RESULTS_PER_PAGE);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async () => {
    // Reset error
    setError(null);

    // Validate price range before making API call
    const minPriceNum = minPrice ? parseFloat(minPrice) : null;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : null;

    if (
      minPriceNum !== null &&
      maxPriceNum !== null &&
      minPriceNum > maxPriceNum
    ) {
      setError("Minimum price cannot be greater than maximum price");
      return;
    }

    if (minPriceNum !== null && minPriceNum < 0) {
      setError("Minimum price cannot be negative");
      return;
    }

    if (maxPriceNum !== null && maxPriceNum < 0) {
      setError("Maximum price cannot be negative");
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("q", searchTerm);
      if (category !== "all") params.append("category", category);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      params.append("page", page.toString());
      params.append("pageSize", RESULTS_PER_PAGE.toString());

      const queryString = params.toString();
      const response = await fetch(
        queryString ? `/search?${queryString}` : "/search",
      );
      const data = await response.json();

      if (response.ok) {
        const searchData = data as SearchResponse;
        setResults(searchData.data);
        setTotalResults(searchData.total);
        setPage(searchData.page ?? 1);
        setPageSize(searchData.pageSize ?? RESULTS_PER_PAGE);
        setTotalPages(searchData.totalPages ?? 1);
        setError(null);
      } else {
        const errorData = data as { error?: string };
        setError(errorData.error || "Search failed");
        console.error("Search error:", errorData.error);
      }
    } catch (error) {
      setError("Failed to connect to server");
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category, minPrice, maxPrice, page]);

  // Debounced search for better UX
  const debouncedSearch = useCallback(
    debounce(() => performSearch(), 300),
    [performSearch],
  );

  const handleSearch = () => {
    debouncedSearch.cancel();
    void performSearch();
  };

  useEffect(() => {
    // Fetch categories on mount
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories))
      .catch(console.error);
  }, []);

  useEffect(() => {
    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [searchTerm, category, minPrice, maxPrice, page, debouncedSearch]);

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  // Handle price input changes with validation
  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    setPage(1);
    // Clear price-related errors when user starts typing
    if (
      error &&
      (error.includes("price") ||
        error.includes("Minimum") ||
        error.includes("Maximum"))
    ) {
      setError(null);
    }
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    setPage(1);
    // Clear price-related errors when user starts typing
    if (
      error &&
      (error.includes("price") ||
        error.includes("Minimum") ||
        error.includes("Maximum"))
    ) {
      setError(null);
    }
  };

  const handlePreviousPage = () => {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    setPage((currentPage) => Math.min(totalPages, currentPage + 1));
  };

  const startResult = totalResults === 0 ? 0 : (page - 1) * pageSize + 1;
  const endResult = totalResults === 0 ? 0 : startResult + results.length - 1;

  return (
    <main className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Inventory Search</CardTitle>
          <p className="text-gray-500 mt-2">
            Search surplus inventory across multiple suppliers
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchTermChange}
            onSearch={handleSearch}
          />

          <SearchFilters
            category={category}
            onCategoryChange={handleCategoryChange}
            minPrice={minPrice}
            onMinPriceChange={handleMinPriceChange}
            maxPrice={maxPrice}
            onMaxPriceChange={handleMaxPriceChange}
            categories={categories}
          />

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              {!error && (
                <div className="flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    Showing {startResult}-{endResult} of {totalResults} result
                    {totalResults !== 1 ? "s" : ""}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <span>
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              )}
              <InventoryTable items={results} />
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
