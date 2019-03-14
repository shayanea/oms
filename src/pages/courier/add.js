import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Button, Notify } from "zent";
import axios from "../../utils/requestConfig";

const { createForm, FormInputField, FormCheckboxField } = Form;
const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "درج واحد ارسال" }];

class AddCourier extends Component {
  state = {
    isLoading: false
  };

  submit = data => {
    this.setState({ isLoading: true });
    axios
      .post("/couriers", {
        code: data.code,
        title: data.title,
        description: data.description,
        note: data.note,
        contactPerson: data.contactPerson,
        contactNumber: data.contactNumber,
        contactEmail: data.contactEmail,
        isActive: data.isActive === "" ? false : data.isActive
      })
      .then(res => {
        this.props.history.push("/couriers/list");
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
              <FormInputField name="code" type="text" placeholder="کد" />
              <FormInputField
                name="title"
                type="text"
                placeholder="عنوان"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  required: true
                }}
                validationErrors={{
                  required: " عنوان اجباری است."
                }}
              />
              <FormInputField name="description" type="text" placeholder="توضیحات" />
              <FormInputField name="contactPerson" type="text" placeholder="نام مسعول واحد" />
              <FormInputField name="contactNumber" type="text" placeholder="شماره تماس مسعول واحد" />
              <FormInputField name="contactEmail" type="text" placeholder="ایمیل مسعول واحد" />
              <FormInputField name="note" type="text" placeholder="نوت" />
              <FormCheckboxField name="isActive">فعال</FormCheckboxField>
              <Button htmlType="submit" className="submit-btn" type="primary" size="large" loading={this.state.isLoading}>
                درج واحد ارسال
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const WrappedForm = createForm()(AddCourier);

export default WrappedForm;
