import React, { Component } from 'react';
import { Autocomplete } from 'react-materialize';

class GeosuggestInput extends Component {

  constructor(props) {
      super(props);
      this.state = {
          locations: {},
          skipAutocomplete: false,
          skipBlur: true
      };
      this.onChange = this.onChange.bind(this);
      this.mapsPlaces = window.google.maps.places;
      this.autocompleteService = new this.mapsPlaces.AutocompleteService();
  }

  onChange(e, value) {
    this.props.onChange(value);
    if (this.state.skipAutocomplete || !value) {
      return;
    }
    this.autocompleteService.getPlacePredictions(
      {
        input: value,
        componentRestrictions: {country: 'lt'}
      },
      (predictions, status) => {
        if (status != this.mapsPlaces.PlacesServiceStatus.OK) {
          return;
        }
        let locations = {};
        console.log(predictions[0]);
        locations[predictions[0].description] = null;
        this.setState(() => {
          return { locations };
        });
      }
    );
  }

  render() {
    return (
      <div>
        <Autocomplete m={12}
          title={this.props.title}
          icon={this.props.icon}
          iconClassName='prefix'
          data={ this.state.locations }
          onChange={this.onChange}
          onAutocomplete={ () => this.state.skipAutocomplete = true }
          onFocus={() =>  this.setState( () => ({ skipAutocomplete: false, skipBlur: false}) ) }
          onMouseDown={() => this.setState( () => ({ skipBlur: true}) ) }
          onBlur={() => { if(!this.state.skipBlur) { this.setState( () => ({ locations: {} }) ); } }}
          />
      </div>
    );
  }

}

export default GeosuggestInput;
