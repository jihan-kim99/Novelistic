import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const theme = useTheme();

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
            <Card
              sx={{
                height: "100%",
                position: "relative",
                backgroundColor: theme.palette.background.paper,
                boxShadow: 1,
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.02)",
                  transition: "transform 0.2s",
                },
              }}
              onClick={() => router.push(`/novel/${novel.id}`)}
            >
              <Box
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  display: "flex",
                  gap: 1,
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/read/${novel.id}`);
                  }}
                >
                  <MenuBookIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (novel.id) onDelete(novel.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {novel.title || "Untitled Novel"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last updated: {new Date(novel.updatedAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
