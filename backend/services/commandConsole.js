const responses = {};

function getKey(ip, computerName) {
  return `${ip || 'unknown'}_${computerName || 'unknown'}`;
}

function addResponse(ip, computerName, output) {
  const key = getKey(ip, computerName);
  if (!responses[key]) responses[key] = [];
  responses[key].push({ output, timestamp: Date.now() });
}

function getResponses(ip, computerName) {
  return responses[getKey(ip, computerName)] || [];
}

module.exports = {
  addResponse,
  getResponses,
};
