import dotenv from "dotenv";
import axios from "axios";
import querystring from "querystring";
import fs from "fs";

dotenv.config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// Replace with the actual code you copied (only needed once)
const AUTH_CODE = "AQB__W7JWBYc041A0AfK52C8_2WAu0JkwbycsBI5VqmU2JUHv8Ue3AGeNdCXWag1Tr6koIaQDCoHUT6p4QY2XvzrfUQZjWirUF48V_-1k6ViT6hrdkgm3z8QUK0KT_uRQVcOZTrNqdwl697HfTdb3kCNkxjDeHGwm55zLATP7N9DH2ea29bgaa66HQ5k3SyY_RpcZzHZFFKVPr22rqQ8gvh6HBDCy6aJd1Z3veY6iP8enHg"; 

const TOKEN_FILE = "token.json"; // File to store tokens

// Function to get access token using authorization code (only needed for first-time setup)
async function getAccessToken() {
    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            querystring.stringify({
                grant_type: "authorization_code",
                code: AUTH_CODE,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            }),
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                timeout: 15000,  // 15 seconds timeout
                family: 4        // Force IPv4
            }
        );

        const data = response.data;
        console.log("✅ Access Token:", data.access_token);
        console.log("🔄 Refresh Token:", data.refresh_token);

        // Save tokens to a file for later use
        saveTokens(data.access_token, data.refresh_token);
    } catch (error) {
        console.error("❌ Error getting access token:", error.response?.data || error.message);
    }
}

// Function to refresh access token using refresh token
async function refreshAccessToken() {
    try {
        const tokens = loadTokens();
        if (!tokens.refresh_token) {
            console.error("❌ No refresh token found. Run getAccessToken() first.");
            return;
        }

        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            querystring.stringify({
                grant_type: "refresh_token",
                refresh_token: tokens.refresh_token,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            }),
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                timeout: 15000,
                family: 4
            }
        );

        const data = response.data;
        console.log("🔄 New Access Token:", data.access_token);

        // Save updated access token
        saveTokens(data.access_token, tokens.refresh_token);
    } catch (error) {
        console.error("❌ Error refreshing access token:", error.response?.data || error.message);
    }
}

// Function to save tokens to a file
function saveTokens(accessToken, refreshToken) {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }, null, 2));
}

// Function to load tokens from a file
function loadTokens() {
    if (fs.existsSync(TOKEN_FILE)) {
        return JSON.parse(fs.readFileSync(TOKEN_FILE, "utf-8"));
    }
    return {};
}

// Run the script
if (process.argv.includes("--refresh")) {
    refreshAccessToken();
} else {
    getAccessToken();
}
