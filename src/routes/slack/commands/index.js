import OnBoarding from './onboarding';
import Play from './play';

module.exports = (API, Slack, Logger) => ({
  play: new Play(API, Slack, Logger),
  onboarding: new OnBoarding(API, Slack, Logger),
});
