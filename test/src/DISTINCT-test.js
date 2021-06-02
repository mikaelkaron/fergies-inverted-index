const fii = require('../../')
const test = require('tape')

const sandbox = 'test/sandbox/'
const indexName = sandbox + 'DISTINCT'

const data = [
  {
    _id: 0,
    make: 'BMW',
    colour: 'Blue',
    year: 2011,
    price: 0,
    model: '3-series',
    drivetrain: 'Hybrid',
    wordVector: {
      these: 4,
      are: 3,
      words: 0.45,
      with: 10,
      scores: 9
    }
  },
  {
    _id: 1,
    make: 'Volvo',
    colour: 'Black',
    year: 2016,
    price: 44274,
    model: 'XC90',
    drivetrain: 'Petrol',
    wordVector: {
      these: 0.2,
      are: 1,
      words: 0.45,
      with: 11,
      scores: 2
    }
  },
  {
    _id: 2,
    make: 'Volvo',
    colour: 'Silver',
    year: 2008,
    price: 14,
    model: 'XC90',
    drivetrain: 'Hybrid',
    wordVector: {
      these: 4,
      are: 5,
      words: 6,
      with: 0.2,
      scores: 1
    }
  },
  {
    _id: 3,
    make: 'Volvo',
    colour: 'Silver',
    year: 2007,
    price: 47391,
    model: 'XC60',
    drivetrain: 'Hybrid',
    wordVector: {
      these: 2,
      are: 100,
      words: 3,
      with: 0.1,
      scores: 0.9
    }
  },
  {
    _id: 4,
    make: 'BMW',
    colour: 'Black',
    year: 2000,
    price: 100,
    model: '5-series',
    drivetrain: 'Diesel',
    wordVector: {
      these: 4,
      are: 3,
      words: 0.45,
      with: 10,
      scores: 9
    }
  },
  {
    _id: 5,
    make: 'Tesla',
    colour: 'Red',
    year: 2014,
    price: 75397,
    model: 'X',
    drivetrain: 'Electric'
  },
  {
    _id: 6,
    make: 'Tesla',
    colour: 'Blue',
    year: 2017,
    price: 79540,
    model: 'S',
    drivetrain: 'Electric'
  },
  {
    _id: 7,
    make: 'BMW',
    colour: 'Black',
    year: 2019,
    price: 57280,
    model: '3-series',
    drivetrain: 'Petrol'
  },
  {
    _id: 8,
    make: 'BMW',
    colour: 'Silver',
    year: 2015,
    price: 81177,
    model: '3-series',
    drivetrain: 'Petrol'
  },
  {
    _id: 9,
    make: 'Volvo',
    colour: 'White',
    year: 2004,
    price: 37512,
    model: 'XC90',
    drivetrain: 'Hybrid'
  }
]

test('create index', t => {
  t.plan(1)
  fii({ name: indexName }).then(db => {
    global[indexName] = db
    t.ok(db, !undefined)
  })
})

test('can add some data', t => {
  t.plan(1)
  global[indexName].PUT(data).then(t.pass)
})

test('get DISTINCT values for one field', t => {
  t.plan(1)
  global[indexName]
    .DISTINCT({
      FIELD: 'drivetrain'
    })
    .then(result =>
      t.deepEqual(result, [
        { FIELD: 'drivetrain', VALUE: 'Diesel' },
        { FIELD: 'drivetrain', VALUE: 'Electric' },
        { FIELD: 'drivetrain', VALUE: 'Hybrid' },
        { FIELD: 'drivetrain', VALUE: 'Petrol' }
      ])
    )
})

test('get DISTINCT values for two fields', t => {
  t.plan(1)
  global[indexName]
    .DISTINCT({
      FIELD: ['drivetrain', 'make']
    })
    .then(result =>
      t.deepEqual(result, [
        { FIELD: 'drivetrain', VALUE: 'Diesel' },
        { FIELD: 'drivetrain', VALUE: 'Electric' },
        { FIELD: 'drivetrain', VALUE: 'Hybrid' },
        { FIELD: 'drivetrain', VALUE: 'Petrol' },
        { FIELD: 'make', VALUE: 'BMW' },
        { FIELD: 'make', VALUE: 'Tesla' },
        { FIELD: 'make', VALUE: 'Volvo' }
      ])
    )
})

test('get DISTINCT values for two fields with GTE', t => {
  t.plan(1)
  global[indexName]
    .DISTINCT({
      FIELD: ['drivetrain', 'make'],
      VALUE: {
        GTE: 'F'
      }
    })
    .then(result =>
      t.deepEqual(result, [
        { FIELD: 'drivetrain', VALUE: 'Hybrid' },
        { FIELD: 'drivetrain', VALUE: 'Petrol' },
        { FIELD: 'make', VALUE: 'Tesla' },
        { FIELD: 'make', VALUE: 'Volvo' }
      ])
    )
})

