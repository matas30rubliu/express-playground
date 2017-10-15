import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// Hook Header component to redux store and get auth piece of state from authReducer to decide what to show
class Header extends Component {
  renderGoogleAuthInfo() {
    switch(this.props.auth) {
      case null:
      // show nothing when system does not know if user is logged in or not
      // can be tested using browser throtlling
        return;
      case false:
        return <li><a href="/auth/google" className='btn waves-effect waves-light pink'>Google Login</a></li>;
      default:
        return (
          <div>
            <li><a>{this.props.auth.message}</a></li>
            <li><a href="/api/logout">Logout</a></li>
          </div>
        );
    }
  }

  render() {
    return (
      <nav className="permatoma">
        <div>
          <Link to={this.props.auth ? '/userHome' : '/public'} className="brand-logo black-text hide-on-med-and-down">paVezu.lt</Link>
          <ul className="right hide-on-med-and-down">
            {this.renderGoogleAuthInfo()}
          </ul>
        </div>
      </nav>
    );
  }
}

// gets called with entire state from redux store
function mapStateToProps(state) {
// return auth from state ../reducers/index
  return { auth: state.auth };
}
// using ES6
// function mapStateToProps({auth}) {
//   return { auth };
// }

export default connect(mapStateToProps)(Header);
