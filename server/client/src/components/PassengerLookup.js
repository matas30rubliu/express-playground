import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Row, Col, Card, Input, Icon, Button, Modal } from 'react-materialize';
import GeosuggestInput from './GeosuggestInput';

class PassengerLookup extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
          from: '',
          to: ''
      };
      this.submitRoute = this.submitRoute.bind(this);
  }

  submitRoute() {
    if (!this.props.auth) {
      ReactDOM.findDOMNode(this.triggerBtn).click();
      return;
    }
    this.props.submitRoute(this.state);
    this.props.socket.emit('newRoute', {...this.state, userID: this.props.auth.id} );
  }

  render() {
    return (
      <div className='container'>
          <Row>
            <Col m={4} className='right' >
              <Card className='card medium foniukas' title='Rask pakeleivį' >
                <Row>
                  <GeosuggestInput title="Važiuosiu iš miesto" icon="add_location" onChange={(from) => this.setState(() => ({ from }))} />
                  <GeosuggestInput title="Važiuosiu į miestą" icon="flag" onChange={(to) => this.setState(() => ({ to }))} />
                  <Input m={12} name='on' type='date' onChange={function(e, value) {}}><Icon>date_range</Icon></Input>
                </Row>
                <div className="card-action right-align">
                    <Button waves='purple' onClick={this.submitRoute}>Vežti<Icon left>add</Icon></Button>
                </div>
              </Card>
            </Col>
          </Row>
          <Modal
            header='Prisijunkite'
            trigger={<Button ref={input => this.triggerBtn = input} className='hide'/>}>
            Norėdami įvesti naują maršrutą turite prisijungti!
          </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps, actions)(PassengerLookup);
