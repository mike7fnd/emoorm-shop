'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Trash2, Edit, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";

type Address = {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  city: string;
  province: string;
  region: string;
  zip: string;
  isDefault: boolean;
};

type AddressCardProps = {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
};

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span className="text-lg">{address.name}</span>
          {address.isDefault ? (
             <Badge>
                <Home className="mr-1.5 h-3 w-3" />
                Default
            </Badge>
          ) : (
            <div className="w-6 h-6"></div> // Placeholder for alignment
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p className="text-sm text-muted-foreground">{address.phone}</p>
        <p className="text-sm text-muted-foreground">
          {`${address.addressLine1}, ${address.city}, ${address.province} ${address.zip}`}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onEdit} className="rounded-[30px]">
            <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {!address.isDefault && (
                    <DropdownMenuItem onClick={onSetDefault}>Set as Default</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
