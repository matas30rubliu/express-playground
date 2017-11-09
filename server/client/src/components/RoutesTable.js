import React from 'react';
import { Table } from 'react-materialize';
import { connect } from 'react-redux';
import * as actions from '../actions';

class RoutesTable extends React.Component {
  componentDidMount() {
    this.props.fetchRoutes();
  }

  generateRows() {
    return this.props.routes.reverse().map(r => {
      return(
        <tr>
          <td>{r.userID}</td>
          <td>{r.from}</td>
          <td>{r.to}</td>
        </tr>
      );
    });
    return '';
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
