module.exports.create = function(dbs,collection, itemorlist, extra_options={}) {
    return createfn(dbs, collection, itemorlist, extra_options);
}

// when string is given criteria transforms to {_id:new ObjectId()}
module.exports.read = function(dbs, collection, criteria={}, justOne=false, extra_options={}) {
    return readfn(dbs, collection,criteria, justOne, extra_options);
}

module.exports.update = function(dbs, collection, criteria={}, itemorlist, justOne=false, extra_options={}) {
    return updatefn(dbs, collection,criteria, itemorlist, justOne, extra_options);
}

module.exports.delete = function(dbs, collection, criteria={}, justOne=false) {
    return deletefn(dbs, collection,criteria, justOne);
}

// returns dbs (client.db())
module.exports.connect = function(dbname) {
    return connectfn(dbname);
}

// returns both dbs and client {"dbs":..,"client":""} in case you need to close the connection using client.close()
module.exports.connectWithClient = function(dbname) {
    return connectwithclientfn(dbname);
}

// Returns items that have keyword in collection.searchField 

module.exports.search = function(dbs,collection,searchField, keyword, additional_criteria={}) {
    return searchfn(dbs,collection,searchField, keyword, additional_criteria);
}



function createfn(dbs,collection,itemOrList,extra_options={}){
 	if(isList(itemOrList)) {
      	return createMany(dbs, collection, itemOrList, extra_options);
    } else {
     	return createOne(dbs,collection,itemOrList, extra_options); 
    }
}

// returns _id as String of the created object
function createMany(dbs, collection, list, extra_options) {
  		const datalist = list.map((data) => {
            // prevent an insertion to mess up your _id order. Can be overwritten using extra_options["allow_id"] = 1 
            if(data._id && !extra_options["allow_id"]) {
                delete data._id;
            }

            const date = +new Date();
            data.date = date;
            data.last_updated = date;
		})

        return new Promise((resolve, reject) => {
          dbs.collection(collection).insertMany(datalist, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    try {
                        const lastId = String(result.insertedId);
                        resolve(lastId);
                    } catch(err2) {
                        reject(err2);
                    }
               }
          });
      });
}

// returns _id as String of the created object
function createOne(dbs, collection, data, extra_options) {
  		// prevent an insertion to mess up your _id order. Can be overwritten using extra_options["allow_id"] = 1 
        if(data._id && !extra_options["allow_id"]) {
            delete data._id;
        }

        const date = +new Date();
        data.date = date;
        data.last_updated = date;
        return new Promise((resolve, reject) => {
          dbs.collection(collection).insertOne(data, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    try {
                        const lastId = String(result.insertedId);
                        resolve(lastId);
                    } catch(err2) {
                        reject(err2);
                    }
               }
          });
      });
}




async function readfn(dbs, collection,criteria={}, justOne=false, extra_options={}) { 
  	// transforms String and _id:String keys to _id:ObjectId
    const t1_criteria = transformCriteria(criteria);
  	if(justOne) {
       return findOne(dbs, collection, t1_criteria, extra_options);
     } else {
        return readmanyfn(dbs,collection,t1_criteria,extra_options);		
     }
}

async function readmanyfn(dbs,collection,criteria,extra_options={}) {
       return new Promise(function(resolve, reject) { 
         	dbs.collection(collection).find(criteria).toArray(function(err, result) {
            if (err) {
                return reject(err);
            } else {
                return resolve(result);
            }
        });
	});  
}


