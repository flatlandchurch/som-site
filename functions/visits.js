const got = require('got');

exports.handler = async function(event, context, callback) {
  if (event.method !== 'POST') {
    return callback('Method not supported');
  }

  const {
    email,
    firstName,
    lastName,
    phone
  } = JSON.parse(event.body);

  return callback(null, {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({

    }),
  });
};
