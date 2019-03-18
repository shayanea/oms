import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Button, Notify } from "zent";
import axios from "../../utils/requestConfig";

const { createForm, FormInputField, FormSelectField } = Form;
const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "درج کاربر" }];

class AddUser extends Component {
  state = {
    isLoading: false
  };

  submit = data => {
    this.setState({ isLoading: true });
    axios
      .post("/accounts", {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        roleIds: [data.roleIds]
      })
      .then(res => {
        this.props.history.push("/users/list");
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
        this.setState({ isLoading: false });
      });
  };

  render() {
    const { handleSubmit } = this.props;
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
              />
              <FormSelectField
                name="roleIds"
                placeholder="انتخاب سطح دسترسی"
                label="سطح دسترسی"
                data={[{ id: 2, title: "مدیر سیستم" }, { id: 4, title: "مدیر سفارشات" }, { id: 16, title: "تایپیست" }]}
                autoWidth
                optionValue="id"
                optionText="title"
                required
              />
              <Button htmlType="submit" className="submit-btn" type="primary" size="large" loading={this.state.isLoading}>
                درج کاربر
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const WrappedForm = createForm()(AddUser);

export default WrappedForm;
