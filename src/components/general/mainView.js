import React, { Component } from "react";
import { withRouter } from "react-router";

import Menu from "./menu";
import Navbar from "./navbar";

class MainView extends Component {
  state = {
    toggle: false
  };

  toggleMenu = () => this.setState({ toggle: !this.state.toggle });

  render() {
    const { location } = this.props;
    const { toggle } = this.state;
    return (
      <React.Fragment>
        <Navbar history={location} onToggleMenu={this.toggleMenu} />
        <Menu history={location} toggle={toggle} onClose={() => toggle && this.setState({ toggle: false })} />
      </React.Fragment>
    );
  }
}

export default withRouter(MainView);
