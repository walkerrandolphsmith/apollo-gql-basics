export const batchUsers = async (keys, models) => {
  const distinctKeys = [...new Set(keys)];
  return await models.User.find({ _id: { $in: distinctKeys } });
};
