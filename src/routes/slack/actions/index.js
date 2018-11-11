import Dataset from './dataset';
import Labelbot from './labelbot';
import Play from './play';
import Reminder from './reminder';
import Status from './status';

module.exports = (Payload, API, Slack) => ({
  dataset: new Dataset(Payload, API, Slack),
  labelbot: new Labelbot(Payload, API, Slack),
  play: new Play(Payload, API, Slack),
  reminder: new Reminder(Payload, API, Slack),
  status: new Status(Payload, API, Slack),
});
