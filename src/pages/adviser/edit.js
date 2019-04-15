import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Button, Notify } from "zent";
import axios from "../../utils/requestConfig";

const { createForm, FormInputField, FormCheckboxField } = Form;
const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "درج مشاور" }];

class EditAdviser extends Component {
  state = {
    isLoading: false,
    firstName: "",
    lastName: "",
    firstPhoneNumber: "",
    secondPhoneNumber: "",
    nationalCode: "",
    isActive: false
  };

  componentDidMount() {
    this.fetchAdviser(this.props.match.params.id);
  }

  fetchAdviser = () => {
    return axios
      .get(`/advisers?id=${this.props.match.params.id}`)
      .then(res => {
        this.setState({
          firstName: res.data.data[0].firstName,
          lastName: res.data.data[0].lastName,
          nationalCode: res.data.data[0].nationalCode,
          firstPhoneNumber: res.data.data[0].firstPhoneNumber,
          secondPhoneNumber: res.data.data[0].secondPhoneNumber,
          isActive: res.data.data[0].isActive
        });
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  submit = data => {
    this.setState({ isLoading: true });
    axios
      .put(`/advisers/${this.props.match.params.id}`, {
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
    const { firstName, lastName, nationalCode, firstPhoneNumber, secondPhoneNumber, isActive } = this.state;
    return (
      <div className="container">
        <div style={{ position: "relative" }}>
          <Breadcrumb breads={dataList} />
          <div onClick={() => this.props.history.goBack()} style={{ position: "absolute", left: "15px", top: "12px", fontSize: "12px", color: "#c79803", cursor: "pointer" }}>
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
                name="firstName"
                type="text"
                label="نام"
                placeholder="نام"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  required: true
                }}
                validationErrors={{
                  required: " نام اجباری است."
                }}
                value={firstName}
                required
              />
              <FormInputField
                name="lastName"
                type="text"
                label="نام خانوادگی"
                placeholder="نام خانوادگی"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  required: true
                }}
                validationErrors={{
                  required: " نام خانوادگی اجباری است."
                }}
                value={lastName}
                required
              />
              <FormInputField
                name="nationalCode"
                type="text"
                label="کد ملی"
                placeholder="کد ملی"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  matchRegex: /^\d+$/
                }}
                validationErrors={{
                  matchRegex: "کد ملی را درست وارد نمایید."
                }}
                value={nationalCode}
              />
              <FormInputField
                name="secondPhoneNumber"
                type="text"
                label="شماره تلفن ثابت"
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
                value={secondPhoneNumber}
              />
              <FormInputField
                name="firstPhoneNumber"
                type="text"
                label="شماره تماس"
                placeholder="شماره تماس"
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
                  required: " شماره تماس اجباری است.",
                  matchRegex: "شماره تماس را درست وارد نمایید.",
                  maxLength: "شماره تماس باید ۱۱ رقمی باشد.",
                  minLength: "شماره تماس باید ۱۱ رقمی باشد."
                }}
                required
                value={firstPhoneNumber}
              />

              <FormCheckboxField name="isActive" checked={isActive} onChange={e => this.setState({ isActive: e.target.checked })}>
                فعال
              </FormCheckboxField>
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

const WrappedForm = createForm()(EditAdviser);

export default WrappedForm;
