import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN = "BQDDbCfiDE-YcGh5hYKgCHWQRWfkTwTCJo8iOJSgv-6un5KVLee_jBkiexhej-mkU91BHJj7JISPohnISz5E_wV-GS-nDo4lfvg0XqM636Mscfh-XJS4BBMv3pEiBxjT3prqFfVXqyrvJHP5d1P-6E2Mur_eP6N1VhIUPxRz6dtBB8r1x0_fzAJ8qHJ15RoRGveZAPvG-FBmbR_tOT2NtVAGDqCm5QSE-66apyL62afGpE7h3vzAYTt-yksIJAC9zc9e12N_3Mc4KDfFQFqGNzbOPCx5_Ks"; // Replace with actual token

const createPlaylist = async () => {
    try {
        const response = await axios.post(
            "https://api.spotify.com/v1/me/playlists",
            {
                name: "Top 20 Most Streamed Songs of bruno mars",
                description: "Playlist created via API",
                public: true
            },
            {
                headers: {
                    "Authorization": `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Playlist Created:", response.data);
        return response.data.id; // Return playlist ID
    } catch (error) {
        console.error("Error creating playlist:", error.response?.data || error.message);
    }
};

createPlaylist();
// https://open.spotify.com/playlist/7kcmcfuUia1oSy2bmfnPZe?si=7cdd9bcb95b94581