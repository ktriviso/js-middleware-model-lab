#!/usr/bin/env node
const faker = require('faker');
const count = +process.argv[2] || 5;


function makeFakeWeight() {
  return `${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 100) + 10}`;
}



Array(count).fill(0)
  .map(() => ({
    name:       faker.name.firstName(),
    color:      faker.commerce.color(),
    breed:      Math.floor(Math.random() * 343) + 1,
    age:        Math.floor(Math.random() * 20),
    state_born: faker.address.stateAbbr(),
    tag_id:     faker.random.uuid(),
    lbs:        makeFakeWeight(),
  }))
  .forEach(obj => console.log(Object.values(obj).join(',')))

