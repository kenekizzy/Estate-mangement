export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500
    const message = err.message ? err.message : 'Internal Server Error'
    switch (statusCode) {
        case 400:
            res.json({title: "Validation Error", message, stackTrace: err.stack})
            break;
        case 401:
            res.json({title: "Unauthorized", message, stackTrace: err.stack})
            break;
        case 403:
            res.json({title: "Forbidden", message, stackTrace: err.stack})
            break;
        case 404:
            res.json({title: "Not Found", message, stackTrace: err.stack})
            break;
        case 500:
            res.json({title: "Server Error", message, stackTrace: err.stack})
            break;
        default:
            console.log("An unexpected error occured")
            break;
    }
}