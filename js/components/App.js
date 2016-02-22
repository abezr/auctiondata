import React from 'react';
import Relay from 'react-relay';
import LoginMutation from '../mutations/loginmutation';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Items list</h1>
        <ul>
          {this.props.user.items.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.name} (ID: {edge.node.id})</li>
          )}
        </ul>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    user: () => Relay.QL`
    fragment on Root {
      user {
        ${LoginMutation.getFragment('user')}
        name,
        id,
        sessionID
      }
    }
    `
  }
});


