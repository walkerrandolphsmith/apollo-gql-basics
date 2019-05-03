import React from 'react';
import { Mutation } from 'react-apollo';

import mutation from './UploadAvatar.mutation';
import UploadAvatar from './UploadAvatar.component';
import Loading from './UploadAvatar.loading';
import Error from './UploadAvatar.error';

export default () => (
  <Mutation mutation={mutation}>
    {(mutate, { loading, error }) => {
      const handleChange = ({
        target: {
          validity,
          files: [file],
        },
      }) => {
        if (validity.valid) {
          mutate({ variables: { file } });
        }
      };
      if (loading) return <Loading />;
      if (error) return <Error error={error} />;
      return <UploadAvatar handleChange={handleChange} />;
    }}
  </Mutation>
);
