import React, { useState } from "react";
import { useQuery } from "react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const storyIds = await response.json();
  const top100Ids = storyIds.slice(0, 100);

  const storyPromises = top100Ids.map(async (id) => {
    const storyResponse = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    return storyResponse.json();
  });

  return Promise.all(storyPromises);
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useQuery("topStories", fetchTopStories);

  const filteredStories = data?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl text-center mb-4">Hacker News Top 100 Stories</h1>
      <Input
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {isLoading ? (
        <div>
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} className="h-10 w-full mb-2" />
          ))}
        </div>
      ) : (
        <ul>
          {filteredStories?.map((story) => (
            <li key={story.id} className="mb-4">
              <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-xl text-blue-600">
                {story.title}
              </a>
              <p>{story.score} upvotes</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Index;