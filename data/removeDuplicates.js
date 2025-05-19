const fs = require('fs');

const data = require('./defaultCards.json');
const seen = new Set();
const uniqueCards = [];

data.cards.forEach(card => {
  if (!seen.has(card.word)) {
    seen.add(card.word);
    uniqueCards.push(card);
  }
});

fs.writeFileSync(
  'defaultCards_no_duplicates.json',
  JSON.stringify({ cards: uniqueCards }, null, 2),
  'utf-8'
);

console.log('Đã loại bỏ trùng lặp. Số lượng mục còn lại:', uniqueCards.length);