test('get DISTINCT values with two clauses', t => {
  t.plan(1)
  global[indexName]
    .DISTINCT(
      {
        FIELD: ['drivetrain']
      },
      {
        FIELD: ['make']
      }
    )
    .then(result =>
      t.deepEqual(result, [
        { FIELD: 'drivetrain', VALUE: 'Diesel' },
        { FIELD: 'drivetrain', VALUE: 'Electric' },
        { FIELD: 'drivetrain', VALUE: 'Hybrid' },
        { FIELD: 'drivetrain', VALUE: 'Petrol' },
        { FIELD: 'make', VALUE: 'BMW' },
        { FIELD: 'make', VALUE: 'Tesla' },
        { FIELD: 'make', VALUE: 'Volvo' }
      ])
    )
})

test('get DISTINCT values with two clauses', t => {
  t.plan(1)
  global[indexName]
    .DISTINCT(
      {
        FIELD: ['drivetrain'],
        VALUE: { LTE: 'F' }
      },
      {
        FIELD: ['make']
      }
    )
    .then(result =>
      t.deepEqual(result, [
        { FIELD: 'drivetrain', VALUE: 'Diesel' },
        { FIELD: 'drivetrain', VALUE: 'Electric' },
        { FIELD: 'make', VALUE: 'BMW' },
        { FIELD: 'make', VALUE: 'Tesla' },
        { FIELD: 'make', VALUE: 'Volvo' }
      ])
    )
})

test('get DISTINCT values with two identical clauses', t => {
  t.plan(1)
  global[indexName]
    .DISTINCT(
      {
        FIELD: ['drivetrain']
      },
      {
        FIELD: ['drivetrain']
      }
    )
    .then(result =>
      t.deepEqual(result, [
        { FIELD: 'drivetrain', VALUE: 'Diesel' },
        { FIELD: 'drivetrain', VALUE: 'Electric' },
        { FIELD: 'drivetrain', VALUE: 'Hybrid' },
        { FIELD: 'drivetrain', VALUE: 'Petrol' }
      ])
    )
})

test('get DISTINCT values for three fields', t => {
  t.plan(1)
  global[indexName]
    .DISTINCT({
      FIELD: ['drivetrain', 'make', 'colour']
    })
    .then(result =>
      t.deepEqual(result, [
        { FIELD: 'drivetrain', VALUE: 'Diesel' },
        { FIELD: 'drivetrain', VALUE: 'Electric' },
        { FIELD: 'drivetrain', VALUE: 'Hybrid' },
        { FIELD: 'drivetrain', VALUE: 'Petrol' },
        { FIELD: 'make', VALUE: 'BMW' },
        { FIELD: 'make', VALUE: 'Tesla' },
        { FIELD: 'make', VALUE: 'Volvo' },
        { FIELD: 'colour', VALUE: 'Black' },
        { FIELD: 'colour', VALUE: 'Blue' },
        { FIELD: 'colour', VALUE: 'Red' },
        { FIELD: 'colour', VALUE: 'Silver' },
        { FIELD: 'colour', VALUE: 'White' }
      ])
    )
})

test('all prices over 100', t => {
  t.plan(1)
  global[indexName]
    .DISTINCT({
      FIELD: 'price',
      VALUE: {
        GTE: 100
      }
    })
    .then(result =>
      t.deepEqual(result, [
        { FIELD: 'price', VALUE: 100 },
        { FIELD: 'price', VALUE: 37512 },
        { FIELD: 'price', VALUE: 44274 },
        { FIELD: 'price', VALUE: 47391 },
        { FIELD: 'price', VALUE: 57280 },
        { FIELD: 'price', VALUE: 75397 },
        { FIELD: 'price', VALUE: 79540 },
        { FIELD: 'price', VALUE: 81177 }
      ])
    )
})

test('all prices under 100', t => {
  t.plan(1)
  global[indexName]
    .DISTINCT({
      FIELD: 'price',
      VALUE: {
        LTE: 100
      }
    })
    .then(result =>
      t.deepEqual(result, [
        { FIELD: 'price', VALUE: 0 },
        { FIELD: 'price', VALUE: 14 },
        { FIELD: 'price', VALUE: 100 }
      ])
    )
})

test('all wordVectors', t => {
  t.plan(1)
  global[indexName]
    .DISTINCT({
      FIELD: 'wordVector.words'
    })
    .then(result =>
      t.deepEqual(result, [
        { FIELD: 'price', VALUE: 0 },
        { FIELD: 'price', VALUE: 14 },
        { FIELD: 'price', VALUE: 100 }
      ])
    )
})

