import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Row, Col, Card, Input, Icon, Button } from 'react-materialize';

class PassengerLookup extends React.Component {
  constructor(props) {
      super(props);
      this.updateFrom = this.updateFrom.bind(this);
      this.updateTo = this.updateTo.bind(this);
      this.submitRoute = this.submitRoute.bind(this);
      this.state = {
          from: ''
      };
  }

  updateFrom(e) {
    const fromVal = e.target.value;
    this.setState(() => {
      return { from: fromVal };
    });
  }

  updateTo(e) {
    const toVal = e.target.value;
    this.setState(() => {
      return { to: toVal };
    });
  }

  submitRoute() {
    this.props.submitRoute(this.state);
  }

  render() {
    return (
      <div className='container'>
          <Row>
            <Col m={4} className='right' >
              <Card className='card medium foniukas' title='Rask pakeleivį' >
                <Row>
                  <Input m={12} label="Važiuosiu iš miesto" onChange={this.updateFrom}><Icon>add_location</Icon></Input>
                  <Input m={12} label="Važiuosiu į miestą" onChange={this.updateTo}><Icon>flag</Icon></Input>
                  <Input m={12} name='on' type='date' onChange={function(e, value) {}}><Icon>date_range</Icon></Input>
                </Row>
                <div className="card-action right-align">
                    <Button waves='purple' onClick={this.submitRoute}>Vežti<Icon left>add</Icon></Button>
                </div>
              </Card>
            </Col>
          </Row>
      </div>
    );
  }
}

export default connect(null, actions)(PassengerLookup);
