const pg = require('pg-promise')({/* OPTIONAL Initialization Options */});

const config = {
  host:     'localhost',
  port:     5432,
  database: 'dog_db_tdd',
};

let db = pg(config);

module.exports = {
    findAll(){},
    findOne(){},
    makeOne(){},
    save(){},
    destroy(){}
};
