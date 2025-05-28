// server.js
import app from './index.js'
import dotenv from 'dotenv';
import {
    createLambdaFunction,
    createProbot,
  } from "@probot/adapter-aws-lambda-serverless";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';


dotenv.config();

export const handler = createLambdaFunction(app, {
    probot: createProbot(),
}) as (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;