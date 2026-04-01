const fs = require('fs');
const path = require('path');

// Simple CSV parser
function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const record = {};
    headers.forEach((header, index) => {
      record[header.trim()] = values[index] ? values[index].trim() : '';
    });
    return record;
  });
}

// Load CSV data into memory
const csvPath = path.join(__dirname, '../../demo_dataset.csv');
const fileContent = fs.readFileSync(csvPath, 'utf-8');
const records = parseCSV(fileContent);

// Create a mock pool object with the same interface
const pool = {
  query: async (queryStr, params) => {
    // Simple search implementation
    const searchTerm = params && params[0] ? params[0].toLowerCase() : '';
    
    if (!searchTerm) {
      return { rows: [] };
    }

    const results = records.filter(record => 
      record.title.toLowerCase().includes(searchTerm) ||
      record.content.toLowerCase().includes(searchTerm)
    ).map(record => ({
      title: record.title,
      url: record.url
    }));

    return { rows: results };
  }
};

module.exports = pool;