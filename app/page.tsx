"use client";
import { useState, useEffect } from "react";
import { db } from "../utils/db";
import { Novel } from "../types/database";
import NovelList from "../components/NovelList";
import { useRouter } from "next/navigation";
import { useAI } from "../contexts/AIContext";

export default function Home() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {
    apiKey,
    setApiKey,
    imageApiKey,
    setImageApiKey,
    imageEndpoint,
    setImageEndpoint,
  } = useAI();

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
      <div className="settings-section">
        <h2>AI Settings</h2>
        <div className="settings-form">
          <div className="form-group">
            <label htmlFor="apiKey">Gemini API Key:</label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="settings-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="imageApiKey">Image Generation API Key:</label>
            <input
              type="password"
              id="imageApiKey"
              value={imageApiKey}
              onChange={(e) => setImageApiKey(e.target.value)}
              className="settings-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="imageEndpoint">Image Generation Endpoint:</label>
            <input
              type="text"
              id="imageEndpoint"
              value={imageEndpoint}
              onChange={(e) => setImageEndpoint(e.target.value)}
              className="settings-input"
            />
          </div>
        </div>
      </div>
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
        .settings-section {
          margin-bottom: 2rem;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .settings-input {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 100%;
          max-width: 400px;
        }
      `}</style>
    </div>
  );
}
