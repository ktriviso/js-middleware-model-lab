DROP DATABASE IF EXISTS dog_db_tdd;
CREATE DATABASE dog_db_tdd;
\c dog_db_tdd

DROP TABLE IF EXISTS breed;
DROP TABLE IF EXISTS dog;
CREATE TABLE breed (
  breed_id    SERIAL PRIMARY KEY NOT NULL,
  name        VARCHAR(64),
  section     VARCHAR(64),
  country     VARCHAR(128),
  image       VARCHAR(128)
);

\copy breed (name,section,country,image) FROM './breeds.csv' DELIMITER ',';


CREATE TABLE dog (
  dog_id        SERIAL PRIMARY KEY,
  name          VARCHAR(64) NOT NULL,
  color         VARCHAR(64) NOT NULL,
  lbs           DECIMAL(6,3),
  breed         INT REFERENCES breed (breed_id),
  tag_id        UUID,
  state_born    CHAR(2),
  age           SMALLINT,
  date_created  timestamp DEFAULT NOW(),
  date_updated  timestamp
);

\copy dog (name,color,breed,age,state_born,tag_id,lbs) FROM './dogs.csv' DELIMITER ','
