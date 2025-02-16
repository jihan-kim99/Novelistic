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
      title: "My Novel",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: {
        characters: [],
        settings: [],
        plotPoints: [],
        style: "",
      },
    };

    try {
      const id = await db.saveNovel(newNovel);
      router.push(`/novel/${id}`);
    } catch (error) {
      console.error("Failed to create new novel:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this novel?")) return;

    try {
      await db.deleteNovel(id);
      setNovels(novels.filter((novel) => novel.id !== id));
    } catch (error) {
      console.error("Failed to delete novel:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>My Novels</h1>
      <NovelList
        novels={novels}
        onCreateNew={handleCreateNew}
        onDelete={handleDelete}
      />
      <style jsx global>{`
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
}
