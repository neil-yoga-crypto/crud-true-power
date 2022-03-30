test('read', async() => {
  	// set & setting
  
  	// input
    const data = {"title":"Knock knock neo"};
    const lastId = await crudmongo.create(dbs,"rnotes",data);
  
  	// output
    const dbObj = await crudmongo.read(dbs,"rnotes",lastId);
    expect(dbObj[0].title).toEqual("Knock knock neo");
});

test('update', async() => {
  	// set & setting
    const data = {"title":"Knock knock neo"};
    const lastId = await crudmongo.create(dbs,"unotes",data);
  
  	// input
    await crudmongo.update(dbs,"unotes",{"_id":lastId},{"title":"Follow the white rabbit"});
  
  	// output
    const obj = await crudmongo.read(dbs,"unotes",lastId);
    expect(obj[0].title).toEqual("Follow the white rabbit");
});

test('delete', async() => {
  	// set & setting
  	const data = {"title":"Morpheus?"};
    const lastId = await crudmongo.create(dbs,"dnotes",data);
  
  	// input
    await crudmongo.delete(dbs,"dnotes",{"_id":lastId});

  	// output
    const dbObj = await crudmongo.read(dbs,"dnotes",lastId);
    expect(dbObj).toStrictEqual([]);
});


//
let dbs = '';
let client = '';
beforeAll(async() => {
	const dbname = 'test-mq3';
    await exec_cmd("mongo " + dbname + " --quiet --eval \"db.dropDatabase()\"")
    try {
        let obj = await crudmongo.connectWithClient(dbname);
      	dbs = obj.dbs;
      	client = obj.client;
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
});
afterAll(() => {
  return client.close();
});
const crudmongo = require('./crud-mongo');
const { exec } = require('child_process'); function exec_cmd(command) { return new Promise(function(resolve, reject) { exec(command, (err, stdout, stderr) => { if (err) { return reject(err); } else { return resolve(stdout); } }); });}
