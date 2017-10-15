import React from 'react';
import { Row, Col, Card, Input, Icon, Button } from 'react-materialize'

class PassengerLookup extends React.Component {
  render() {
    return (
      <div className='container'>
          <Row>
            <Col m={4} className='right' >
              <Card className='card medium foniukas' title='Rask pakeleivį' >
                <Row>
                  <Input m={12} label="Važiuosiu iš miesto"><Icon>add_location</Icon></Input>
                  <Input m={12} label="Važiuosiu į miestą"><Icon>flag</Icon></Input>
                  <Input m={12} name='on' type='date' onChange={function(e, value) {}}><Icon>date_range</Icon></Input>
                </Row>
                <div className="card-action right-align">
                    <Button waves='purple'>Vežti<Icon left>add</Icon></Button>
                </div>
              </Card>
            </Col>
          </Row>
      </div>
    );
  }
}

export default PassengerLookup;
