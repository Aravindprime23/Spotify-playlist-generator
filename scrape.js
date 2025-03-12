import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const ARTIST_URL = "https://kworb.net/spotify/artist/3TVXtAsR1Inumwj472S9r4_songs.html"; // Example artist URL

const scrapeTopSongs = async () => {
    try {
        const { data } = await axios.get(ARTIST_URL);
        const $ = cheerio.load(data);
        const songs = [];

        $("table tr").each((index, element) => {
            if (index > 0 && index <= 26) {  // Skip table header, limit to top 20
                const title = $(element).find("td:nth-child(1)").text().trim();
                const uri = $(element).find("td:nth-child(1) a").attr("href"); // Extract Spotify URL

                if (title && uri) {
                    const spotifyURI = "spotify:track:" + uri.split("/track/")[1];  // Convert URL to Spotify URI
                    songs.push(spotifyURI);
                }
            }
        });

        // Save URIs to a JSON file
        fs.writeFileSync("songs.json", JSON.stringify(songs, null, 2));
        console.log("✅ Top 20 songs saved to songs.json!");
    } catch (error) {
        console.error("Error scraping data:", error.message);
    }
};

scrapeTopSongs();

