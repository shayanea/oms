import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Button, Notify } from "zent";
import axios from "../../utils/requestConfig";

const { createForm, FormInputField } = Form;
const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "ویرایش کاربر" }];

class EditUser extends Component {
  constructor() {
    super();
    this.userInfo = JSON.parse(localStorage.getItem("USER_INFO"));
    this.state = {
      isLoading: false,
      name: "",
      email: "",
      phoneNumber: "",
      password: ""
    };
  }

  componentDidMount() {
    this.fetchUserAndProfileById(this.props.match.params.id);
  }

  fetchUserProfile = () => {
    return axios.get(`/profiles?AccountId=${this.props.match.params.id}`);
  };

  fetchUserById = () => {
    return axios.get(`/accounts?id=${this.props.match.params.id}`);
  };

  fetchUserAndProfileById = () => {
    return Promise.all([this.fetchUserById(), this.fetchUserProfile()])
      .then(res => {
        this.setState({
          name: `${res[1].data.data[0].firstName} ${res[1].data.data[0].lastName}`,
          email: res[0].data.data[0].email,
          phoneNumber: res[0].data.data[0].phoneNumber
        });
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
        this.setState({ hasLoaded: true });
      });
  };

  submit = data => {
    this.setState({ isLoading: true });
    axios
      .put(`/accounts/${this.props.match.params.id}`, {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password
      })
      .then(res => {
        Notify.success("اطلاعات شما با موفقیت به روز رسانی گردید.", 5000);
        this.props.history.push("/user/list");
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
        this.setState({ isLoading: false });
      });
  };

  render() {
    const { handleSubmit } = this.props;
    const { email, password, phoneNumber, name } = this.state;
    return (
      <div className="container">
        <Breadcrumb breads={dataList} />
        <Row className="grid-layout__container">
          <Col
            span={24}
            style={{
              padding: "15px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 4px 0 #e3e9f3",
              borderRadius: 6
            }}
          >
            <Form disableEnterSubmit={false} vertical className={"add-order__form"} onSubmit={handleSubmit(this.submit)}>
              <FormInputField
                name="name"
                type="text"
                placeholder="نام و نام خانوادگی"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  required: true
                }}
                validationErrors={{
                  required: " نام و نام خانوادگی اجباری است."
                }}
                value={name}
              />
              <FormInputField
                name="password"
                type="password"
                placeholder="رمز عبور"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  required: true
                }}
                validationErrors={{
                  required: " رمز عبور اجباری است."
                }}
                value={password}
              />
              <FormInputField
                name="email"
                type="email"
                placeholder="ایمیل"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  required: true
                }}
                validationErrors={{
                  required: " ایمیل اجباری است."
                }}
                value={email}
              />
              <FormInputField
                name="phoneNumber"
                type="text"
                placeholder="شماره تماس"
                maxLength={11}
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  required: true
                }}
                validationErrors={{
                  required: " شماره تماس اجباری است."
                }}
                value={phoneNumber}
              />
              <Button htmlType="submit" className="submit-btn" type="primary" size="large" loading={this.state.isLoading}>
                ویرایش کاربر
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const WrappedForm = createForm()(EditUser);

export default WrappedForm;
