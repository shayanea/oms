import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Button, Notify } from "zent";
import axios from "../../utils/requestConfig";
import CurrencyInput from "react-currency-input";

const { createForm, FormInputField, FormCheckboxField } = Form;
const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "درج کالا" }];

class AddProduct extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      isLoading: false,
      price: 0
    };
  }

  toEnglishDigits(string) {
    string = typeof string === "number" ? JSON.stringify(string) : string;
    var e = "۰".charCodeAt(0);
    string = string.replace(/[۰-۹]/g, function(t) {
      return t.charCodeAt(0) - e;
    });
    e = "٠".charCodeAt(0);
    string = string.replace(/[٠-٩]/g, function(t) {
      return t.charCodeAt(0) - e;
    });
    return string;
  }

  handleChange(event, maskedvalue, floatvalue) {
    this.setState({ price: floatvalue });
  }

  submit = data => {
    if (this.state.price > 0) {
      this.setState({ isLoading: true });
      axios
        .post("/products", {
          title: data.title,
          price: this.state.price,
          description: data.description,
          code: data.code,
          body: "",
          isAvailable: data.isAvailable
        })
        .then(res => this.props.history.push("/products/list"))
        .catch(err => {
          Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
          this.setState({ isLoading: false });
        });
    }
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
                name="title"
                type="text"
                placeholder="نام کالا"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  required: true
                }}
                validationErrors={{
                  required: " نام کالا اجباری است."
                }}
              />
              <FormInputField name="code" type="text" placeholder="کد" />
              <div className="zent-form__control-group ">
                <label className="zent-form__control-label" />
                <div className="zent-form__controls">
                  <div className="zent-input-wrapper">
                    <CurrencyInput onChangeEvent={this.handleChange} value={this.state.price} className="zent-input" placeholder="قیمت (ریال)" precision="0" />
                  </div>
                </div>
              </div>
              <FormInputField name="description" type="textarea" placeholder="توضیحات" />
              <FormCheckboxField name="isAvailable">موجود</FormCheckboxField>
              <Button htmlType="submit" className="submit-btn" type="primary" size="large" loading={this.state.isLoading}>
                درج کالا
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const WrappedForm = createForm()(AddProduct);

export default WrappedForm;
