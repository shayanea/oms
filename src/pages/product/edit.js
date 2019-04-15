import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Button, Notify, Loading } from "zent";
import axios from "../../utils/requestConfig";
import CurrencyInput from "react-currency-input";

const { createForm, FormInputField, FormCheckboxField } = Form;
const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "ویرایش کالا" }];

class EditProduct extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      isLoading: false,
      title: "",
      description: "",
      code: "",
      price: 0,
      isAvailable: false,
      hasLoaded: false
    };
  }

  componentDidMount() {
    this.fetchProductById(this.props.match.params.id);
  }

  fetchProductById = () => {
    return axios
      .get(`/products?id=${this.props.match.params.id}`)
      .then(res => {
        this.setState({
          title: res.data.data[0].title,
          code: res.data.data[0].code,
          description: res.data.data[0].description,
          isAvailable: res.data.data[0].isAvailable,
          price: res.data.data[0].price,
          hasLoaded: true
        });
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
        this.setState({ hasLoaded: true });
      });
  };

  handleChange(event, maskedvalue, floatvalue) {
    this.setState({ price: floatvalue });
  }

  submit = data => {
    if (this.state.price > 0) {
      axios
        .put(`/products/${this.props.match.params.id}`, {
          title: data.title,
          price: this.state.price,
          description: data.description,
          code: data.code,
          body: "",
          isAvailable: this.state.isAvailable
        })
        .then(res => {
          Notify.success("کالا مورد نظر با موفقیت به روز رسانی گردید.", 5000);
          this.props.history.push("/products/list");
        })
        .catch(err => {
          Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
        });
    }
  };

  render() {
    const { handleSubmit } = this.props;
    const { title, price, code, description, isAvailable, hasLoaded } = this.state;
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
            {hasLoaded ? (
              <Form disableEnterSubmit={false} vertical className={"add-costum__form"} onSubmit={handleSubmit(this.submit)}>
                <FormInputField
                  name="title"
                  type="text"
                  label="نام کالا"
                  placeholder="نام کالا"
                  value={title}
                  validateOnChange={false}
                  validateOnBlur={false}
                  validations={{
                    required: true
                  }}
                  validationErrors={{
                    required: " نام کالا اجباری است."
                  }}
                  required
                />
                <FormInputField name="code" type="text" label="کد" placeholder="کد" value={code} />
                <div className="zent-form__control-group ">
                  <label className="zent-form__control-label">
                    قیمت (ریال)<em className="zent-form__required">*</em>
                  </label>
                  <div className="zent-form__controls">
                    <div className="zent-input-wrapper">
                      <CurrencyInput onChangeEvent={this.handleChange} value={price} className="zent-input" placeholder="قیمت (ریال)" precision="0" />
                    </div>
                  </div>
                </div>
                <FormInputField name="description" type="textarea" value={description} label="توضیحات" placeholder="توضیحات" />
                <FormCheckboxField name="isAvailable" checked={isAvailable} onChange={e => this.setState({ isAvailable: e.target.checked })}>
                  موجود
                </FormCheckboxField>
                <Button htmlType="submit" className="submit-btn" type="primary" size="large" loading={this.state.isLoading}>
                  ویرایش کالا
                </Button>
              </Form>
            ) : (
              <Loading show />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const WrappedForm = createForm()(EditProduct);

export default WrappedForm;
