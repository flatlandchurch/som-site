const got = require('got');
const catchify = require('catchify');
const { get } = require('dot-prop');

const BASE_URL = 'https://api.planningcenteronline.com/people/v2';
const BASE_OPTS = {
  username: process.env.PCO_USERNAME,
  password: process.env.PCO_PASSWORD,
  method: 'POST',
};

exports.handler = async function(event, context, callback) {
  if (event.httpMethod !== 'POST') {
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

  const [err, person] = await catchify(got(`${BASE_URL}/people`, {
    body: JSON.stringify(personData),
    ...BASE_OPTS,
  }).json());

  if (err) {
    console.log(err);
  }

  const personId = get(person, 'data.id');

  const [emailErr] = await catchify(got(`${BASE_URL}/people/${personId}/emails`, {
    body: JSON.stringify(emailData),
    ...BASE_OPTS,
  }).json());

  if (emailErr) {
    console.log(emailErr);
  }

  const [phoneErr] = await catchify(got(`${BASE_URL}/people/${personId}/phone_numbers`, {
    body: JSON.stringify(phoneData),
    ...BASE_OPTS,
  }).json());

  if (phoneErr) {
    console.log(phoneErr);
  }

  // Do workflow work

  return callback(null, {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      person
    }),
  });
};
