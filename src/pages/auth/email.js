import React, { Component } from "react";
import { Loading } from "zent";
import PropTypes from "prop-types";
import axios from "../../utils/requestConfig";
import Logo from "../../assets/images/logo.svg";

class VerifyEmail extends Component {
	state = {
		message: "",
		isLoading: true
	};

	static propTypes = {
		login: PropTypes.shape({
			error: PropTypes.string.isRequired,
			isLoading: PropTypes.bool.isRequired
		})
	};

	componentDidMount() {
		const id = this.props.location.search.match(/accountId=([^&]*)/);
		const token = this.props.location.search.match(/token=([^&]*)/);
		id !== null && token !== null
			? this.verifyEmailAddress(id[1], token[1])
			: this.props.history.push("/login");
	}

	verifyEmailAddress = (accountId, token) => {
		axios
			.put(`/accounts/${accountId}/emailverification`, { token: token })
			.then(res =>
				this.setState({
					isLoading: false,
					message: "اکانت شما با موفقیت فعال گردید."
				})
			)
			.catch(err =>
				this.setState({
					isLoading: false,
					message: err.data.error.errorDescription
				})
			);
	};

	render() {
		const { isLoading, message } = this.state;
		return (
			<div className="verify-container">
				<div className="container">
					{!isLoading && (
						<React.Fragment>
							<img className="logo" src={Logo} alt="OMS" />
							<p>{message}</p>
						</React.Fragment>
					)}
					{isLoading && <Loading show />}
				</div>
			</div>
		);
	}
}

export default VerifyEmail;
