const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const secret_key = "idk-how-to-hide-it-😭";

const Collection = require("../models/collection");

function api(fastify, opts, next) {
  fastify.post("/login", async (request, reply) => {
    console.log("> Login");
    try {
      const { username, password, cluster, database } = request.body;
      const uri =
        "mongodb+srv://" +
        username.trim() +
        ":" +
        password +
        "@" +
        cluster.trim() +
        "/" +
        database.trim() +
        "?retryWrites=true&w=majority";
      await mongoose.connect(uri, { useNewUrlParser: true }).then(() => {
        console.log("connected");
      });

      const token = jwt.sign({ uri }, secret_key, {
        expiresIn: "69d",
      });

      reply.status(200).send({
        username: username,
        message: "Logged in successfully",
        token: token,
        cluster: cluster,
        database: database,
      });
    } catch (error) {
      reply.status(500).send(error);
    }
  });

  fastify.post("/logout", async (request, reply) => {
    console.log("> Logout");
    try {
      await mongoose.disconnect().then(() => {
        console.log("disconnected");
      });
      reply.status(200).send({
        message: "Logged out successfully",
        logout: true,
      });
    } catch (error) {
      reply.status(500).send(error);
    }
  });

  fastify.post("/token", async (request, reply) => {
    console.log("> Login with token");
    try {
      const token = request.headers.authorization.split(" ")[1];
      if (!token) {
        reply.status(200).send({ message: "Error! Token was not provided." });
      }
      const decodedToken = jwt.verify(token, secret_key);
      await mongoose.connect(decodedToken.uri, { useNewUrlParser: true });

      reply.status(200).send({
        username: decodedToken.uri.split("//")[1].split(":")[0],
        message: "Logged in successfully",
      });

      reply.status(200).send({ message: decodedToken });
    } catch (error) {
      console.log(error);
      reply.status(500).send(error);
    }
  });

  fastify.get("/data/size", async (request, reply) => {
    console.log("> Get info");
    try {
      const db = mongoose.connection.db;
      if (db) {
        const stats = await db.stats();
        const size = stats.dataSize / (1024 * 1000);
        reply.status(200).send({ size });
      } else {
        reply.status(500).send({ size: -1 });
      }
    } catch (error) {
      console.log(error);
      reply.status(500).send(error);
    }
  });

  fastify.post("/webdata", async (request, reply) => {
    console.log("> Get web data");
    try {
      const { url } = request.body;
      const response = await axios.get(url);
      const html = response.data;
      function extractMetaTag(metaName) {
        const regex = new RegExp(
          `<meta[^>]*property=["']${metaName}["'][^>]*content=["']([^"']+)["']`,
          "i"
        );
        const match = html.match(regex);
        return match ? match[1] : null;
      }

      let icons = [];
      let regex;

      regex =
        /<link[^>]*rel=["']apple-touch-icon["'][^>]*(?:sizes=["'](\d+)x(?:\d+)["'][^>])*>/gm;
      icons = [...html.matchAll(regex)].sort((m1, m2) => m2[1] - m1[1]);

      if (icons.length <= 0) {
        regex =
          /<link[^>]*rel=["']icon["'][^>]*sizes=["'](\d+)x(\d+)["'][^>]*>/gm;
        icons = [...html.matchAll(regex)].sort((m1, m2) => m2[1] - m1[1]);
      }

      if (icons.length <= 0) {
        regex = /<link[^>]*rel=["']icon["'][^>]*>/gm;
        icons = [...html.matchAll(regex)];
      }

      const target = 64;
      let link;

      if (icons[0]) {
        let icon = icons[0];
        link = [...icon[0].matchAll(/href=["']([\w.\/-]+)["']/gm)][0][1];
        if (!link.startsWith("http")) {
          link = url + "/" + link;
          link = link.replace(/([^:])\/{2,}/g, "$1/");
        }
      } else {
        link = null;
      }

      const ogData = {
        title: extractMetaTag("og:title"),
        description: extractMetaTag("og:description"),
        image: extractMetaTag("og:image"),
        icon: link,
      };
      reply.status(500).send(ogData);
    } catch (error) {
      console.log(error);
      reply.status(500).send(error);
    }
  });

  next();
}

module.exports = api;
