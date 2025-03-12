import dotenv from "dotenv";
import axios from "axios";
import open from "open";
import querystring from "querystring";

dotenv.config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: "playlist-modify-public playlist-modify-private"
})}`;

console.log("Open this URL in your browser to authorize:", authUrl);
open(authUrl);
