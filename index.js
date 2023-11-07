import app from "./app.js"
import mongoose from "mongoose";

async function main() {
  await mongoose.connect(process.env.MONGO_URL);

  console.log("connected to db");
}
main().catch((err) => console.log(err));



app.listen(5000, () => {
  console.log("server running..");
});
