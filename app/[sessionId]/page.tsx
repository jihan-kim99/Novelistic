"use client";

import TxtViewer from "@/components/molecules/txtViewer";
import { Box } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/auth";
import { db } from "@/utils/firebaseConfig";

const Viewer = () => {
  const [fileText, setFileText] = useState<string>("");
  const [lightMode, setLightMode] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>();

  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth();

  useEffect(() => {
    if (sessionId) {
      const fetchFile = async () => {
        try {
          const docRef = doc(db, "sessions", sessionId as string);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists() && docSnap.data().userId === user?.uid) {
            setFileText(docSnap.data().fileText);
            setCurrentPage(docSnap.data().currentPage);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching file from Firestore:", error);
        }
      };
      fetchFile();
    }
  }, [sessionId]);

  useEffect(() => {
    const changeCurrentPage = async () => {
      console.log("currentPage in useEffect:", currentPage);

      try {
        const docRef = doc(db, "sessions", sessionId as string);
        if (!currentPage) return;
        await updateDoc(docRef, {
          currentPage: currentPage,
        });
      } catch (error) {
        console.error("Error updating current page in Firestore:", error);
      }
    };

    changeCurrentPage();
  }, [currentPage]);

  return (
    <Box margin="20px">
      <TxtViewer
        fileText={fileText}
        lightMode={lightMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setLightMode={setLightMode}
      />
    </Box>
  );
};

export default Viewer;
