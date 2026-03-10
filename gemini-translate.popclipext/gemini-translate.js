const { callGemini } = require("./gemini-auth");

exports.actions = [
  {
    title: "Gemini Translate",
    icon: "iconify:mdi:translate",
    after: "paste-result",
    code: async (input, options) => {
      const model = (options.customModel && options.customModel.trim()) || options.model;
      const prompt = `Translate the following text into ${options.tolang}. Keep the meaning, structure and formatting exactly the same. Only give me the translated output and nothing else:\n${input.text}`;
      return callGemini(prompt, options.config, model, options.location, options.backend);
    },
  },
];
