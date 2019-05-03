export default {
  Query: {
    apiConfig: async () => {
      return {
        version: process.env.VERSION,
        buildNumber: process.env.BUILD_NUMBER,
        environment: process.env.ENVIRONMENT,
      };
    },
  },
};
