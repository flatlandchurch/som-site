const got = require('got');

const BASE_URL = 'https://api.planningcenteronline.com/people/v2';

exports.handler = async function(event, context, callback) {
  if (event.method !== 'post') {
    return callback('Method not supported');
  }

  const {
    email,
    firstName,
    lastName,
    phone
  } = JSON.parse(event.body);

  const personData = {
    data: {
      type: 'person',
      attributes: {
        first_name: firstName,
        last_name: lastName,
        primary_campus_id: '48766'
      },
    },
  };

  const emailData = {
    address: email,
    location: 'home',
    primary: true,
  };

  const phoneData = phone && {
    number: phone,
    location: 'home',
    primary: true,
  };

  const [person, err] = await got(`${BASE_URL}/people`, {
    method: 'POST',
    body: JSON.stringify(personData),
    username: process.env.PCO_USERNAME,
    password: process.env.PCO_PASSWORD,
  }).json();

  return callback(null, {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      person
    }),
  });
};
