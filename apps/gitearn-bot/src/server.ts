// server.js
import { run } from "probot";
import app from './index.js'
import dotenv from 'dotenv';

dotenv.config();
console.log("APP_ID:", process.env.APP_ID);
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY ? "Loaded" : "Missing");
console.log("WEBHOOK_SECRET:", process.env.WEBHOOK_SECRET ? "Loaded" : "Missing");

run(app);