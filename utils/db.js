const sqlite3 = require('better-sqlite3');
const db = new sqlite3('./db.db');// , { verbose: console.log }

db.pragma("synchronous = 1");

db.pragma("journal_mode = wal");

db.prepare('CREATE TABLE IF NOT EXISTS config (x INTEGER PRIMARY KEY, id TEXT NOT NULL, conf TEXT, serwer TEXT);').run();

db.prepare('CREATE TABLE IF NOT EXISTS licz (x INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, odp TEXT);').run();

db.prepare("CREATE TABLE IF NOT EXISTS command ('x' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 'cmd' TEXT, 'srv' TEXT, 'txt' TEXT, 'md5' TEXT);").run();

db.prepare("CREATE TABLE IF NOT EXISTS  'msg' ('x' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 'msg' TEXT, 'history' TEXT,'chan' TEXT,'autor' INTEGER,'idmsg' INTEGER,'srv' INTEGER,'time' DATETIME, 'edit' TEXT, 'attach' TEXT, 'embed' TEXT);").run();

db.prepare("CREATE TABLE IF NOT EXISTS 'moon' ('x' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 'time' TEXT, 'phase' TEXT, 'distance' TEXT);").run();

db.prepare("CREATE TABLE IF NOT EXISTS 'calendar' ('x' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 'month' INTEGER, 'day' INTEGER, 'swieto' TEXT, 'przyslowie' TEXT, 'imieniny' TEXT, 'cytat' TEXT);").run();

db.prepare("CREATE TABLE IF NOT EXISTS 'calendar_local' ('x' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 'day' INTEGER, 'month' INTEGER, 'server' INTEGER, 'swieto' TEXT);").run();

db.prepare("CREATE TABLE IF NOT EXISTS 'newssub' ('x' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 'news' TEXT NOT NULL, 'chan' INTEGER NOT NULL, 'srv' INTEGER NOT NULL);").run();



module.exports = db;