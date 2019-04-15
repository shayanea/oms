import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Button, Notify } from "zent";
import axios from "../../utils/requestConfig";

const { createForm, FormSelectField, FormInputField } = Form;
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
      roleIds: ""
    };
  }

  componentDidMount() {
    this.fetchAccountById(this.props.match.params.id);
  }

  fetchAccountById = () => {
    axios
      .get(`/accounts?id=${this.props.match.params.id}`)
      .then(res => {
        this.setState({
          name: res.data.data[0].name,
          email: res.data.data[0].email,
          phoneNumber: res.data.data[0].phoneNumber,
          roleIds: res.data.data[0].roleIds[0]
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
      .put(`/accounts/${this.props.match.params.id}`, { name: data.name, email: data.email, phoneNumber: data.phoneNumber, roleIds: [data.roleIds] })
      .then(() => {
        Notify.success("اطلاعات شما با موفقیت به روز رسانی گردید.", 5000);
        this.props.history.push("/users/list");
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
        this.setState({ isLoading: false });
      });
  };

  render() {
    const { handleSubmit } = this.props;
    const { roleIds, name, email, phoneNumber } = this.state;
    return (
      <div className="container">
        <div style={{ position: "relative" }}>
          <Breadcrumb breads={dataList} />
          <div onClick={() => this.props.history.goBack()} style={{ position: "absolute", left: "15px", top: "12px", fontSize: "12px", color: "#38f", cursor: "pointer" }}>
            بازگشت
          </div>
        </div>
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
            <Form disableEnterSubmit={false} vertical className={"add-costum__form"} onSubmit={handleSubmit(this.submit)}>
              <FormInputField
                name="name"
                type="text"
                label="نام و نام خانوادگی"
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
                required
              />
              <FormInputField
                name="email"
                type="email"
                label="ایمیل"
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
                required
              />
              <FormInputField
                name="phoneNumber"
                type="text"
                label="شماره تماس"
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
                required
              />
              <FormSelectField
                name="roleIds"
                placeholder="انتخاب سطح دسترسی"
                label="سطح دسترسی"
                data={[{ id: 2, title: "مدیر سیستم" }, { id: 4, title: "مدیر سفارشات" }, { id: 16, title: "تایپیست" }, { id: 32, title: "مدیر واحد ارسال" }]}
                autoWidth
                optionValue="id"
                optionText="title"
                required
                value={roleIds}
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
