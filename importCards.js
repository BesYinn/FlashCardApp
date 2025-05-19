const { MongoClient } = require('mongodb');
const fs = require('fs');

const password = encodeURIComponent("Admin123456");
const uri = `mongodb+srv://admin:${password}@cluster0.xljpiwa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri);
const dbName = 'test';

async function importData() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('Vocabulary');

    // Đọc file JSON
    const data = JSON.parse(fs.readFileSync('./defaultCards.json', 'utf8'));

    // Lấy danh sách tất cả các từ trong file
    const allWords = data.cards.map(card => card.word);

    // Tìm các từ đã tồn tại trong DB
    const existingDocs = await collection.find({ word: { $in: allWords } }).toArray();
    const existingWords = new Set(existingDocs.map(doc => doc.word));

    // Lọc ra các từ chưa có trong DB
    const newDocuments = data.cards
      .filter(card => !existingWords.has(card.word))
      .map(({ id, ...rest }) => rest); // Bỏ trường id

    // Chèn vào MongoDB nếu có dữ liệu mới
    if (newDocuments.length > 0) {
      const result = await collection.insertMany(newDocuments);
      console.log(`${result.insertedCount} new documents inserted.`);
    } else {
      console.log('No new documents to insert.');
    }

  } catch (err) {
    console.error('Error inserting documents:', err);
  } finally {
    await client.close();
  }
}

importData();
