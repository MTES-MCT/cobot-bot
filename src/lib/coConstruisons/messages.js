const mustache = (string, vars) => {
  let message = string.text[0].text;
  Object.keys(vars).forEach((key) => {
    const regExp = new RegExp(`{{${key}}}`, 'g');
    message = message.replace(regExp, vars[key]);
  });
  return message;
};

class Messages {
  constructor(client, token) {
    this.client = client;
    this.client.options.headers.authorization = token;
  }

  async fetch(name, vars) {
    const query = `query getMessage($name: String!) {
      Message(name: $name) {
        id
        text{
          text
          counter
        }
        attachments{
          id
          callback
          color
          image
          text {
            text
            counter
          }
          actions {
            name
            text
            type
            value
          }
        }
      }
    }`;
    try {
      const response = await this.client.request(query, { name });
      if (vars) {
        response.Message.text[0].text = mustache(response.Message, vars);
      }
      return response.Message;
    } catch (error) {
      if (error.response && error.response.errors) {
        throw new Error(JSON.stringify(error.response.errors[0]));
      } else {
        throw new Error(JSON.stringify(error));
      }
    }
  }
}

module.exports = Messages;
