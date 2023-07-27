const Collection = require("../models/collection");
const itemSchema = require("../models/itemSchema");
const { default: mongoose } = require("mongoose");
const { arrayMove } = require("@dnd-kit/sortable");

function api(fastify, opts, next) {
  fastify.get("/collection/full", async (request, reply) => {
    console.log("> Get collections (full)");
    try {
      const collections = await Collection.find({});
      reply.status(200).send(collections);
    } catch (error) {
      reply.status(500).send(error);
    }
  });

  fastify.get("/collection/list", async (request, reply) => {
    console.log("> Get collections (list)");
    try {
      const collections = await Collection.find({})
        .select("name _id icon position")
        .sort({ position: 1 });
      reply.status(200).send(collections);
    } catch (error) {
      reply.status(500).send(error);
    }
  });

  fastify.get("/collection/homelist", async (request, reply) => {
    console.log("> Get collections (home)");
    try {
      const collections = await Collection.find({})
        .select("name _id icon position")
        .sort({ position: 1 });
      const collectionPromises = collections.map(async (collection) => {
        const ItemModel = mongoose.model(
          "ItemModel",
          itemSchema,
          "collection-" + collection._id
        );
        const elementCount = await ItemModel.countDocuments({});
        return { ...collection.toObject(), elementCount };
      });
      const collectionsWithElementCount = await Promise.all(collectionPromises);
      reply.status(200).send(collectionsWithElementCount);
    } catch (error) {
      reply.status(500).send(error);
    }
  });

  fastify.put("/collection/sort", async (request, reply) => {
    console.log("> Sort collections");
    try {
      const { activeIndex, overIndex } = request.body;
      const collections = await Collection.find({}).sort({ position: 1 });
      const newCollections = arrayMove(collections, activeIndex, overIndex);
      newCollections.forEach(async (collection, index) => {
        collection.position = index;
        await collection.save();
      });
      reply.status(200).send(newCollections);
    } catch (error) {
      console.log(error);
      reply.status(500).send(error);
    }
  });

  fastify.post("/collection/new", async (request, reply) => {
    console.log("> New collection");
    try {
      const data = request.body;
      const caseInsensitiveName = new RegExp(`^${data.name.trim()}$`, "i");
      const existingCollection = await Collection.findOne({
        name: caseInsensitiveName,
      });
      if (existingCollection) {
        reply.status(400).send({
          statusCode: 409,
          error: "Conflict",
          message: "collection already exist",
        });
        return;
      }
      const collection = new Collection({
        name: data.name.trim(),
        icon: data.icon,
        position: data.position,
        view: data.view,
      });
      const collectionSaved = await collection.save();
      reply.status(200).send(collectionSaved);
    } catch (error) {
      console.log(error);
      reply.status(500).send(error);
    }
  });

  fastify.get("/collection/:id", async (request, reply) => {
    console.log("> Get collection ID");
    try {
      const id = request.params.id;
      const collection = await Collection.findOne({
        _id: id,
      });
      if (!collection) {
        reply.status(400).send({
          statusCode: 409,
          error: "Conflict",
          message: "collection not found",
        });
        return;
      }
      reply.status(200).send(collection);
    } catch (error) {
      console.log(error);
      reply.status(500).send(error);
    }
  });

  fastify.delete("/collection/:id", async (request, reply) => {
    console.log("> Delete collection ID");
    try {
      const id = request.params.id;

      const collection = await Collection.findOne({
        _id: id,
      });

      if (!collection) {
        reply.status(400).send({
          statusCode: 409,
          error: "Conflict",
          message: "collection not found",
        });
        return;
      }

      const ItemModel = mongoose.model(
        "ItemModel",
        itemSchema,
        "collection-" + id
      );
      const collectionInstance = ItemModel.collection;
      collectionInstance.drop((error) => {
        if (error) {
          console.error(error);
        }
      });

      const collectionDelete = await Collection.findOneAndDelete({
        _id: id,
      });
      reply.status(200).send(collectionDelete);
    } catch (error) {
      console.log(error);
      reply.status(500).send(error);
    }
  });

  fastify.put("/collection/:id", async (request, reply) => {
    console.log("> Update collection ID");
    try {
      const id = request.params.id;
      const data = request.body;
      const collection = await Collection.findOne({
        _id: id,
      });

      if (!collection) {
        reply.status(400).send({
          statusCode: 409,
          error: "Conflict",
          message: "collection not found",
        });
        return;
      }
      const newCollection = {};
      Object.entries(data).forEach(([key, value]) => {
        if (["name", "view", "icon"].includes(key) && value) {
          newCollection[key] = value;
        }
      });
      const newCollectionSaved = await Collection.findOneAndUpdate(
        { _id: id },
        { $set: newCollection },
        { new: true }
      );
      reply.status(200).send(newCollectionSaved);
    } catch (error) {
      console.log(error);
      reply.status(500).send(error);
    }
  });
  next();
}

module.exports = api;
