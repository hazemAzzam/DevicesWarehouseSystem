import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "البحث بالرقم التسلسلي أو اسم الجهاز...",
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // البحث مع تأخير (debounce) لتحسين الأداء
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300); // تأخير 300ms

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">البحث في الأجهزة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 pl-10"
            dir="rtl"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-muted-foreground mt-2">
            البحث عن: "{searchQuery}"
          </p>
        )}
      </CardContent>
    </Card>
  );
};
