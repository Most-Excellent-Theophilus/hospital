"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ButtonGroup } from "@/components/ui/button-group";
import { Table } from "@tanstack/react-table";
import { BaseTableItem, FieldConfig, SearchConfig } from "../types";

interface TableSearchBarProps<T extends BaseTableItem> {
  table: Table<T>;
  searchConfig: SearchConfig<T>;
  fields: FieldConfig<T>[];
  searchField: keyof T;
  onSearchFieldChange: (field: keyof T) => void;
}

export function TableSearchBar<T extends BaseTableItem>({
  table,
  searchConfig,
  fields,
  searchField,
  onSearchFieldChange,
}: TableSearchBarProps<T>) {
  return (
    <div className="flex items-center gap-2">
      <ButtonGroup>
        <Input
          placeholder={`Filter by ${fields
            .find((f) => f.key === searchField)
            ?.label?.toLowerCase()}...`}
          value={
            (table
              .getColumn(String(searchField))
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn(String(searchField))
              ?.setFilterValue(event.target.value)
          }
          className="flex-1"
        />
        {searchConfig.searchableFields.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {fields.find((f) => f.key === searchField)?.label || "Field"} :
                <Filter className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {searchConfig.searchableFields.map((fieldKey) => {
                const field = fields.find((f) => f.key === fieldKey);
                if (!field) return null;
                return (
                  <DropdownMenuItem
                    key={String(fieldKey)}
                    onClick={() => onSearchFieldChange(fieldKey)}
                  >
                    {field.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </ButtonGroup>
    </div>
  );
}