// test('get DISTINCT values for ALL fields using no param (DISTINCT())', t => {
//   t.plan(1)
//   global[indexName].DISTINCT().then(result =>
//     t.deepEqual(result, [
//       { FIELD: 'colour', VALUE: 'Black' },
//       { FIELD: 'colour', VALUE: 'Blue' },
//       { FIELD: 'colour', VALUE: 'Red' },
//       { FIELD: 'colour', VALUE: 'Silver' },
//       { FIELD: 'colour', VALUE: 'White' },
//       { FIELD: 'drivetrain', VALUE: 'Diesel' },
//       { FIELD: 'drivetrain', VALUE: 'Electric' },
//       { FIELD: 'drivetrain', VALUE: 'Hybrid' },
//       { FIELD: 'drivetrain', VALUE: 'Petrol' },
//       { FIELD: 'make', VALUE: 'BMW' },
//       { FIELD: 'make', VALUE: 'Tesla' },
//       { FIELD: 'make', VALUE: 'Volvo' },
//       { FIELD: 'model', VALUE: '3-series' },
//       { FIELD: 'model', VALUE: '5-series' },
//       { FIELD: 'model', VALUE: 'S' },
//       { FIELD: 'model', VALUE: 'X' },
//       { FIELD: 'model', VALUE: 'XC60' },
//       { FIELD: 'model', VALUE: 'XC90' },
//       { FIELD: 'price', VALUE: 0 },
//       { FIELD: 'price', VALUE: 14 },
//       { FIELD: 'price', VALUE: 100 },
//       { FIELD: 'price', VALUE: 37512 },
//       { FIELD: 'price', VALUE: 44274 },
//       { FIELD: 'price', VALUE: 47391 },
//       { FIELD: 'price', VALUE: 57280 },
//       { FIELD: 'price', VALUE: 75397 },
//       { FIELD: 'price', VALUE: 79540 },
//       { FIELD: 'price', VALUE: 81177 },
//       { FIELD: 'year', VALUE: 2000 },
//       { FIELD: 'year', VALUE: 2004 },
//       { FIELD: 'year', VALUE: 2007 },
//       { FIELD: 'year', VALUE: 2008 },
//       { FIELD: 'year', VALUE: 2011 },
//       { FIELD: 'year', VALUE: 2014 },
//       { FIELD: 'year', VALUE: 2015 },
//       { FIELD: 'year', VALUE: 2016 },
//       { FIELD: 'year', VALUE: 2017 },
//       { FIELD: 'year', VALUE: 2019 }
//     ])
//   )
// })

// test('get DISTINCT values for ALL fields using {}', t => {
//   t.plan(1)
//   global[indexName].DISTINCT({}).then(result =>
//     t.deepEqual(result, [
//       { FIELD: 'colour', VALUE: 'Black' },
//       { FIELD: 'colour', VALUE: 'Blue' },
//       { FIELD: 'colour', VALUE: 'Red' },
//       { FIELD: 'colour', VALUE: 'Silver' },
//       { FIELD: 'colour', VALUE: 'White' },
//       { FIELD: 'drivetrain', VALUE: 'Diesel' },
//       { FIELD: 'drivetrain', VALUE: 'Electric' },
//       { FIELD: 'drivetrain', VALUE: 'Hybrid' },
//       { FIELD: 'drivetrain', VALUE: 'Petrol' },
//       { FIELD: 'make', VALUE: 'BMW' },
//       { FIELD: 'make', VALUE: 'Tesla' },
//       { FIELD: 'make', VALUE: 'Volvo' },
//       { FIELD: 'model', VALUE: '3-series' },
//       { FIELD: 'model', VALUE: '5-series' },
//       { FIELD: 'model', VALUE: 'S' },
//       { FIELD: 'model', VALUE: 'X' },
//       { FIELD: 'model', VALUE: 'XC60' },
//       { FIELD: 'model', VALUE: 'XC90' },
//       { FIELD: 'price', VALUE: 0 },
//       { FIELD: 'price', VALUE: 14 },
//       { FIELD: 'price', VALUE: 100 },
//       { FIELD: 'price', VALUE: 37512 },
//       { FIELD: 'price', VALUE: 44274 },
//       { FIELD: 'price', VALUE: 47391 },
//       { FIELD: 'price', VALUE: 57280 },
//       { FIELD: 'price', VALUE: 75397 },
//       { FIELD: 'price', VALUE: 79540 },
//       { FIELD: 'price', VALUE: 81177 },
//       { FIELD: 'year', VALUE: 2000 },
//       { FIELD: 'year', VALUE: 2004 },
//       { FIELD: 'year', VALUE: 2007 },
//       { FIELD: 'year', VALUE: 2008 },
//       { FIELD: 'year', VALUE: 2011 },
//       { FIELD: 'year', VALUE: 2014 },
//       { FIELD: 'year', VALUE: 2015 },
//       { FIELD: 'year', VALUE: 2016 },
//       { FIELD: 'year', VALUE: 2017 },
//       { FIELD: 'year', VALUE: 2019 }
//     ])
//   )
// })
