"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../util/db";
import { Novel } from "../../../types/database";
import TextEditor from "@/components/TextEditor";
import TopBar from "@/components/TopBar";

export default function EditNovel() {
  const params = useParams();
  const router = useRouter();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const loadNovel = async () => {
      if (!params.id) return;

      try {
        const novelData = await db.getNovel(Number(params.id));
        if (novelData) {
          setNovel(novelData);
          setContent(novelData.content);
          setTitle(novelData.title);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to load novel:", error);
        router.push("/");
      }
    };

    loadNovel();
  }, [params.id, router]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    if (!novel) return;
    setIsSaving(true);

    const updatedNovel: Novel = {
      ...novel,
      title,
      content,
      updatedAt: new Date(),
    };

    try {
      await db.saveNovel(updatedNovel);
      setNovel(updatedNovel);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save novel:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!novel) return <div>Loading...</div>;

  return (
    <div className="h-screen flex flex-col">
      <TopBar
        title={title}
        onTitleChange={setTitle}
        onSave={handleSave}
        onBack={() => router.push("/")}
        isSaving={isSaving}
        lastSaved={lastSaved}
      />
      <div className="flex-1 p-4 overflow-auto">
        <TextEditor
          initialContent={content}
          onChange={handleContentChange}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
