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
      const baseUrl = new URL(url).origin;

      const response = await axios.get(url);

      const headRegexp = /<head\b[^>]*>(.*?)<\/head>/is;
      const headHtml = headRegexp.exec(response.data)[1] || "";

      const hrefRegexp = /href=["']([^"']+)["']/gm;

      const iconRegexps = [
        // Apple icon avec taille
        /<link[^>]*rel=["'](?:apple-touch-icon|apple-touch-icon-precomposed)["'][^>]*sizes=["'](\d+)x(?:\d+)["'][^>]*>/gm,
        // Apple icon sans taille
        /<link[^>]*rel=["'](?:apple-touch-icon|apple-touch-icon-precomposed)["'][^>]*>/gm,
        // Icon classique avec taille
        /<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*sizes=["'](\d+)x(\d+)["'][^>]*>/gm,
        // Icon classique sans taille
        /<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*>/gm,
      ];

      function updateImageURL(currentURL) {
        let updatedURL = currentURL;
        if (!currentURL.startsWith("http")) {
          if (currentURL.startsWith("/")) {
            updatedURL = baseUrl + currentURL;
          } else if (currentURL.startsWith("./")) {
            const relativePath = currentURL.replace(/^(\.\/)+/, "");
            updatedURL = url + "/" + relativePath;
          } else {
            updatedURL = url + "/" + currentURL;
          }
          updatedURL = updatedURL.replace(/([^:])\/{2,}/g, "$1/");
        }
        return updatedURL;
      }

      function extractTag(tag, name) {
        let regexp;
        if (tag === "meta") {
          regexp = new RegExp(
            `<${tag}[^>]*(?:property|name)=["']${name}["'][^>]*content=["']([^>]+)["']`,
            "i"
          );
        } else {
          regexp = new RegExp(`<${tag}>(.+)<\/${tag}>`, "i");
        }

        let match = headHtml.match(regexp);
        return match ? match[1] : null;
      }

      function extractIcon(regExp) {
        return Array.from(headHtml.matchAll(regExp), (match) => {
          return { match: match[0], size: Math.floor(match[1]) || 0 };
        }).sort((m1, m2) => m2.size - m1.size);
      }

      let icons = [];

      for (const iconRegExp of iconRegexps) {
        icons.push(...extractIcon(iconRegExp));
        if (icons.length > 0) break;
      }

      let iconURL = null;
      const selectedIcon = icons[0];
      if (selectedIcon) {
        const selectedIconURL = hrefRegexp.exec(selectedIcon.match)[1];
        iconURL = updateImageURL(selectedIconURL);
      }

      let imageURL = extractTag("meta", "og:image");
      if (imageURL) {
        imageURL = updateImageURL(imageURL);
      }

      const title = extractTag("meta", "og:title") || extractTag("title");

      const description =
        extractTag("meta", "og:description") ||
        extractTag("meta", "description");

      const data = {
        title: title,
        description: description,
        image: imageURL,
        icon: iconURL,
      };

      reply.status(500).send(data);
    } catch (error) {
      console.log(error);
      reply.status(500).send(error);
    }
  });

  next();
}

module.exports = api;
