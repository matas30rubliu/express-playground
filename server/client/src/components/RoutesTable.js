import React from 'react';
import { Table } from 'react-materialize';

class RoutesTable extends React.Component {
  generateRows() {
    var entries = [];
    for (var i = 0; i < 15; i++) {
      entries.push(
        <tr>
          <td>Matas</td>
          <td>Klaipeda</td>
          <td>Vilnius</td>
        </tr>
      );
    }
    return entries;
  }
  render() {
    return (
      <div>
        <Table>
        	<thead>
        		<tr>
        			<th >Kas</th>
        			<th >Iš</th>
        			<th >Į</th>
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

export default RoutesTable;
