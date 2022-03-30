const crudfs = require("./crud-fs");
const { exec } = require('child_process'); function exec_cmd(command) { return new Promise(function(resolve, reject) { exec(command, (err, stdout, stderr) => { if (err) { return reject(err); } else { return resolve(stdout); } }); });} 

// set and setting
const fs = require("fs")
const TEST_DIR="./tmp-crud-fs"
if (!fs.existsSync( TEST_DIR )){ fs.mkdirSync( TEST_DIR ); }

// 
test('create()', async() => {
    // set and setting
    await exec_cmd('rm -rf "'+TEST_DIR + "/matrix"+'"');
	await exec_cmd('mkdir "'+TEST_DIR + "/matrix"+'"');
    // input
    let i1 = TEST_DIR + "/matrix"
    let i2 = TEST_DIR + "/matrix/matrix-resurrected.mp4";
    let i3 = "lots of binary";
  
    // output
    crudfs.create(i1);
    crudfs.create(i2,i3);
    expect(fs.existsSync(i1)).toEqual(true);
    expect(fs.existsSync(i2)).toEqual(true);
});

test('read()', async() => {
    // set and setting
    await exec_cmd('rm -rf "'+TEST_DIR + "/matrix"+'"');
  	await exec_cmd('mkdir "'+TEST_DIR + "/matrix"+'"');
	crudfs.create(TEST_DIR + "/matrix"); 
    crudfs.create(TEST_DIR + "/matrix/matrix-resurrected.mp4","lots of binary");
   
    // input
    let i1 = TEST_DIR + "/matrix/matrix-resurrected.mp4";
    let i2 = TEST_DIR + "/matrix"
   
    // output
  	let result_dir = crudfs.read(i2); 
    let result_file = crudfs.read(i1);
    let expected_dir = [TEST_DIR + "/matrix/matrix-resurrected.mp4"];
    let expected_file = "lots of binary";
    expect(result_dir).toStrictEqual(expected_dir);
    expect(result_file).toStrictEqual(expected_file);
});
test('update::dir()', async() => {
    // set and setting
    await exec_cmd('rm -rf "'+TEST_DIR + "/matrix"+'"');
	await exec_cmd('rm -rf "'+TEST_DIR + "/mx"+'"');
	await exec_cmd('mkdir "'+TEST_DIR + "/matrix"+'"');
  	crudfs.create(TEST_DIR + "/matrix");
    crudfs.create(TEST_DIR + "/matrix/matrix-resurrected.mp4","lots of binary");
   
    // input
    let i2 = TEST_DIR + "/matrix"
    let i3 = TEST_DIR + "/mx";
 
    // output
    crudfs.update(i2,i3);   
    let i1 = TEST_DIR + "/matrix/matrix-resurrected.mp4";
  	let i4 = TEST_DIR + "/mx/matrix-resurrected.mp4"
  	expect(fs.existsSync(i1)).toEqual(false);
    expect(fs.existsSync(i2)).toEqual(false);
	expect(fs.existsSync(i3)).toEqual(true);
    expect(fs.existsSync(i4)).toEqual(true);
});


// 
test('update::file()', async() => {
    // set and setting
    await exec_cmd('rm -rf "'+TEST_DIR + "/matrix"+'"');
    await exec_cmd('rm -rf "'+TEST_DIR + "/mx"+'"');
	await exec_cmd('mkdir "'+TEST_DIR + "/matrix"+'"');
	crudfs.create(TEST_DIR + "/matrix"); //lib.getCommonTags(i1);
    crudfs.create(TEST_DIR + "/matrix/matrix-resurrected.mp4","lots of binary");
    crudfs.create(TEST_DIR + "/mx");

    // input
    let i1 = TEST_DIR + "/matrix/matrix-resurrected.mp4";
    let i4 = TEST_DIR + "/mx/4.mp4"
 
    // output
    crudfs.update(i1,i4);
  	expect(fs.existsSync(i1)).toEqual(false);
    expect(fs.existsSync(i4)).toEqual(true);
});



//
test('delete::dir()', async() => {
    // set and setting
    await exec_cmd('rm -rf "'+TEST_DIR + "/matrix"+'"');
	await exec_cmd('mkdir "'+TEST_DIR + "/matrix"+'"');
	crudfs.create(TEST_DIR + "/matrix"); 
    crudfs.create(TEST_DIR + "/matrix/matrix-resurrected.mp4","lots of binary");
   
    // input
    let i2 = TEST_DIR + "/matrix"
 
    // output
    crudfs.delete(i2);
    let i1 = TEST_DIR + "/matrix/matrix-resurrected.mp4";
    expect(fs.existsSync(i2)).toEqual(false);
    expect(fs.existsSync(i1)).toEqual(false);
});

//
test('delete::file()', async() => {
    // set and setting
    await exec_cmd('rm -rf "'+TEST_DIR + "/matrix"+'"');
  	await exec_cmd('mkdir "'+TEST_DIR + "/matrix"+'"');
	crudfs.create(TEST_DIR + "/matrix"); //lib.getCommonTags(i1);
    crudfs.create(TEST_DIR + "/matrix/matrix-resurrected.mp4","lots of binary");
   
    // input
    let i1 = TEST_DIR + "/matrix/matrix-resurrected.mp4";
 
    // output
    crudfs.delete(i1);
    let i2 = TEST_DIR + "/matrix"
    expect(fs.existsSync(i1)).toEqual(false);
   	expect(fs.existsSync(i2)).toEqual(true);
});
// sidenote 80% of applying code changes
// is FINDING VARS.. WHERE?FILE?LINE?
// or FUNCTIONS for that matter..
// FINDING VARS/FUNCS
// and how they CONNECT to ROOT/FW/DEPS