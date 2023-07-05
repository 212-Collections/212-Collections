const fastify = require("fastify")({
  bodyLimit: 30 * 1024 * 1024,
});
const cors = require("@fastify/cors");
const multipart = require("@fastify/multipart");

fastify.register(multipart);
fastify.register(cors, {});

fastify.register(require("./routes/collection"));
fastify.register(require("./routes/item"));
fastify.register(require("./routes/upload"));
fastify.register(require("./routes/login"));
fastify.register(require("./routes/settings"));

fastify
  .ready()
  .then(() => {
    console.log(fastify.printRoutes());
    console.log("Ready!");
  })
  .catch((error) => {
    console.log(error);
  });

fastify.listen({ port: 49449 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

