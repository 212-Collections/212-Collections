const { default: mongoose } = require("mongoose");
const itemSchema = require("../models/itemSchema");
const Collection = require("../models/collection");
const path = require("path");
const fs = require("fs");

function api(fastify, opts, next) {
  fastify.get("/item/:id", async (request, reply) => {
    console.log("> Get items");
    try {
      const id = request.params.id;
      const ItemModel = mongoose.model(
        "ItemModel",
        itemSchema,
        "collection-" + id
      );
      const items = await ItemModel.find({});
      reply.status(200).send(items);
    } catch (error) {
      reply.status(500).send(error);
    }
  });

  fastify.post("/item/new", async (request, reply) => {
    console.log("> New items");
    try {
      const data = request.body;
      const collectionName = "collection-" + data.collection_id;
      if (!mongoose.Types.ObjectId.isValid(data.collection_id)) {
        reply.status(404).send({
          statusCode: 409,
          error: "Conflict",
          message: "collection id invalid",
        });
        return;
      }
      const existingCollection = await Collection.findOne({
        _id: data.collection_id,
      });
      if (!existingCollection) {
        reply.status(404).send({
          statusCode: 404,
          error: "Conflict",
          message: "collection not found",
        });
        return;
      }
      const ItemModel = mongoose.model("ItemModel", itemSchema, collectionName);
      const item = new ItemModel(data);
      const itemSaved = await item.save();
      reply.status(200).send(itemSaved);
    } catch (error) {
      reply.status(500).send(error);
    }
  });

  fastify.put("/item/:id", async (request, reply) => {
    console.log("> Update item ID");
    try {
      const id = request.params.id;
      const data = request.body;
      const collectionName = "collection-" + data.collection_id;
      const item = await Collection.findOne({
        _id: id,
      });

      const existingCollection = await Collection.findOne({
        _id: data.collection_id,
      });
      if (!existingCollection) {
        reply.status(404).send({
          statusCode: 404,
          error: "Conflict",
          message: "collection not found",
        });
        return;
      }

      const ItemModel = mongoose.model("ItemModel", itemSchema, collectionName);

      const itemUpdated = await ItemModel.findOneAndUpdate(
        { _id: id },
        { $set: data },
        { new: true }
      );
      reply.status(200).send(itemUpdated);
    } catch (error) {
      console.log(error);
      reply.status(500).send(error);
    }
  });

  fastify.delete("/item/:id", async (request, reply) => {
    console.log("> Delete item ID");
    try {
      const id = request.params.id;
      const collectionId = request.body.collectionId;
      const collectionName = "collection-" + collectionId;
      const existingCollection = await Collection.findOne({
        _id: collectionId,
      });
      if (!existingCollection) {
        reply.status(404).send({
          statusCode: 404,
          error: "Conflict",
          message: "collection not found",
        });
        return;
      }
      const ItemModel = mongoose.model("ItemModel", itemSchema, collectionName);
      const itemDeleted = await ItemModel.findOneAndDelete({ _id: id });
      reply.status(200).send(itemDeleted);
    } catch (error) {
      console.log(error);
      reply.status(500).send(error);
    }
  });

  fastify.post("/search", async (request, reply) => {
    console.log("> Search");
    try {
      const searchTerm = request.body.term;
      const searchFields = request.body.fields;
      const collections = await mongoose.connection.db.collections();
      const searchResults = [];
      for (const collection of collections) {
        const modelName = collection.collectionName;
        const Model = mongoose.connection.model(
          modelName,
          new mongoose.Schema({}),
          modelName
        );
        let conditions = {};
        if (searchFields) {
          const fieldsArray = searchFields.split(",");
          const fieldConditions = fieldsArray.map((field) => ({
            [field]: { $regex: searchTerm, $options: "i" },
          }));
          conditions = { $or: fieldConditions };
        } else {
          conditions = { $text: { $search: searchTerm } };
        }
        const results = await Model.find(conditions);
        if (results.length > 0) {
          const updatedResults = results.map((result) => ({
            ...result.toObject(),
            collectionId: modelName.split("-")[1],
          }));
          searchResults.push(...updatedResults);
        }
      }
      return { results: searchResults };
    } catch (error) {
      console.log(error);
      reply.status(500).send(error);
    }
  });

  next();
}

module.exports = api;
