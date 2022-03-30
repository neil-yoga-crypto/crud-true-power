## True Power is Create, Read, Update and Delete.

### Demo: Effortlessly transition between different data interfaces
```
const crud = require("./crud-tp")(); const dbs = await crud.mongo.connect('tp-crud-testdb') // Set & setting

console.log('your files: ', crud.fs.read()) 
// ^ reads your files from the current directory on your file system

crud.fs.read().forEach((file) => {
	crud.mongo.create(dbs, "files", {"path":file}); 
  	// ^ creates item {"path":file} in your MongoDb's collection "files"
});

console.log('your files, now from MongoDb: ', 
            (await crud.mongo.read(dbs, "files"))) 
			// ^ reads your files, now from your MongoDb's collection "files"

// Yet be careful ;) ~ "With true power comes true responsibility"
console.log('your files, deleted, but fortunately just from MongoDb: ', 
            (await crud.mongo.delete(dbs, "files"))) 
			// ^ deletes all items in your MongoDb's collection "files"

// Also works for the internet on friendly receptive websites and API's
console.log((await crud.http.read("https://duckduckgo.com?search=movie-the-matrix-imdb")).substring(0, 30));
```


### Bonus Demo: Writing your own libraries
```
const mylibraries = {"ssh": {"read":function(){ return "todo" }}};
// ^ You can even extend crud with your own libraries like this

const mycrud = require("./crud-tp")(mylibraries);
// ^ And importing it like this

console.log(mycrud.ssh.read());                                  
```
