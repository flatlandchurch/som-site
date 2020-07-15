const got = require('got');
const catchify = require('catchify');
const snarkdown = require('snarkdown');

const checkPerson = require('./utils/checkPerson');
const createPerson = require('./utils/createPerson');

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
    phone,
    zipcode,
    program,
  } = JSON.parse(event.body);

  const person = await checkPerson(firstName, lastName, email);

  const personId = person && person.id ? person.id : await createPerson({
    email,
    firstName,
    lastName,
    phone,
    zipcode,
  });

  const workflowData = {
    data: {
      attributes: {
        person_id: personId,
      }
    }
  };

  const [err, workflow] = await catchify(got(`${BASE_URL}/workflows/228004/cards`, {
    ...BASE_OPTS,
    body: JSON.stringify(workflowData),
  }).json());

  if (err) {
    console.log(err);
  }

  const workflowNote = {
    data: {
      type: 'WorkflowCardNote',
      attributes: {
        note_category_id: '127515',
        note: `**Program of Interest**: ${program}`,
      },
    },
  };

  const [noteErr] = await catchify(got(`${BASE_URL}/people/${personId}/workflow_cards/${workflow.data.id}/notes`, {
    ...BASE_OPTS,
    body: JSON.stringify(workflowNote),
  }).json());

  if (noteErr) {
    console.log(noteErr);
  }

  return callback(null, {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: {
        type: 'success_message',
        attributes: {
          content: snarkdown(`### Thank you, ${firstName}!
We'll get you some more information ASAP.`),
        }
      },
    }),
  });
};
