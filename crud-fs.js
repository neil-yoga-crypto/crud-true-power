// creates dir or file if 2nd parameter is not null
module.exports.create = function(path,fcontent=null) {
    return createfn(path,fcontent);
}

// returns a file's content or the files of a directory as a list
module.exports.read = function(path) {
    return readfn(path);
}

// moves a file or directory
module.exports.update = function(src,dst) {
    return updatefn(src,dst)
}

// deletes a file or directory
module.exports.delete = function(path) {
    return deletefn(path);
}
const fs = require('fs');
const path = require('path');


// short handy function to determine if a path is a directory
function isDir(path) {
     return fs.existsSync(path) && fs.statSync(path).isDirectory(); 
}

      
function createfn(path,fcontent=null) {
  if(fcontent===null) {  
  	return createDirIfNotExists(path);
  } else {
	return createFile(path,fcontent);
  }
}

function createFile(path, content) {
     return fs.writeFileSync(path, content); 
}


function createDirIfNotExists(dir) { 
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      	return true;
    } else {
     	return false; 
    }
}


function readfn(path=null) {
  // return current dir if no path is defined
  if(path === null || path.length===0) {
   	path = '.'; 
  }
  
  if(isDir(path)) {
  	return getDirectoryFiles(path);
  } else {
	return readFile(path);
  }
}

function readFile(file_path) {
    return fs.readFileSync(file_path, 'utf-8');
}

// get the absolute file paths of all files in a directory
function getDirectoryFiles(path) {
  let files = fs.readdirSync(path);
  let afiles = [];
   for(let i=0;i<files.length;i++) {
      afiles.push(path+'/'+files[i]);
	}	
  
  return afiles;
}


function updatefn(src,dst) {
   if(isDir(src)) {
  		return moveDir(src,dst);
  } else {
		return moveFile(src,dst);
  }
}

function moveDir(srcDir,destDir) {
  return fs.renameSync(srcDir, destDir);
}
function moveFile(srcFile,destFileOrDir) {
    // When copying to '/path/dir':
    //    thisDest = '/path/dir/file1'
    if (isDir(destFileOrDir)) {
      destFileOrDir = destFileOrDir + '/' + path.basename(srcFile);
    }

    return fs.renameSync(srcFile, destFileOrDir);
}




function deletefn(path) {
  if(isDir(path)) {
  	return deleteDirectory(path);
  } else {
	return deleteFile(path);
  }
}

function deleteFile(path) {
 return fs.unlinkSync(path); 
}

function deleteDirectory(path) {
  return rmdirSyncRecursive(path);
}

//
// Recursively removes 'dir'
// Adapted from https://github.com/ryanmcgrath/wrench-js
//
// Copyright (c) 2010 Ryan McGrath
// Copyright (c) 2012 Artur Adib
//
// Licensed under the MIT License
// http://www.opensource.org/licenses/mit-license.php
function rmdirSyncRecursive(dir) {
  let files;

  files = fs.readdirSync(dir);

  // Loop through and delete everything in the sub-tree after checking it
  for (let i = 0; i < files.length; i++) {
    let file = dir + '/' + files[i];
    if (isDir(file)) { // Recursive function back to the beginning
      rmdirSyncRecursive(file);
    } else { // Assume it's a file - perhaps a try/catch belongs here?
    	fs.unlinkSync(file);
    }
  }


  // Now that we know everything in the sub-tree has been deleted, we can delete the main directory.
  // Huzzah for the shopkeep.

  let result;
  // Retry on windows, sometimes it takes a little time before all the files in the directory are gone
  let start = Date.now();

   // TODO: replace this with a finite loop
   for (;;) {
   	try {
    	result = fs.rmdirSync(dir);
        if (fs.existsSync(dir)) throw { code: 'EAGAIN' };
        break;
      } catch (er) {
        // In addition to error codes, also check if the directory still exists and loop again if true
        if (process.platform === 'win32' && (er.code === 'ENOTEMPTY' || er.code === 'EBUSY' || er.code === 'EPERM' || er.code === 'EAGAIN')) {
          if (Date.now() - start > 1000) throw er;
        } else if (er.code === 'ENOENT') {
          // Directory did not exist, deletion was successful
          break;
        } else {
          throw er;
        }
      }
    }
  

  return result;
} // rmdirSyncRecursive