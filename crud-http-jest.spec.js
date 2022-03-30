// set and setting
const lib = require("./crud-http")
test('create()', async() => {
    // set and setting
    
    // input
    let i1 = 'http://httpbin.org/post';
  	let i2 = {"title":"test"}
  
    // output
    let result = (await lib.create(i1,i2)).url;
    let expected = "http://httpbin.org/post";
    expect(result).toStrictEqual(expected);
});

test('create()::withAuth', async() => {
    // set and setting
    
    // input
    let i1 = 'http://httpbin.org/post';
    let i2 = {"title":"test"}
  	let i3 = "Bearer: bearertoken";
  
    // output
    let result = (await lib.create(i1,i2,i3)).headers.Authorization;
    let expected = "Bearer: bearertoken";
    expect(result).toStrictEqual(expected);
});

test('create()::withError', async() => {
    // set and setting
    
    // input
    let i1 = 'http://localhost:9988';
  	let i2 = {"title":"test"}
    
    // output
    let result = await lib.create(i1,i2);
    let expected = {"status": 404,"error":"Error: connect ECONNREFUSED 127.0.0.1:9988"};
    expect(result).toStrictEqual(expected);
});
test('read()', async() => {
    // set and setting
    
    // input
    let i1 = 'http://httpbin.org/get';
  
    // output
    let result = (await lib.read(i1)).url;
    let expected = "http://httpbin.org/get";
    expect(result).toStrictEqual(expected);
});



test('read()::withAuth', async() => {
    // set and setting
    
    // input
    let i1 = 'http://httpbin.org/get';
  	let i2 = "Bearer: bearertoken";
  
    // output
    let result = (await lib.read(i1,i2)).headers.Authorization;
    let expected = "Bearer: bearertoken";
    expect(result).toStrictEqual(expected);
});

test('read()::withError', async() => {
    // set and setting
    
    // input
    let i1 = 'http://localhost:9988/api/non-existing';
  
    // output
    let result = await lib.read(i1);
    let expected = {"status": 404,"error":"Error: connect ECONNREFUSED 127.0.0.1:9988"};
    expect(result).toStrictEqual(expected);
});

test('update()', async() => {
    // set and setting
    
    // input
    let i1 = 'http://httpbin.org/put';
  
    // output
    let result = (await lib.update(i1)).url;
    let expected = "http://httpbin.org/put";
    expect(result).toStrictEqual(expected);
});

test('delete()', async() => {
    // set and setting
    
    // input
    let i1 = 'http://httpbin.org/delete';
  
    // output
    let result = (await lib.delete(i1)).url;
    let expected = "http://httpbin.org/delete";
    expect(result).toStrictEqual(expected);
});