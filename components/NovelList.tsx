import Link from "next/link";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { Novel } from "@/types/database";

interface NovelListProps {
  novels: Novel[];
  onCreateNew: () => void;
  onDelete: (id: number) => void;
}

export default function NovelList({
  novels,
  onCreateNew,
  onDelete,
}: NovelListProps) {
  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreateNew}
        sx={{ mb: 3 }}
      >
        Create New Novel
      </Button>

      <Grid container spacing={3}>
        {novels.map((novel) => (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
            key={novel.id}
          >
            <Link
              href={`/novel/${novel.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.02)",
                    transition: "transform 0.2s",
                  },
                  position: "relative",
                }}
              >
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    if (novel.id) onDelete(novel.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {novel.title || "Untitled Novel"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last updated:{" "}
                    {new Date(novel.updatedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
