/**
 * @flow
 */
import Relay from 'react-relay';

export default class LoginMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        name
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{Login}`;
  }

  getVariables() {
    return {
      name: this.props.credentials.name,
      password: this.props.credentials.password,
      id: this.props.user.id
    };
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      }
    }];
  }
  getOptimisticResponse() {
    return {
      name: this.props.credentials.name,
      id: this.props.user.id
    };
  }
  getFatQuery() {
    return Relay.QL`
    fragment on LoginPayload {
      user {
        sessionID,
        name,
        items
      }
    }
    `;
  }
}
