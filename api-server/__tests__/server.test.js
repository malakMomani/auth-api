'use strict';

require('@code-fellows/supergoose');

const Collection = require('../src/models/data-collection.js');
const foodModel = require('../src/models/food/model.js');
const clothesModel = require('../src/models/clothes/model.js');
const foodItem = new Collection(foodModel);
const clothesItem = new Collection(clothesModel);

describe('Food Model', ()=> {
  it('can create() a new item', async ()=> {
      let obj = {
                name: 'orange', 
                calories: 22, 
                type: 'FRUIT'
                };
      let newItem = await foodItem.create(obj);
      expect((newItem.name)).toEqual(obj.name);
      expect((newItem.calories)).toEqual(obj.calories);

  });
  it('can get All food items', async ()=> {
    let allItems = await foodItem.get();
    expect(typeof(allItems)).toEqual('object');
  });

  it('can get one food Item', async ()=> {
    let allItems = await foodItem.get();

    let oneItem = await foodItem.get(allItems[0].id);
    expect(allItems[0].name).toEqual(oneItem.name);
    expect(allItems[0].calories).toEqual(oneItem.calories);
  });
  it('can get update food Item', async ()=> {
    let allItems = await foodItem.get();

    let updateOne = await foodItem.update(allItems[0].id ,{
      name: 'orange-1', 
      calories: 22, 
      type: 'FRUIT'
      }
    );
    expect(updateOne.name).toEqual('orange-1');
  });
});

describe('Clothes Model', ()=> {
  it('can create() a new clothes item', async ()=> {
      let obj = {
                 name : 'shirt',
                 color: 'red',
                 size : 'large'
                };

      let newItem = await clothesItem.create(obj);
      expect((newItem.name)).toEqual(obj.name);
      expect((newItem.price)).toEqual(obj.price);
      expect((newItem.type)).toEqual(obj.type);

  });
  it('can get All Items', async ()=> {
    let allItems = await clothesItem.get();
    expect(typeof(allItems)).toEqual('object');
  });

  it('can get one Item', async ()=> {
    let allItems = await clothesItem.get();

    let oneItem = await clothesItem.get(allItems[0].id);
    expect(allItems[0].name).toEqual(oneItem.name);
    expect(allItems[0].price).toEqual(oneItem.price);
  });
  it('can get update Item', async ()=> {
    let allItems = await clothesItem.get();

    let updateOne = await clothesItem.update(allItems[0].id ,{
      name : 'shirt off',
      color: 'red',
      size : 'x-large'
    }
    );
    expect(updateOne.name).toEqual('shirt off');
    expect(updateOne.size).toEqual('x-large');
  });

});