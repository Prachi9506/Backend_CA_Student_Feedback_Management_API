// 404 for unknown routes
exports.notFound = (req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
};

// Central error handler
exports.errorHandler = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, error: "Invalid JSON body" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ success: false, error: err.message });
  }
  console.error(err);
  res.status(500).json({ success: false, error: "Internal server error" });
};
