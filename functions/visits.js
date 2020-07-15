const got = require('got');
const catchify = require('catchify');
const snarkdown = require('snarkdown');

const BASE_URL = 'https://api.planningcenteronline.com/people/v2';
const BASE_OPTS = {
  username: process.env.PCO_USERNAME,
  password: process.env.PCO_PASSWORD,
  method: 'POST',
};

const createPerson = require('./utils/createPerson');
const checkPerson = require('./utils/checkPerson');

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

  const person = await checkPerson(firstName, lastName, email);

  const personId = person && person.id ? person.id : await createPerson({
    email,
    firstName,
    lastName,
    phone
  });

  const workflowData = {
    data: {
      attributes: {
        person_id: personId,
      }
    }
  };

  const [err] = await catchify(got(`${BASE_URL}/workflows/227583/cards`, {
    ...BASE_OPTS,
    body: JSON.stringify(workflowData),
  }).json());

  if (err) {
    console.log(err);
  }

  return callback(null, {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: {
        type: 'success_message',
        attributes: {
          content: snarkdown(`### Thank you, ${firstName}!
We'll follow up in the next few days to plan your visit with us. We can't wait to meet you.`),
        }
      },
    }),
  });
};
