import React, { Component } from 'react';

class Alert extends Component {
  constructor(props) {
    super(props);
    this.color = null;
    this.bgColor = null;
  }

  getStyle = () => {
    return {
      color: this.color,
      backgroundColor: this.bgColor,
      border: `2px solid ${this.color}`,
      fontSize: '12px',
      margin: '10px 0',
      padding: '10px',
      borderRadius: '7px',
      textAlign: 'center'
    };
  };

  render() {
    return (
      <div className="Alert">
        <p style={this.getStyle()}>{this.props.text}</p>
      </div>
    );
  }
}

class InfoAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = 'rgb(0, 0, 255)'; // blue
    this.bgColor = 'rgb(220, 220, 255)'; // light blue
  }
}

class ErrorAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = 'rgb(255, 0, 0)'; // red
    this.bgColor = 'rgb(255, 220, 220)'; // light red
  }
}

class WarningAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = 'rgb(255, 165, 0)'; // orange
    this.bgColor = 'rgb(255, 235, 205)'; // light orange
  }
}

export { InfoAlert, ErrorAlert, WarningAlert };
