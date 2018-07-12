import Dataset from './dataset';
import Play from './play';
import Reminder from './reminder';
import Status from './status';

module.exports = (Payload, API, Slack) => ({
  dataset: new Dataset(Payload, API, Slack),
  play: new Play(Payload, API, Slack),
  reminder: new Reminder(Payload, API, Slack),
  status: new Status(Payload, API, Slack),
});
