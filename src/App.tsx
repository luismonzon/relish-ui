import React, { useEffect, useState } from "react";
import "./App.css";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Container,
  ImageList,
  ImageListItem,
  TextField,
  Stack,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import axios from "axios";
import type { EnrichedPhoto } from ".";

const LIMIT = 25;
const OFFSET = 0;

interface Filter {
  title: string;
  ["album.title"]: string;
  ["album.user.email"]: string;
}

interface PhotoRequest extends Partial<Filter> {
  limit: number;
  offset: number;
}

function App() {
  const mdTheme = createTheme();

  const [photos, setPhotos] = useState<EnrichedPhoto[]>([]);
  const [limit, setLimit] = useState<number>(LIMIT);
  const [offset, setOffset] = useState<number>(OFFSET);
  const [photo, setPhoto] = useState<EnrichedPhoto | undefined>();

  const [filters, setFilters] = useState<Filter>({
    title: "",
    "album.title": "",
    "album.user.email": "",
  });

  useEffect(() => {
    const params: PhotoRequest = {
      limit,
      offset,
    };
    if (filters["album.title"]) {
      params["album.title"] = filters["album.title"];
    }
    if (filters["album.user.email"]) {
      params["album.user.email"] = filters["album.user.email"];
    }
    if (filters.title) {
      params.title = filters.title;
    }

    axios
      .get(`${process.env.REACT_APP_URL}/photos`, { params })
      .then((response) => setPhotos(response.data));
  }, [limit, offset, filters]);

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(+event.target.value);
  };

  const handleOffsetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOffset(+event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailFilter = event.currentTarget.elements.namedItem(
      "email-filter"
    ) as HTMLInputElement;
    const photoTitleFilter = event.currentTarget.elements.namedItem(
      "photo-title-filter"
    ) as HTMLInputElement;
    const albumTitleFilter = event.currentTarget.elements.namedItem(
      "album-title-filter"
    ) as HTMLInputElement;

    setFilters({
      title: photoTitleFilter.value,
      "album.title": albumTitleFilter.value,
      "album.user.email": emailFilter.value,
    });
  };

  const handleClickPhoto = (id: number | undefined) => {
    const photo = photos.find((photo) => photo.id === id);
    setPhoto(photo);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Stack direction="row" spacing={2} marginBottom={2}>
              <TextField
                id="offset"
                label="Offset"
                variant="outlined"
                value={offset}
                onChange={handleOffsetChange}
              />
              <TextField
                id="limit"
                label="Limit"
                variant="outlined"
                value={limit}
                onChange={handleLimitChange}
              />
            </Stack>

            <form onSubmit={handleSubmit}>
              <Stack direction="row" spacing={2}>
                <TextField
                  id="email-filter"
                  label="User Email"
                  variant="outlined"
                />

                <TextField
                  id="photo-title-filter"
                  label="Photo Title"
                  variant="outlined"
                />
                <TextField
                  id="album-title-filter"
                  label="Album Title"
                  variant="outlined"
                />
                <Button
                  type="submit"
                  color="primary"
                  variant="outlined"
                  size="large"
                >
                  Apply
                </Button>
              </Stack>
            </form>
            <ImageList
              sx={{ maxWidth: 500, maxHeight: 450 }}
              cols={3}
              rowHeight={164}
            >
              {photos.map((photo) => (
                <ImageListItem key={photo.id}>
                  <a
                    href="#"
                    onClick={() => handleClickPhoto(photo.id)}
                    style={{ display: "block", height: "100%" }}
                  >
                    <img
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                      src={`${photo.thumbnailUrl}`}
                      srcSet={`${photo.url}`}
                      alt={photo.title}
                      loading="lazy"
                    />
                  </a>
                </ImageListItem>
              ))}
            </ImageList>
            {photo && (
              <Card sx={{ maxWidth: 500 }} key={photo.id}>
                <CardContent>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Photo
                  </Typography>
                  <Typography component={"span"} variant="body2">
                    <p>Title: {photo.title}</p>
                  </Typography>

                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Album
                  </Typography>
                  <Typography component={"span"} variant="body2">
                    <p>Title: {photo.album?.title}</p>
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    User
                  </Typography>
                  <Typography component={"span"} variant="body2">
                    <p>Name: {photo.album?.user?.name ?? " -- "}</p>
                    <p>Email: {photo.album?.user?.email ?? " -- "}</p>
                    <p>City: {photo.album?.user?.address?.city ?? " -- "}</p>
                    <p>
                      Company:{" "}
                      {photo.album?.user?.address?.company?.name ?? " -- "}
                    </p>
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
