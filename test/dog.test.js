/* eslint-env mocha */
const chai = require('chai');
const dog = require('../dog');
const dbHandle = dog.db;

const { expect } = chai;

describe('dog model', () => {
  it('should be an object', () => {
    expect(dog).to.be.an('object');
  });

  it('should have the correct methods', () => {
    expect(dog).to.respondTo('findAll');
    expect(dog).to.respondTo('findOne');
    expect(dog).to.respondTo('makeOne');
    expect(dog).to.respondTo('save');
    expect(dog).to.respondTo('destroy');
  });

  describe('#findAll', () => {
    // we should be able to get 50 dogs.
    it('should retrieve 344 records', async () => {
      const results = await dog.findAll();
      expect(true).to.be.ok;
      expect(results).to.have.length(50);
    });
  });

  describe('#findOne', () => {
    it('should retrive 1 record', async () => {
      const results = await dog.findOne(3);
      expect(results).to.be.an('object');
    });

    it('should retrive the correct record', async () => {
      const result = await dog.findOne(48);
      const expected = {
        "dog_id":48,"name":"Thurman","color":"maroon","lbs":"86.800","breed":159,"tag_id":"30f9bd82-27bd-438c-9a22-d0b5b4058154","state_born":"OK","age":17,"date_created":"date","date_updated":null};

      result.date_created = 'date';
      const expected_str = JSON.stringify(expected)

        
      expect(JSON.stringify(result)).to.equal(expected_str)
    });
  });

  describe('#makeOne', () => {
    it('should have the right properties', async () => {
      let result;
      await dbHandle.tx(async (t) => {
        dog.setDbHandle(t);
        result = await dog.makeOne();
        throw Error('rollback');
      }).catch((err) => err);

      [
        'name',
        'color',
        'lbs',
        'breed',
        'age',
        'state_born',
        'tag_id',
      ].forEach((prop) => {
        expect(result).to.have.property(prop);
        expect(result[prop]).not.to.be.ok;
      });
      [ 'dog_id', 'date_created' ].forEach((prop) => {
        expect(result).to.have.property(prop);
        expect(result[prop]).to.be.ok;
      });
    });
  });

  describe('#save', async () => {
    let result;
    it('should save the right thing', async () => {
      const doggieData = {
        name: 'honey',
        breed: 234,
        color: 'red',
        lbs: '240.000',
        age: 11,
        state_born: 'TN',
        tag_id: 'fa8bf494-2889-4908-a008-c00f7c2d76ca'
      }
      await dbHandle.tx((t) => {
        dog.setDbHandle(t);
        dog.save(3, doggieData)
          .then((data) => {
            result = data;
          });
        throw Error('rollback');
      }).catch((err) => err);
      expect(result).to.be.ok;
      expect(result.dog_id).to.equal(3);
      [ 'date_created', 'date_updated' ].forEach((prop) => {
        expect(result).to.have.property(prop);
      });

      delete result.date_created;
      delete result.date_updated;
      delete result.dog_id;
      expect(result).to.deep.equal(doggieData);
    });
  });

  describe('#destroy', () => {
    let firstResult, count, gone_dog, present_dog, second_count, findError;
    const id = 34;

    before(async () => {
      await dbHandle.tx( async (t) => {
        dog.setDbHandle(t);
        firstResult = await dog.findOne(id);
        raw_count = await dog.findAll();
        count = raw_count.length;
        await dog.destroy(id);
        raw_count = await dog.findAll();
        second_count = raw_count.length
        present_dog = await dog.findOne(id + 1);
        try {
          gone_dog =  await dog.findOne(id)
        } catch(e) {
          findError = e;
        }
        throw Error('rollback');
      }).catch(e => e);
    });

    it('should return a dog that exists', async () => {
      expect(firstResult).to.be.ok;
    });

    it('should start off with a valid id', () => {
      expect(firstResult.dog_id).to.equal(id);
    });

    it('should actually remove a dog with that id', () => {
      expect(gone_dog).to.be.undefined;
    });

    it('should delete one and only one dog', () => {
      expect(present_dog).to.be.ok;
      expect(second_count).to.equal(--count);
    });

    it('should throw a not found error', () => {
      const name = findError.name;
      expect(name).to.equal('QueryResultError');
    });
  });
});
