const { MongoClient } = require('mongodb');
const fs = require('fs');

const password = encodeURIComponent("Admin123456");
const uri = `mongodb+srv://admin:${password}@cluster0.xljpiwa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri);
const dbName = 'test'; // thay đổi nếu cần

async function importData() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('Vocabulary');

    // Đọc file JSON
    const data = JSON.parse(fs.readFileSync('./defaultCards.json', 'utf8'));
    
    // Xóa trường `id` để MongoDB tự sinh ObjectId
    const documents = data.cards.map(({ id, ...rest }) => rest);

    // Insert vào MongoDB
    const result = await collection.insertMany(documents);
    console.log(`${result.insertedCount} documents inserted.`);
  } catch (err) {
    console.error('Error inserting documents:', err);
  } finally {
    await client.close();
  }
}

importData();
