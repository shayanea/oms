import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/requestConfig";

import { Form, Button, Notify } from "zent";
import Logo from "../../assets/images/logo.svg";

const { FormInputField, createForm } = Form;

class ForgotPassword extends Component {
  state = {
    isLoading: false,
    accountId: null,
    token: null
  };

  componentDidMount() {
    const token = this.props.location.search.match(/token=([^&]*)/);
    const accountId = this.props.location.search.match(/accountId=([^&]*)/);
    if (token === null || (token[1] === "" && accountId === null && accountId[1] === "")) return this.props.history.push("/login");
    this.setState({
      token: token[1],
      accountId: accountId[1]
    });
  }

  submit = data => {
    this.setState({ isLoading: true });
    axios
      .put(`/accounts/${this.state.accountId}/resetpassword`, { accountId: this.state.accountId, token: this.state.token, newPassword: data.password })
      .then(res => {
        Notify.success("رمز عبور شما با موفقیت به روز رسانی گردید.", 5000);
        this.props.history.push("/login");
      })
      .catch(err => {
        this.setState({ isLoading: false });
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  render() {
    const { handleSubmit } = this.props;
    const { isLoading } = this.state;
    return (
      <div className="login-container">
        <img className="logo" src={Logo} alt="OMS" />
        <div className="login-form">
          <Form disableEnterSubmit={false} vertical onSubmit={handleSubmit(this.submit)}>
            <FormInputField
              name="password"
              type="password"
              label="کلمه عبور جدید"
              required
              validateOnChange={false}
              validateOnBlur={false}
              validations={{
                required: true,
                minLength: 6
              }}
              validationErrors={{
                minLength: " کلمه عبور حداقل ۶ کاراکتر است.",
                required: "کلمه عبور خود را وارد نمایید."
              }}
            />
            <FormInputField
              name="confirmPw"
              type="password"
              label="تایید کلمه عبور جدید"
              required
              validateOnChange={false}
              validateOnBlur={false}
              validations={{
                equalsField: "password",
                minLength: 6
              }}
              validationErrors={{
                equalsField: "کلمه عبور وارد شده با کلمه عبور جدید شما همخوانی ندارد.",
                minLength: " کلمه عبور حداقل ۶ کاراکتر است."
              }}
            />
            <Button htmlType="submit" className="submit-btn" type="primary" size="large" loading={isLoading}>
              تایید
            </Button>
          </Form>
        </div>
        <div className="forgot-password__btn">
          <div style={{ display: "inline-block" }}>
            <Link className="send-link" to="/login">
              ورود به حساب کاربری
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const WrappedForm = createForm()(ForgotPassword);

export default WrappedForm;
