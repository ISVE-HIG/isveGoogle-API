const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'isve-google-api',
  location: 'europe-west1'
};
exports.connectorConfig = connectorConfig;

