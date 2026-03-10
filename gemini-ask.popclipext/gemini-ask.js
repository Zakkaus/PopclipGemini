const { callGemini } = require("./gemini-auth");

exports.actions = [
  {
    title: "Gemini Ask",
    icon: "iconify:ri:gemini-fill",
    code: async (input, options) => {
      const model = (options.customModel && options.customModel.trim()) || options.model;
      const prompt = options.sysprompt
        ? `${options.sysprompt}\n\n${input.text}`
        : input.text;
      const result = await callGemini(prompt, options.config, model, options.location, options.backend);
      if (options.replace) {
        popclip.pasteText(result);
      } else {
        popclip.showText(result);
      }
    },
  },
];
