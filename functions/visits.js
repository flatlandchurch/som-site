const createPerson = require('./utils/createPerson');
const checkPerson = require('./utils/checkPerson');

exports.handler = async function(event, context, callback) {
  if (event.httpMethod !== 'POST') {
    return callback('Method not supported');
  }

  // TODO: check if this person exists first, only create if they don't

  const {
    email,
    firstName,
    lastName,
    phone
  } = JSON.parse(event.body);

  const person = await checkPerson(firstName, lastName, email);
  console.log(person)

  // const personId = await createPerson({
  //   email,
  //   firstName,
  //   lastName,
  //   phone
  // });

  const workflowData = {
    data: {
      attributes: {
        person_id: personId,
      }
    }
  };

  // Do workflow work

  return callback(null, {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      person
    }),
  });
};
