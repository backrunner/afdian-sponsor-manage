import levelup from 'levelup';
import leveldown from 'leveldown';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.resolve(__dirname, '../leveldb');

if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH);
}

const level = levelup(leveldown(DB_PATH));

export default level;
