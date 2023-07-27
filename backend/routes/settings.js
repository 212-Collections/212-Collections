const Setting = require("../models/settings");

function api(fastify, opts, next) {
  fastify.get("/settings", async (request, reply) => {
    console.log("> Get Settings");
    try {
      const settings = await Setting.find({});
      reply.status(200).send(settings[0]);
    } catch (error) {
      reply.status(500).send(error);
    }
  });

  fastify.put("/settings", async (request, reply) => {
    console.log("> Update Settings");
    try {
      const newSettings = request.body;
      const settingsSaved = await Setting.findOneAndUpdate(
        {},
        { $set: newSettings },
        { new: true, upsert: true }
      );
      reply.status(200).send(settingsSaved);
    } catch (error) {
      reply.status(500).send(error);
    }
  });

  next();
}

module.exports = api;
