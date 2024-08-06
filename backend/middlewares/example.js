const example = (socket,next)=>{
    console.log(socket);
    if(socket[0]!== "message"){
      next(new Error("socket middleware error"))
    }else{
      next()
    }
  }
  
  module.exports = example;