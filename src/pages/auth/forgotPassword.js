import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/requestConfig";

import { Form, Button, Notify } from "zent";
import Logo from "../../assets/images/logo.svg";

const { FormInputField, createForm } = Form;

class ForgotPassword extends Component {
  state = {
    isLoading: false
  };

  submit = data => {
    this.setState({ isLoading: true });
    axios
      .post(`/accounts/resetpasswordrequests`, { email: data.email })
      .then(res => {
        Notify.success("ایمیل با موفقیت برای شما ارسال گردید.", 5000);
        this.setState({ isLoading: false });
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
            <Button htmlType="submit" className="submit-btn" type="primary" size="large" loading={isLoading}>
              ارسال
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
