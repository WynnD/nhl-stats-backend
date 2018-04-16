const mongoose = require('mongoose');
const app = require('express');
const config = require('config');

const dbConfig = config.get("dbConfig");

try {
  if (dbConfig.user) {
    await mongoose.connect(`mongodb+srv://${dbConfig.user.username}:${dbConfig.user.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`);
  } else {
    await mongoose.connect(`mongodb://${dbConfig.host}:${dbConfig.port}`);
  }
} catch (e) {
  console.error(e);
}