function findOne(dbs, collection, criteria, extra_options={}) {
      return new Promise((resolve, reject) => {
          dbs.collection(collection).findOne(criteria, function(err, result) {
              if (err) {
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });
}
function updatefn(dbs, collection, criteria, data, justOne=false, extra_options) {
	// transforms String and _id:String keys to _id:ObjectId
    const t1_criteria = transformCriteria(criteria);

    // by default updates last_updated value
  	if(!(extra_options['no_date'])) {
    	data.last_updated = +new Date();
    }
  
    const updateDoc = { $set: data };
	if(justOne) {
      	return updateonefn(dbs, collection, t1_criteria, updateDoc);
    } else {
     	return updatemanyfn(dbs, collection, t1_criteria, updateDoc); 
    }
}

// also updated last_updated value if extra_options['no_date']=1
function updatemanyfn(dbs, collection, t1_criteria, updateDoc) {
    return dbs.collection(collection).updateMany(t1_criteria, updateDoc);
}

// also updated last_updated value if extra_options['no_date']=1
function updateonefn(dbs, collection, t1_criteria, updateDoc) {
    return dbs.collection(collection).updateOne(t1_criteria, updateDoc);
}
function deletefn(dbs,collection,criteria,justOne=false) {
  	if(justOne) {
      	return deleteonefn(dbs, collection, criteria);
    } else {
     	return deletemanyfn(dbs,collection, criteria); 
    }
}

function deletemanyfn(dbs,collection,criteria) {
  	// transforms String and _id:String keys to _id:ObjectId
    const t1_criteria = transformCriteria(criteria);
    return new Promise((resolve, reject) => {
        dbs.collection(collection).deleteMany(t1_criteria, function(err, result) {
           if (err) {
                 reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function deleteonefn(dbs,collection,criteria) {
  // transforms String and _id:String keys to _id:ObjectId
    const t1_criteria = transformCriteria(criteria);
    return new Promise((resolve, reject) => {
        dbs.collection(collection).deleteMany(t1_criteria, function(err, result) {
           if (err) {
                 reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;

function connectfn(dbname, dburl = "mongodb://localhost:27017") {
      return new Promise((resolve, reject) => {
         MongoClient.connect(dburl + "/" + dbname, { useNewUrlParser: true, useUnifiedTopology: true }).then((client)=>{
            resolve(client.db())
         }).catch((err)=>{
            reject(err);
         });
      });
}

function connectwithclientfn(dbname, dburl = "mongodb://localhost:27017") {
 return new Promise((resolve, reject) => {
      MongoClient.connect(dburl + "/" + dbname, { useNewUrlParser: true, useUnifiedTopology: true }).then((client)=>{
              resolve({"dbs":client.db(),"client":client})
      }).catch((err)=>{
              reject(err);
      });
    });
}
// transforms String and _id keys to {"_id":ObjectId(_id)} 
function transformCriteria(criteria){
  	const t1 = transformStringCriteria(criteria);
  	const t2 = transformIdKeysCriteria(t1);
	return t2;
}

// transforms String to {"_id":String}
function transformStringCriteria(criteria) {
	if(!isObject(criteria)) {
      return {"_id":criteria};
    } else {
      return criteria;
    }
}

// for transforming _id key that are String to ObjectId(_id)
function transformIdKeysCriteria(criteria) {
        const editCriteria = {};
        let keys = Object.keys(criteria);
        for(let i=0; i < keys.length; i++) {
            let k = keys[i];
            let v = criteria[k];
            if(k === '_id' && !(v instanceof Object)){
                editCriteria['_id'] = new ObjectId(v);
            } else {
                editCriteria[k] = v;
            }
        }

        return editCriteria;
}
// basic isList and isObject distinction
function isList(obj) {
    return Array.isArray(obj) && obj.length !== 0;
}
function isObject(obj) {
    return obj.constructor == Object;
}
// from https://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
function escapeRegexfn(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// Returns items that have keyword in collection.searchField 
function searchfn(dbs,collection,searchField, keyword, additional_criteria={}) {
        const t1_criteria = transformCriteria(additional_criteria);
        t1_criteria[searchField] = new RegExp(escapeRegexfn(keyword),'gi');
       return new Promise(function(resolve, reject) { 
        dbs.collection(collection).find(t1_criteria).toArray(function(err, result) {
            if (err) {
                return reject(err);
            } else {
                return resolve(result);
            }
        });

        
             }); 
}