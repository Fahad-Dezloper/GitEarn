// server.js
import app from './index.js'
import dotenv from 'dotenv';
import { createNodeMiddleware, createProbot } from "probot";
import {run} from 'probot'


dotenv.config();


run(app);

export default createNodeMiddleware(app, {
  probot: createProbot(),
  webhooksPath: "/api/github/webhooks",
});