const path = require('path');
module.exports = {
  type: 'mysql',
  url: process.env.DATABASE_URL || 'mysql://aa:aa@localhost:3306/aa_dynamic',
  entities: [path.join(__dirname, 'dist/**/*.entity.js')],
  migrations: [path.join(__dirname, 'dist/migrations/*.js')],
};
