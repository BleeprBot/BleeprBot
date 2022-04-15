const toxicity = require('@tensorflow-models/toxicity');

const threshold = 0.5;
const toxicityResponse = (sentences) => {
  return toxicity.load(threshold).then((model) => {
    return model.classify(sentences).then((predictions) => {
      return predictions;
    });
  });
};

module.exports = { toxicityResponse };
