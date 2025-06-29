import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useArtist } from '../contexts/ArtistContext';
import UploadAudio from '../components/audioUpload'; // Assuming this is the audio upload component
const PAGE_SIZE = 20;

const Artists = () => {
  const { artists, loading, error } = useArtist();
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Filter artists by search
    let filteredArtists = artists;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filteredArtists = artists.filter(a =>
        (a.username && a.username.toLowerCase().includes(s)) ||
        (a.fullName && a.fullName.toLowerCase().includes(s))
      );
    }
    setFiltered(filteredArtists);
    setPage(1); // Reset to first page on search
  }, [search, artists]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  // console.log("Filtered", filtered)
  const paginated = filtered?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

  console.log(artists)

  return (
    <div className="bg-custom-gradient min-h-screen p-6">
      <UploadAudio />
      <div className="max-w-5xl mx-auto">
        <Card className="mb-6 bg-">
          <CardHeader>
            <CardTitle className="text-5xl text-secondary text-center">Artists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <Input
                type="text"
                placeholder="Search by name or username..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full md:w-80 border-secondary"
              />
            </div>
            {loading && (
              <div className="flex justify-center items-center min-h-[10rem]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!loading && !error && paginated.length === 0 && (
              <div className="text-center text-gray-400 py-8">No artists found.</div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              {paginated.map((artist) => (
                <Card key={artist._id} className="bg-primary/80 border border-secondary text-white">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex-1">{artist.fullName || artist.username}</CardTitle>
                    <img
                      src={artist.image || '/default-avatar.png'}
                      alt={artist.username || 'Artist'}
                      className="w-20 h-20 rounded-full object-cover ml-4 border border-secondary"
                    />
                  </CardHeader>
                  <CardContent className="flex justify-between items-end">
                    <div>
                      <div className="mb-2 text-sm">
                        <span className="font-semibold">Username:</span> {artist.username || 'N/A'}
                      </div>
                      <div className="mb-2 text-sm">
                        <span className="font-semibold">Rank:</span> {artist.rank || 'N/A'}
                      </div>
                    </div>
                    <Button className="bg-red-600">Challenge</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <Button onClick={handlePrev} disabled={page === 1} className="bg-primary/80">Prev</Button>
                <span className="text-white self-center">Page {page} of {totalPages}</span>
                <Button onClick={handleNext} disabled={page === totalPages} className="bg-primary/80">Next</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Artists;