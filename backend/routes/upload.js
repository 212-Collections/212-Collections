const path = require("path");
const fs = require("fs");

function api(fastify, opts, next) {
  fastify.post("/upload/icon", async (request, reply) => {
    console.log("> Upload avatar");
    try {
      const data = await request.file();
      const uploadPath = path.join(
        __dirname,
        "..",
        "uploads",
        "item_icon" + path.extname(data.filename)
      );
    //   if (fs.existsSync(uploadPath)) {
    //     fs.unlinkSync(uploadPath);
    //   }
      const stream = fs.createWriteStream(uploadPath);
      await new Promise((resolve, reject) => {
        data.file
          .on("error", (error) => {
            stream.destroy();
            reject(error);
          })
          .pipe(stream);
        stream.on("finish", resolve);
        stream.on("error", reject);
      });
      reply.status(200).send({ message: "File uploaded" });
    } catch (error) {
      console.log(error);
      reply.status(500).send(error);
    }
  });
  fastify.post("/upload/image", async (request, reply) => {
    console.log("> Upload image");
    try {
      const data = await request.file();
      const uploadPath = path.join(
        __dirname,
        "..",
        "uploads",
        "item_image" + path.extname(data.filename)
      );
      const stream = fs.createWriteStream(uploadPath);
      await new Promise((resolve, reject) => {
        data.file
          .on("error", (error) => {
            stream.destroy();
            reject(error);
          })
          .pipe(stream);
        stream.on("finish", resolve);
        stream.on("error", reject);
      });
      reply.status(200).send({ message: "File uploaded" });
    } catch (error) {
      console.log(error);
      reply.status(500).send(error);
    }
  });

  next();
}

module.exports = api;
