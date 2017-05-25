function logErrors (err, req, res, next) {
  // console.error(err.stack)
  next(err)
}

function handleMongoErrors (err, req, res, next) {
  const errors = {};

  if (err.name === 'UnknownEntityError') {
    return res.status(404).json({
      name: err.name,
      message: err.message
    });
  }

  if (err.name === 'ValidationError') {

    for (field in err.errors) {
      errors[field] = err.errors[field].message;
    }

    return res.status(400).json({
      name: err.name,
      message: err.message,
      errors: errors
    });
  }

  // if the error was not in the above handled errors,
  // we pass it through to the almighty eror fallback
  next(err)
}

function finalErrorHandler (err, req, res, next) {
  res.status(500)
  res.json({ message: "something failed" });
}

module.exports = {
  logErrors: logErrors,
  handleMongoErrors: handleMongoErrors,
  finalErrorHandler: finalErrorHandler
}