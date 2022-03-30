const crudfs = require("./crud-fs")
const crudhttp = require("./crud-http")
const crudmongo = require("./crud-mongo")

// loading all basic packages, extendable through extra
function crudfn(extra) {
  const crud = extra; // to make crud extendable
  crud["fs"] = {
  	"create": function(path,fcontent=null){ 
     	return crudfs.create(path,fcontent) 
    },
    "read": function(path){ 
     	return crudfs.read(path) 
    },
    "update": function(src,dst){ 
    	return crudfs.update(src,dst) 
    },
    "delete": function(path){ 
      	return crudfs.delete(path) 
    }
  };
  
  crud["http"] = {
  	create: function(url,data,authValue=null){ 
      return crudhttp.create(url,data,authValue) 
    },
    read: function(url,authValue=null){ 
      return crudhttp.read(url,authValue) 
    },
    update: function(url,data,authValue=null){ 
      return crudhttp.update(url,data,authValue) 
    },
    delete: function(url,authValue=null){ 
      return crudhttp.delete(url,authValue) 
    }
  };
  
  crud["mongo"] = {
    connect: function(dbname) {
      	return crudmongo.connect(dbname);
    },
    connectWithClient: function(dbname) {
      	return crudmongo.connectWithClient(dbname);
    },
  	create: function(dbs,collection, itemorlist, extra_options={}) { 
    	return crudmongo.create(dbs,collection, itemorlist, extra_options) 
  	},
    read: function(dbs, collection, criteria={}, justOne=false, extra_options={}){ 
    	return crudmongo.read(dbs, collection, criteria, justOne, extra_options) 
  	},
    update: function(dbs, collection, criteria={}, itemorlist, justOne=false, extra_options={}){ 
    	return crudmongo.update(dbs, collection, criteria, itemorlist, justOne, extra_options)
 	},
    delete: function(dbs, collection, criteria={}, justOne=false) { 
    	return crudmongo.delete(dbs, collection, criteria, justOne) 
  	}
  };
  
  return crud;
}

module.exports = function (extra={}) {
 	return crudfn(extra); 
}