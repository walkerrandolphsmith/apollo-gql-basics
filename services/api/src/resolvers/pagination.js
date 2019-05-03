export const cursorPagination = async (_, { cursor, limit = 100 }, Model) => {
  const results = await Model.find({}, {}, { skip: cursor, limit });

  const hasNextPage = false;
  const edges = results;

  return {
    edges,
    pageInfo: {
      hasNextPage: hasNextPage,
      endCursor: null,
    },
  };
};
