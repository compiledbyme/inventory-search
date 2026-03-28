import { NextRequest, NextResponse } from "next/server";
import { searchEngine } from "@/lib/searchEngine";
import { SearchParams } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");

    let minPrice: number | undefined;
    let maxPrice: number | undefined;
    let page: number | undefined;
    let pageSize: number | undefined;

    if (minPriceParam) {
      minPrice = parseFloat(minPriceParam);
      if (isNaN(minPrice)) {
        return NextResponse.json(
          { error: "Invalid minimum price format" },
          { status: 400 },
        );
      }
    }

    if (maxPriceParam) {
      maxPrice = parseFloat(maxPriceParam);
      if (isNaN(maxPrice)) {
        return NextResponse.json(
          { error: "Invalid maximum price format" },
          { status: 400 },
        );
      }
    }

    if (pageParam) {
      page = parseInt(pageParam, 10);
      if (isNaN(page) || page < 1) {
        return NextResponse.json(
          { error: "Page must be a positive integer" },
          { status: 400 },
        );
      }
    }

    if (pageSizeParam) {
      pageSize = parseInt(pageSizeParam, 10);
      if (isNaN(pageSize) || pageSize < 1) {
        return NextResponse.json(
          { error: "Page size must be a positive integer" },
          { status: 400 },
        );
      }
    }

    const params: SearchParams = {
      q: searchParams.get("q") || undefined,
      category: searchParams.get("category") || undefined,
      minPrice,
      maxPrice,
      page,
      pageSize,
    };

    if (minPrice !== undefined && minPrice < 0) {
      return NextResponse.json(
        { error: "Minimum price cannot be negative" },
        { status: 400 },
      );
    }

    if (maxPrice !== undefined && maxPrice < 0) {
      return NextResponse.json(
        { error: "Maximum price cannot be negative" },
        { status: 400 },
      );
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return NextResponse.json(
        { error: "Minimum price cannot be greater than maximum price" },
        { status: 400 },
      );
    }

    const results = searchEngine.search(params);

    return NextResponse.json({
      ...results,
      filters: params,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
