"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFiltersProps {
  category: string;
  onCategoryChange: (value: string) => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  categories: string[];
}

export function SearchFilters({
  category,
  onCategoryChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  categories,
}: SearchFiltersProps) {
  const [minError, setMinError] = useState("");
  const [maxError, setMaxError] = useState("");

  const validateMinPrice = (value: string) => {
    if (value === "") {
      setMinError("");
      return true;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      setMinError("Please enter a valid number");
      return false;
    }

    if (num < 0) {
      setMinError("Price cannot be negative");
      return false;
    }

    const maxNum = maxPrice ? parseFloat(maxPrice) : null;
    if (maxNum !== null && num > maxNum) {
      setMinError("Min price cannot be greater than max price");
      return false;
    }

    setMinError("");
    return true;
  };

  const validateMaxPrice = (value: string) => {
    if (value === "") {
      setMaxError("");
      return true;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      setMaxError("Please enter a valid number");
      return false;
    }

    if (num < 0) {
      setMaxError("Price cannot be negative");
      return false;
    }

    const minNum = minPrice ? parseFloat(minPrice) : null;
    if (minNum !== null && num < minNum) {
      setMaxError("Max price cannot be less than min price");
      return false;
    }

    setMaxError("");
    return true;
  };

  useEffect(() => {
    validateMinPrice(minPrice);
    validateMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onMinPriceChange(e.target.value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onMaxPriceChange(e.target.value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger id="category">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="minPrice">Min Price (Rs)</Label>
        <Input
          id="minPrice"
          type="number"
          placeholder="0"
          value={minPrice}
          onChange={handleMinPriceChange}
          min={0}
          step={0.01}
          className={minError ? "border-red-500" : ""}
        />
        {minError && <p className="text-xs text-red-500">{minError}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxPrice">Max Price (Rs)</Label>
        <Input
          id="maxPrice"
          type="number"
          placeholder="Any"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          min={0}
          step={0.01}
          className={maxError ? "border-red-500" : ""}
        />
        {maxError && <p className="text-xs text-red-500">{maxError}</p>}
      </div>
    </div>
  );
}
