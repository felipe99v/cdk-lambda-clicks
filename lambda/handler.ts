import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not set");
}

let client: MongoClient;

export const handler = async (): Promise<void> => {
  try {
    if (!client) {
      client = new MongoClient(MONGO_URI);
      await client.connect();
    }

    const db = client.db("analytics");
    const clicks = Math.floor(Math.random() * 100);
    const doc = {
      timestamp: new Date().toISOString(),
      clicks,
    };

    await db.collection("clicks").insertOne(doc);

    console.log(`Inserted document: ${JSON.stringify(doc)}`);
  } catch (err) {
    console.error("Error inserting document:", err);
    throw err;
  }
};