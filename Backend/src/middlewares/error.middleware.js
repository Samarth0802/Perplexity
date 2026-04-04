function errorMiddleware(err,req,res,next){
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"

    let stack;
    if(process.env.NODE_ENV === "development"){
        stack = err.stack
        console.error("❌ BACKEND ERROR:", err);
    }else{
        stack = null
    }

    res.status(statusCode).json({
        success:false,
        message,
        stack
    })
}

export default errorMiddleware