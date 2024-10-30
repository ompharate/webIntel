"use client";
import ReactMarkdown from "react-markdown";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Send } from "lucide-react";
import gfm from "remark-gfm";
import { useAlert } from "@/context/AlertContext";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { setAlert } = useAlert();
  const [url, setUrl] = useState("");
  const [validUrl, setIsValidUrl] = useState(false);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    if (!session?.user) router.push("/api/auth/signin");
    e.preventDefault();
    setQuestion("");
    if (!validUrl || !question || !url) {
      setAlert({ type: "danger", message: "Please fill out all fields" });
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/generate", {
        url,
        question,
        userId: session?.user?.id,
      });

      if (response) {
        setResponse(response.data.data);
      } else {
        setAlert({ type: "danger", message: "something went wrong" });
      }
    } catch (error) {
      setLoading(false);
      setAlert({ type: "danger", message: "something went wrong" });
      return;
    }
    setLoading(false);
  };
  const isValidUrl = (url: string) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i" // fragment locator
    );
    return !!pattern.test(url);
  };

  const handleUrlCheck = (e: FormEvent) => {
    e.preventDefault();

    if (!url) {
      setUrl("");
      setIsValidUrl(false);
      setAlert({ type: "danger", message: "Please enter a URL" });
      return;
    }

    if (!isValidUrl(url)) {
      setUrl("");
      setIsValidUrl(false);
      setAlert({ type: "danger", message: "Please enter a valid URL" });
      return;
    }
    setIsValidUrl(true);
    setAlert({ type: "success", message: "URL set!" });
  };
  return (
    <div className="flex flex-col  h-screen bg-[#09090B] text-white">
      <header className=" text-center">
        <form
          onSubmit={handleUrlCheck}
          className="flex justify-center items-center space-x-2"
        >
          <Input
            type="url"
            disabled={validUrl}
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

      <main className=" h-fit flex justify-center my-10">
        <div className="w-full max-w-4xl bg-[#09090B] scrollbar scrollbar-thumb-white scrollbar-track-transparent rounded-lg shadow-lg p-6 border overflow-scroll  border-gray-700 h-[400px]">
          <h2 className="text-xl font-semibold mb-4">WebIntel</h2>
          {loading ? (
            <div className="flex justify-center items-center ">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : response ? (
            <ReactMarkdown remarkPlugins={[gfm]}>{response}</ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic">
              AI response will appear here...
            </p>
          )}
        </div>
      </main>

      <footer className="p-6 flex flex-col">
        {validUrl && (
          <div className="font-serif text-sm bg-green-200 max-w-fit mx-auto  shadow-md shadow-green-600 my-2 rounded-md text-green-800 p-2">
            {url}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex justify-center items-center space-x-2 mb-4"
        >
          <Input
            type="text"
            placeholder="Enter your prompt..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="max-w-md bg-gray-700 text-white border border-1 border-gray-500 placeholder-gray-400"
          />
          <Button
            type="submit"
            variant="outline"
            className="bg-[#09090B] border border-gray-500 hover:shadow-sm hover:shadow-neutral-100 hover:text-white hover:bg-[#09090B] text-white flex items-center"
          >
            <Send />
          </Button>
        </form>
      </footer>
    </div>
  );
}
