import express from "express";
import compressionMiddleware from "compression";
import markoMiddleware from "@marko/express";
import indexPage from "./pages/index";
import usersService from "./services/users";

import dbCreatePage from "./utils/db_create_page.js";

import databases from "./notion/databases.js";
import pages from "./notion/pages.js";

import { scheduleJobs } from './utils/schedule'

const port = parseInt(process.env.PORT || 3000, 10);

scheduleJobs();

express()
  .use(compressionMiddleware()) // Enable gzip compression for all HTTP responses.
  .use(express.json())
  .use("/assets", express.static("dist/assets")) // Serve assets generated from webpack.
  .use(markoMiddleware()) // Enables res.marko.
  .get("/", indexPage)
  .get("/services/users", usersService)
  .all("/db/create_page", dbCreatePage)
  .get('/notion/databases', databases)
  .post('/notion/databases', databases)
  .post('/notion/pages', pages)
  .listen(port, err => {
    if (err) {
      throw err;
    }

    if (port) {
      console.log(`Listening on port ${port}`);
    }
  });
