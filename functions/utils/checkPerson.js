const got = require('got');
const catchify = require('catchify');
const { get } = require('dot-prop');

const BASE_URL = 'https://api.planningcenteronline.com/people/v2';
const BASE_OPTS = {
  username: process.env.PCO_USERNAME,
  password: process.env.PCO_PASSWORD,
  method: 'POST',
};

const kindaLike = (a, b) => {
  const c = a.toLowerCase();
  const d = b.toLowerCase();
  if (c === d) return true;
  return c.includes(d) || d.includes(c);
};

module.exports = async (firstName, lastName, email) => {
  const [err, people] = await catchify(got(`${BASE_URL}/people?where[search_name_or_email]=${email}`, {
    ...BASE_OPTS,
    method: 'GET',
  }).json());

  if (err) return null;

  return people.data.find(({ attributes }) => {
    if (attributes.last_name.toLowerCase() === lastName.toLowerCase()) {
      return kindaLike(firstName, attributes.first_name);
    }
    return false;
  });
};
