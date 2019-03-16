import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Button, Notify } from "zent";
import axios from "../../utils/requestConfig";

const { createForm, FormInputField, FormCheckboxField } = Form;
const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "درج کالا" }];

class AddProduct extends Component {
  state = {
    isLoading: false,
    price: 0
  };

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

  submit = data => {
    this.setState({ isLoading: true });
    axios
      .post("/products", {
        title: data.title,
        price: data.price,
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
              {/* <span>{this.state.price && parseFloat(this.state.price).toLocaleString("fa")} ریال</span> */}
              <FormInputField
                name="price"
                type="text"
                placeholder="قیمت (ریال)"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  required: true
                }}
                validationErrors={{
                  required: " قیمت اجباری است."
                }}
                value={this.state.price}
              />
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
