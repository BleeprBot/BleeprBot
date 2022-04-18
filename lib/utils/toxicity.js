const toxicity = require('@tensorflow-models/toxicity');

const threshold = 0.5;
const toxicityResponse = async (sentences) => {
  const model = await toxicity.load(threshold);
  const predictions = await model.classify(sentences);
  const results = predictions.filter((item) => item.results[0].match === true);
  const parsedResults = results.map((item_1) => {
    return {
      label: item_1.label,
      match: item_1.results[0].match
    };
  });
  return parsedResults;
};

module.exports = { toxicityResponse };
