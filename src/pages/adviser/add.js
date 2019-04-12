import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Button, Notify } from "zent";
import axios from "../../utils/requestConfig";

const { createForm, FormInputField, FormCheckboxField } = Form;
const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "درج مشاور" }];

class AddAdviser extends Component {
  state = {
    isLoading: false
  };

  submit = data => {
    this.setState({ isLoading: true });
    axios
      .post("/advisers", {
        firstName: data.firstName,
        lastName: data.lastName,
        firstPhoneNumber: data.firstPhoneNumber,
        secondPhoneNumber: data.secondPhoneNumber,
        nationalCode: data.nationalCode,
        isActive: data.isActive !== ""
      })
      .then(res => {
        this.props.history.push("/advisers/list");
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
            <Form disableEnterSubmit={false} vertical className={"add-order__form"} onSubmit={handleSubmit(this.submit)}>
              <FormInputField
                name="firstName"
                type="text"
                placeholder="نام"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  required: true
                }}
                validationErrors={{
                  required: " نام اجباری است."
                }}
              />
              <FormInputField
                name="lastName"
                type="text"
                placeholder="نام خانوادگی"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  required: true
                }}
                validationErrors={{
                  required: " نام خانوادگی اجباری است."
                }}
              />
              <FormInputField
                name="nationalCode"
                type="text"
                placeholder="کد ملی"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  matchRegex: /^\d+$/
                }}
                validationErrors={{
                  matchRegex: "کد ملی را درست وارد نمایید."
                }}
              />
              <FormInputField
                name="firstPhoneNumber"
                type="text"
                placeholder="شماره موبایل"
                maxLength="11"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  required: true,
                  matchRegex: /^[0-9 || {InArabic}&&[^۰-۹]+$/,
                  maxLength: 11,
                  minLength: 11
                }}
                validationErrors={{
                  required: " شماره موبایل اجباری است.",
                  matchRegex: "شماره موبایل را درست وارد نمایید.",
                  maxLength: "شماره موبایل باید ۱۱ رقمی باشد.",
                  minLength: "شماره موبایل باید ۱۱ رقمی باشد."
                }}
                required
              />
              <FormInputField
                name="secondPhoneNumber"
                type="text"
                placeholder="شماره تلفن ثابت"
                maxLength="11"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  matchRegex: /^[0-9 || {InArabic}&&[^۰-۹]+$/,
                  maxLength: 11,
                  minLength: 11
                }}
                validationErrors={{
                  matchRegex: "شماره تلفن ثابت را درست وارد نمایید.",
                  maxLength: "شماره تلفن ثابت باید ۱۱ رقمی باشد.",
                  minLength: "شماره تلفن ثابت باید ۱۱ رقمی باشد."
                }}
              />
              <FormCheckboxField name="isActive">فعال</FormCheckboxField>
              <Button htmlType="submit" className="submit-btn" type="primary" size="large" loading={this.state.isLoading}>
                درج مشاور
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const WrappedForm = createForm()(AddAdviser);

export default WrappedForm;
