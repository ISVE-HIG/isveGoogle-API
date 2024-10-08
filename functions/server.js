// server.js

require("dotenv").config();

const express = require( "express" );
const cors = require("cors");
const Routes = require("./api/routes");
const fs = require("fs");
const path = require("path");
const AuthService = require( "./services/authService" )
const messageHandler = require("./utils/serverMessageHandler")

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");

const app = express();
const PORT = process.env.PORT || 3001;
const BASE_URL = process.env.BASE_URL || "http://localhost"

app.use(cors());
app.use( express.json() );


// Google authentication routes
app.get(`/${process.env.AUTH_GOOGLE_URL}`, (req, res) => {
const url = AuthService.getAuthUrl();
res.redirect(url);
});

app.get(`/${process.env.OAUTH2_CALLBACK_URL}`, async (req, res) => {
const code = req.query.code;
try {
    const tokens = await AuthService.getTokens( code );
    updateEnv(tokens)
    res.send("Authentication successful! Tokens retrieved.");
} catch (error) {
    console.error("Error retrieving tokens:", error);
    res.status(500).send("Error retrieving tokens");
}
});


// Initialize routes
const routes = new Routes( app );

app.listen( PORT, () => {
console.log(`Server is running on ${BASE_URL}:${PORT}`)
})


function updateEnv(tokens) {
const envPath = path.join(__dirname, '../.env');
const newEnvContent = `
CLIENT_ID=${process.env.CLIENT_ID}
CLIENT_SECRET=${process.env.CLIENT_SECRET}
REDIRECT_URI=${process.env.REDIRECT_URI}
ACCESS_TOKEN=${tokens.access_token}
REFRESH_TOKEN=${tokens.refresh_token}
`;
    fs.writeFileSync(envPath, newEnvContent.trim());
}

exports.api = functions.https.onRequest(app);
