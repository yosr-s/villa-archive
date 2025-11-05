db = db.getSiblingDB('villa_archive_db');

db.createUser({
  user: 'adminVilla',
  pwd: 'MotDePasseUltraSecurise',
  roles: [
    { role: 'readWrite', db: 'villa_archive_db' },
    { role: 'dbAdmin', db: 'villa_archive_db' }
  ]
});
