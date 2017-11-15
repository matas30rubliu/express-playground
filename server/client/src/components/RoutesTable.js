import React from 'react';
import { Table } from 'react-materialize';
import { connect } from 'react-redux';
import * as actions from '../actions';

class RoutesTable extends React.Component {
  componentDidMount() {
    this.props.fetchRoutes();
    this.props.socket.on('newRoute', newRoute => {
      this.props.routes.unshift(newRoute);
      this.setState(this.state);
    });
  }

  generateRows() {
    return this.props.routes.map(r => {
      return(
        <tr>
          <td>{r.userID}</td>
          <td>{r.from}</td>
          <td>{r.to}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div>
        <Table>
        	<thead>
        		<tr>
        			<th >Vartotojas</th>
        			<th >Keliauja iš</th>
        			<th >Keliauja į</th>
        		</tr>
        	</thead>

        	<tbody>
            {this.generateRows()}
        	</tbody>
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { routes: state.routes };
}

export default connect(mapStateToProps, actions)(RoutesTable);
