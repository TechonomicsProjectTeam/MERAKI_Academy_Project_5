const auth = (socket,next)=>{
    const headers = socket.handshake.headers
    if(!headers.token){
        next(new Error("Invalid"));
    }else{
        socket.join("room-"+ headers.shop_id)
        socket.shop = {token:headers.token,shop_id:headers.shop_id}
        next();
    }
}

module.exports = auth