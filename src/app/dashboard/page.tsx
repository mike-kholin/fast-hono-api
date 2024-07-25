"use client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";

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
        const data = (await res.json()) as {
          results: string[];
          duration: number;
        };
        setSearchResults(data);
        if (!input) return setSearchResults(undefined);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [input]);

  return (
    <div className="flex flex-col justify-center items-center grainy h-screen w-screen">
      <div className="animate animate-in slide-in-from-bottom-2.5 fade-in-10 duration-500 space-y-2 items-center">
        <h1 className="tracking-tight font-medium text-6xl">Page Search</h1>
        <br />
        <div>
          <Command>
            <CommandInput
              value={input}
              onValueChange={setInput}
              placeholder="search countries..."
              className="placeholder:text-zinc-500 tracking-tight"
            />
            <CommandList>
              {searchResults?.results.length === 0 ? (
                <CommandEmpty>No results found</CommandEmpty>
              ) : null}
              {searchResults?.results ? (
                <CommandGroup>
                  {searchResults?.results.map((result) => (
                    <CommandItem
                      onSelect={setInput}
                      key={result}
                      value={result}
                    >
                      {result}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {searchResults?.results ? (
                <>
                  <div>
                    <p className="tracking-tight text-sm text-gray-400 ml-2">
                      Found {searchResults?.results.length} results in{" "}
                      {searchResults?.duration.toFixed(0)}{" "}
                      <span className="italic">ms</span>
                    </p>
                  </div>
                </>
              ) : null}
            </CommandList>
          </Command>
          {/* <Input
            className="w-[400px] mt-6 relative"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <RiSearch2Fill
            className="absolute ml-[360px] -mt-[30px]"
            color="black"
            size={24}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default page;
