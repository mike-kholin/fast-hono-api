"use client";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";

const page = () => {
  const [input, setInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<{
    results: string[];
    duration: number;
  }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!input) return setSearchResults(undefined);
        const res = await fetch(`/api/search?q=${input}`);
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  return (
    <div>
      <Input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
    </div>
  );
};

export default page;
