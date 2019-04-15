import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../actions/authAction";

import { Form, Button } from "zent";
import Logo from "../../assets/images/logo.svg";

const { FormInputField, createForm } = Form;

class Login extends Component {
  static propTypes = {
    login: PropTypes.shape({
      error: PropTypes.string.isRequired,
      isLoading: PropTypes.bool.isRequired
    })
  };

  submit = data => {
    this.props.loginUser({
      email: data.email,
      password: data.password
    });
  };

  render() {
    const { handleSubmit } = this.props;
    const { isLoading } = this.props.auth;
    return (
      <div className="login-container">
        <img className="logo" src={Logo} alt="OMS" />
        <div className="login-form">
          <Form disableEnterSubmit={false} vertical onSubmit={handleSubmit(this.submit)}>
            <FormInputField
              name="email"
              type="email"
              label="ایمیل"
              validateOnChange={false}
              validateOnBlur={false}
              validations={{
                required: true,
                isEmail: true
              }}
              validationErrors={{
                required: " ایمیل اجباری است.",
                isEmail: "فرمت ایمیل وارد شده اشتباه است."
              }}
            />
            <FormInputField
              name="password"
              type="password"
              label="کلمه‌ی عبور"
              validateOnChange={false}
              validateOnBlur={false}
              validations={{
                required: true
              }}
              validationErrors={{
                required: " کلمه عبور اجباری است."
              }}
            />
            <Button htmlType="submit" className="submit-btn" type="primary" size="large" loading={isLoading}>
              ورود
            </Button>
          </Form>
        </div>
        <div className="forgot-password__btn">
          اگر کلمه‌ی عبور‌ خود را فراموش کرده‌اید،
          <div style={{ display: "inline-block", marginRight: 5 }}>
            <Link className="send-link" to="/forgotpassword">
              اینجا را کلیک کنید
            </Link>
            .
          </div>
        </div>
      </div>
    );
  }
}

const WrappedForm = createForm()(Login);

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { loginUser }
)(WrappedForm);
