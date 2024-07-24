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
        const res = await fetch(`/api/search?q=${input}`);
        if (!input) return setSearchResults(undefined);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [input]);

  return (
    <div className="flex flex-col justify-center items-center">
      <Input
        className="w-[400px] mt-10"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
    </div>
  );
};

export default page;
