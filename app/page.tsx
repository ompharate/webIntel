"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Send } from "lucide-react";
import Alert from "@/components/ui/Alert";

export default function Home() {
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };
  const handleUrlCheck = async (e:FormEvent) => {
    e.preventDefault();
    try {
      if (!url) <Alert type="danger" message="Please enter a valid URL" />;
      const response = await fetch(url, { method: "HEAD" });

      if (!response.ok) {
        return <Alert type="danger" message="Please enter a valid URL" />;
      }
    } catch (error) {
      return <Alert type="danger" message="Please enter a valid URL" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen  bg-[#09090B] text-white">
      {/* <Alert type="success" message="Operation completed successfully!" /> */}

      <header className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">WebIntel</h1>
        <form
          onSubmit={handleUrlCheck}
          className="flex justify-center items-center space-x-2"
        >
          <Input
            type="url"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="max-w-md bg-gray-700 text-white border border-1 border-gray-500 placeholder-gray-400 "
          />
          <Button
            type="submit"
            variant="outline"
            className="bg-[#09090B] border  border-gray-500 hover:shadow-sm hover:shadow-neutral-100 hover:text-white hover:bg-[#09090B] text-white  flex items-center"
          >
            <Lock /> <h1>Lock </h1>
          </Button>
        </form>
      </header>

      <main className="flex-grow flex justify-center items-center p-6">
        <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">AI Response</h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : response ? (
            <p className="text-gray-300">{response}</p>
          ) : (
            <p className="text-gray-400 italic">
              AI response will appear here...
            </p>
          )}
        </div>
      </main>

      <footer className="p-6">
        <form
          onSubmit={handleSubmit}
          className="flex justify-center items-center space-x-2"
        >
          <Input
            type="url"
            placeholder="Enter your prompt..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="max-w-md bg-gray-700 text-white border border-1 border-gray-500 placeholder-gray-400 "
          />
          <Button
            type="submit"
            variant="outline"
            className="bg-[#09090B] border  border-gray-500 hover:shadow-sm hover:shadow-neutral-100 hover:text-white hover:bg-[#09090B] text-white  flex items-center"
          >
            <Send />
          </Button>
        </form>
      </footer>
    </div>
  );
}
