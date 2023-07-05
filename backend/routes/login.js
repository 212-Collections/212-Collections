const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const secret_key = "idk-how-to-hide-it-😭";

function api(fastify, opts, next) {
  fastify.post("/login", async (request, reply) => {
    console.log("> Login");
    try {
      const { username, password, cluster } = request.body;
      const uri =
        "mongodb+srv://" +
        username +
        ":" +
        password +
        "@" +
        cluster +
        "/collection_db?retryWrites=true&w=majority";
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
      console.log(decodedToken.uri);
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

  fastify.get("/cryptokey", async (request, reply) => {
    console.log("> Get cryptokey");
    try {
      const origin = request.headers;
      const ipadresse = request.ip;

      reply.status(200).send({ data: ipadresse });
    } catch (error) {
      console.log(error);
      reply.status(500).send(error);
    }
  });

  next();
}

module.exports = api;
