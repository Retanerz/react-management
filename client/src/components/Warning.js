import React, { Component } from 'react';
import "./styles/Warning.css";

class Warning extends Component {
  constructor(props) {
    super(props);
      this.state = {
        closing: false
      };
    }

  componentWillReceiveProps (nextProps) {
    if(this.props.visible && !nextProps.visible) {
      // visible props is changing from true -> false
      this.setState({
        closing: true
      });
    // 1 sec after
      setTimeout(
        () => {
          this.setState({
            closing: false
          });
        }, 500
      );
    }
  }

  render() {
    const { visible, message } = this.props;
    const { closing } = this.state;

    if(!visible && !closing) return null;
    return (
      <div className="Warning-wrapper">
        <div className={`Warning ${closing ? 'fadeOutDown' : 'bounceIn'} animated`}>
          {message}
        </div>
      </div>
    );
  }
}

export default Warning;