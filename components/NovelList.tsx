import Link from "next/link";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";

import { Novel } from "@/types/database";

interface NovelListProps {
  novels: Novel[];
  onCreateNew: () => void;
}

export default function NovelList({ novels, onCreateNew }: NovelListProps) {
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
                }}
              >
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
