//
module.exports.create = async function(url,data,authValue=null) {
  return createfn(url,data,authValue);
}
module.exports.read = async function(url,authValue=null) {
  	return readfn(url,authValue);
}
module.exports.update = async function(url,data,authValue=null) {
  	return updatefn(url,data,authValue);
}
module.exports.delete = async function(url,authValue=null) {
	return deletefn(url,authValue);
}

  
async function createfn(url,data,authValue=null) {
  let o = '';
  try { 
    if(authValue!==null) {
           o = await postWithAuth(url,data,authValue);
    } else {
          o = await post(url,data);
    }
  } catch(err) {
    if(String(err).includes("REFUSED")) {
       o = resultToStrOrJsonError({status:404,data:String(err)})
     } else {
      	throw err; 
     }
  }
  
  return o;
}


// simple POST request 
async function post(url,obj) {
    let r = await instance.post(url,obj);
  	return resultToStrOrJsonError(r);
}

// simple POST request with Authorization header
async function postWithAuth(url,obj,authValue) {
    const config = { headers: {"Authorization":authValue}};
    let r = await instance.post(url,obj,config);
  	return resultToStrOrJsonError(r);
}





async function readfn(url,authValue=null) {
  let o = '';
  try { 
    if(authValue!==null) {
           o = await getWithAuth(url,authValue);
    } else {
          o = await get(url);
    }
  } catch(err) {
    if(String(err).includes("REFUSED")) {
       o = resultToStrOrJsonError({status:404,data:String(err)})
     }  else {
      	throw err; 
     }
  }
  
  return o;
}

// simple GET request
async function get(url) {
    let r = await instance.get(url);
  	return resultToStrOrJsonError(r);
}

// simple GET request with Authorization header
async function getWithAuth(url,authValue) {
    const config = { headers: {"Authorization":authValue}};
    let r = await instance.get(url,config);
  	return resultToStrOrJsonError(r);
}




                   
async function updatefn(url,data,authValue=null) {
  let o = '';
  try { 
    if(authValue!==null) {
           o = await putWithAuth(url,data,authValue);
    } else {
          o = await put(url,data);
    }
  } catch(err) {
    if(String(err).includes("REFUSED")) {
       o = resultToStrOrJsonError({status:404,data:String(err)})
     }  else {
      	throw err; 
     }
  }
  
  return o;
}


// simple put request 
async function put(url,obj) {
    let r = await instance.put(url,obj);
  	return resultToStrOrJsonError(r);
}

// simple put request with Authorization header
async function putWithAuth(url,obj,authValue) {
    const config = { headers: {"Authorization":authValue}};
    let r = await instance.put(url,obj,config);
  	return resultToStrOrJsonError(r);
}





async function deletefn(url,authValue=null) {
  let o = '';
  try { 
    if(authValue!==null) {
           o = await deleteWithAuth(url,authValue);
    } else {
          o = await deletesinglefn(url);
    }
  } catch(err) {
    if(String(err).includes("REFUSED")) {
       o = resultToStrOrJsonError({status:404,data:String(err)})
     }  else {
      	throw err; 
     }
  }
  
  return o;
}

// simple delete request
async function deletesinglefn(url) {
    let r = await instance.delete(url);
  	return resultToStrOrJsonError(r);
}

// simple delete request with Authorization header
async function deleteWithAuth(url,authValue) {
    const config = { headers: {"Authorization":authValue}};
    let r = await instance.delete(url,config);
  	return resultToStrOrJsonError(r);
}



//- crud-http (rename simple-request-util, extend, also files)
const axios = require('axios');

// prevent non 200-299 status codes like 404 from throwing js error
const instance = axios.create({
    validateStatus: function validateStatus(status) {
        return true;
    }
});

function resultToStrOrJsonError(r){
 if(r.status < 200 || r.status > 299) {
     	return {"status":r.status,"error":r.data} 
    } else {
    	return r.data;
    } 
}