exports.errorHandler = (err, req, res, next) => {
 console.error(err.stack);
 
 if (err.name === 'ValidationError') {
   return res.status(400).json({ 
     error: 'Validation Error',
     details: err.message 
   });
 }

 if (err.name === 'CastError') {
   return res.status(400).json({ 
     error: 'Invalid ID format' 
   });
 }

 if (err.code === 11000) {
   return res.status(400).json({ 
     error: 'Duplicate key error',
     field: Object.keys(err.keyPattern)[0] 
   });
 }

 res.status(500).json({ 
   error: 'Internal Server Error',
   message: err.message 
 });
};

exports.notFound = (req, res) => {
 res.status(404).json({ error: 'Endpoint not found' });
};