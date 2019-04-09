import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import City from "../../assets/city.json";

const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : City.filter(item => item.fullName.toLowerCase().slice(0, inputLength) === inputValue);
};

const getSuggestionValue = suggestion => suggestion.fullName;

const renderSuggestion = suggestion => <div>{suggestion.fullName}</div>;

export default class autoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      suggestions: []
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== "" && this.props.value !== prevProps.value) this.setState({ value: this.props.value });
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
    this.props.onSelectCity(newValue);
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "استان و شهرستان",
      value,
      onChange: this.onChange
    };
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        className="custome-auto-input"
      />
    );
  }
}
