class Dataset {
  constructor(client, token) {
    this.client = client;
    this.client.options.headers.authorization = token;
  }

  async fetch(id) {
    const query = `query getDataSet($id: ID!){
      DataSet(id: $id) {
        _id
        question
        file
        availableAnswers{
          text
          order
        }
      }
    }`;
    try {
      const response = await this.client.request(query, { id });
      return response.DataSet;
    } catch (error) {
      if (error.response && error.response.errors) {
        throw new Error(JSON.stringify(error.response.errors[0]));
      } else {
        throw new Error(JSON.stringify(error));
      }
    }
  }

  async create(dataSetId, answer) {
    const data = {
      dataSetId,
      answer,
    };
    const mutation = `
      mutation create($dataSetId: ID!, $answer: String!) {
        dataSetAnswers(
          id: $dataSetId, 
          answer: $answer,
        ) {
          id
          activity {
            lastAnswersAt
            numAnswers
            slotNumAnswers
            wakeUpLogs {
              at
              channel
            }
          }
        }
      }
    `;
    try {
      const response = await this.client.request(mutation, data);
      return response.dataSetAnswers;
    } catch (error) {
      if (error.response.errors) {
        throw new Error(JSON.stringify(error.response.errors[0]));
      } else {
        throw new Error(JSON.stringify(error));
      }
    }
  }
}
module.exports = Dataset;
