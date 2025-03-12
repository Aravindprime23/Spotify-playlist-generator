import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const TOKEN_FILE = "token.json";
const SONGS_FILE = "songs.json";

// Read songs.json safely
let songs = [];
try {
    songs = JSON.parse(fs.readFileSync(SONGS_FILE, "utf8"));
    if (!Array.isArray(songs)) throw new Error("Invalid format: songs.json must be an array.");
} catch (error) {
    console.error(`❌ Error reading ${SONGS_FILE}:`, error.message);
    process.exit(1);
}

// Function to get access token
function getAccessToken() {
    if (fs.existsSync(TOKEN_FILE)) {
        return JSON.parse(fs.readFileSync(TOKEN_FILE, "utf-8")).access_token;
    }
    return null;
}

const ACCESS_TOKEN = getAccessToken();

if (!ACCESS_TOKEN) {
    console.error("❌ Error: Missing access token. Run 'node token.js --refresh' first.");
    process.exit(1);
}

// ✅ Use only the correct playlist ID
const PLAYLIST_ID = "0Y0YdMMAUIJlZ7Sp4yH6a7";  // Removed "?si=..." ✅
// https://open.spotify.com/playlist/?si=43a1268e54ee411a
// Function to add songs to a Spotify playlist
const addSongsToPlaylist = async (trackURIs) => {
    try {
        await axios.post(
            `${SPOTIFY_API_BASE}/playlists/${PLAYLIST_ID}/tracks`,
            { uris: trackURIs },  // ✅ Use full URIs, no modification needed
            { headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, "Content-Type": "application/json" } }
        );

        console.log("✅ Songs added to the playlist successfully!");
    } catch (error) {
        console.error("❌ Error adding songs to playlist:", error.response?.data || error.message);
    }
};

// Main function
const main = async () => {
    console.log("🎵 Adding songs to playlist...");
    console.log("✅ Final Track URIs:", songs);
    await addSongsToPlaylist(songs);
};

main();
