function logActivity(event, metadata = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    ...metadata
  };
  console.log(`[LOG] ${JSON.stringify(entry)}`);
}

function logError(error, context = {}) {
  console.error(`[ERROR] ${error.message}`, context);
}

module.exports = { logActivity, logError };
