const toxicity = require('@tensorflow-models/toxicity');

const threshold = 0.5;
const toxicityResponse = (sentences) => {
  return toxicity.load(threshold).then((model) => {
    return model.classify(sentences).then((predictions) => {
      const results = predictions.filter((item) => item.results[0].match === true);
      const parsedResults = results.map((item) => { 
        return {
          label: item.label,
          match: item.results[0].match
        };
      });
      console.log(parsedResults);
      return parsedResults;
    });
  });
};

module.exports = { toxicityResponse };
