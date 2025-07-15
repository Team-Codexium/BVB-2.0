import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,

} from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { AlertCircle } from "lucide-react";
import { useArtist } from "../contexts/ArtistContext";
import { useBattle } from "../contexts/BattleContext";
import { useAuth } from "../contexts/AuthContext";

const PAGE_SIZE = 20;

const Artists = () => {
  const { artists, loading, error } = useArtist();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);

  const [title,setTitle]=useState("");
  const [duration,setDuration]=useState(1);
  

  const { createBattle } = useBattle();
  const { token, user } = useAuth();

  useEffect(() => {
    // Filter artists by search
    let filteredArtists = artists;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filteredArtists = artists.filter(
        (a) =>
          (a.username && a.username.toLowerCase().includes(s)) ||
          (a.fullName && a.fullName.toLowerCase().includes(s))
      );
    }
    setFiltered(filteredArtists);
    setPage(1); // Reset to first page on search
  }, [search, artists]);

  const filteredRappers = filtered.filter((rapper) => rapper._id != user._id);

  // Pagination
  const totalPages = Math.ceil(filteredRappers.length / PAGE_SIZE) || 1;
  // console.log("Filtered", filtered)
  const paginated = filteredRappers?.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // console.log(artists)

  const handleChallenge = async (artistId) => {
    // console.log("Challenge", artistId)
    const data = {
      rapper2Id: artistId,
      battleTitle:title,
      timeLimit:duration

    };
    await createBattle(data, token);
  };

  return (
    <div className="bg-custom-gradient min-h-screen p-6">
      {/* <UploadAudio /> */}
      <div className="max-w-5xl mx-auto">
        <Card className="mb-6 bg-">
          <CardHeader>
            <CardTitle className="text-5xl text-secondary text-center">
              Artists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <Input
                type="text"
                placeholder="Search by name or username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-80 border-secondary text-white"
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
              <div className="text-center text-gray-400 py-8">
                No artists found.
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              {paginated.map((artist) => (
                <Card
                  key={artist._id}
                  className="bg-primary/80 border border-secondary text-white"
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex-1">
                      {artist.fullName || artist.username}
                    </CardTitle>
                    <img
                      src={artist.image || "/default-avatar.png"}
                      alt={artist.username || "Artist"}
                      className="w-20 h-20 rounded-full object-cover ml-4 border border-secondary"
                    />
                  </CardHeader>
                  <CardContent className="flex justify-between items-end">
                    <div>
                      <div className="mb-2 text-sm">
                        <span className="font-semibold">Username:</span>{" "}
                        {artist.username || "N/A"}
                      </div>
                      <div className="mb-2 text-sm">
                        <span className="font-semibold">Rank:</span>{" "}
                        {artist.rank || "N/A"}
                      </div>
                    </div>
                        <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-red-600">Challenge</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Creating you Challenge Request</SheetTitle>
          <SheetDescription>
           write the title of battle you want and give the time of expiry of this battle
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Battle-title</Label>
            <Input id="sheet-demo-name" 
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">date</Label>
            <Input id="sheet-demo-username" 
             type="datetime-local"
            
              value={duration}
              onChange={(e)=>setDuration(e.target.value)}
            />
          </div>
        </div>
        <SheetFooter>
         <SheetClose asChild>
  <Button onClick={handleChallenge}>Submit</Button>
</SheetClose>
          <SheetClose asChild>
            <Button variant="outline" >Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="bg-primary/80"
                >
                  Prev
                </Button>
                <span className="text-white self-center">
                  Page {page} of {totalPages}
                </span>
                <Button
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className="bg-primary/80"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Artists;
