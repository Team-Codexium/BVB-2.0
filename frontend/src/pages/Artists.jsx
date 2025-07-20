import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(160);

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
      battleTitle: title,
      timeLimit: duration,
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

                    <Dialog>
  <form>
    <DialogTrigger asChild>
      <Button
        variant="outline"
        className="bg-red-600 hover:bg-red-500"
      >
        Open Dialog
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-red-900 text-white border border-primary shadow-lg">
      <DialogHeader>
        <DialogTitle>Create Battle</DialogTitle>
        <DialogDescription>
          Set title and time for this battle. Click Create when you're ready.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4">
        {/* Battle Title Input */}
        <div className="grid gap-2">
          <Label htmlFor="battle-title">Battle Title</Label>
          <Input
            id="battle-title"
            name="battleTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter battle title"
          />
        </div>

        {/* Time Limit Selector */}
        <div className="grid gap-2 ">
          <Label htmlFor="time-limit">Time Limit (minutes)</Label>
          <select
            id="time-limit"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="bg-red-900 text-white border border-secondary rounded px-3 py-2"
          >
            {[1, 5, 7, 10, 15].map((val) => (
              <option key={val} value={val}>
                {val} minutes
              </option>
            ))}
          </select>
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" className="bg-red-600 hover:bg-red-500"  >Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-500"
            onClick={() => handleChallenge(artist._id)}
          >
            Create Battle
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </form>
</Dialog>

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
