const got = require('got');
const catchify = require('catchify');
const { get } = require('dot-prop');

const BASE_URL = 'https://api.planningcenteronline.com/people/v2';
const BASE_OPTS = {
  username: process.env.PCO_USERNAME,
  password: process.env.PCO_PASSWORD,
  method: 'POST',
};

module.exports = async ({ lastName, firstName, email, phone }) => {
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
    data: {
      type: 'Email',
      attributes: {
        address: email,
        location: 'home',
        primary: true,
      }
    }
  };

  const phoneData = phone && {
    data: {
      type: 'PhoneNumber',
      attributes: {
        number: phone,
        location: 'home',
        primary: true,
      },
    },
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

  if (phoneData) {
    const [phoneErr] = await catchify(got(`${BASE_URL}/people/${personId}/phone_numbers`, {
      body: JSON.stringify(phoneData),
      ...BASE_OPTS,
    }).json());

    if (phoneErr) {
      console.log(phoneErr);
    }
  }

  return personId;
};
