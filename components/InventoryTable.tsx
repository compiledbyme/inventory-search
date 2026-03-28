import { InventoryItem } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 py-12 text-center">
        <p className="text-gray-500">No results found</p>
        <p className="mt-2 text-sm text-gray-400">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="max-h-[28rem] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="bg-background">Product Name</TableHead>
              <TableHead className="bg-background">Category</TableHead>
              <TableHead className="bg-background">Supplier</TableHead>
              <TableHead className="bg-background text-right">Price</TableHead>
              <TableHead className="bg-background text-right">
                Quantity
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.productName}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.category}</Badge>
                </TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell className="text-right">
                  Rs {item.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
