"use client";
import { useState, useEffect } from "react";
import { db } from "../util/db";
import { Novel } from "../types/database";
import NovelList from "../components/NovelList";
import { useRouter } from "next/navigation";

export default function Home() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await db.init();
        const allNovels = await db.getAllNovels();
        setNovels(allNovels);
      } catch (error) {
        console.error("Failed to initialize database:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeDB();
  }, []);

  const handleCreateNew = async () => {
    const newNovel: Novel = {
      title: "Untitled Novel",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const id = await db.saveNovel(newNovel);
      router.push(`/novel/${id}`);
    } catch (error) {
      console.error("Failed to create new novel:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>My Novels</h1>
      <NovelList novels={novels} onCreateNew={handleCreateNew} />
    </div>
  );
}
