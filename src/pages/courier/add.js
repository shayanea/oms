import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Button, Notify } from "zent";
import axios from "../../utils/requestConfig";

const { createForm, FormInputField, FormCheckboxField } = Form;
const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "درج واحد ارسال" }];

class AddCourier extends Component {
  state = {
    isLoading: false,
    isSubmited: false,
    showAutoComplete: false,
    autoCompleteResult: [],
    selectAccountId: null
  };

  searchForUser = data => {
    if (data.length > 3) {
      axios
        .get(`/accounts?Email=${data}&Email_op=has`)
        .then(res => {
          if (res.data.data.length > 0) this.setState({ autoCompleteResult: res.data.data, showAutoComplete: true });
        })
        .catch(err => this.setState({ showAutoComplete: false, autoCompleteResult: [] }));
    } else {
      this.setState({ autoCompleteResult: [], showAutoComplete: false });
    }
  };

  submit = data => {
    if (this.state.selectAccountId !== null) {
      this.setState({ isLoading: true });
      axios
        .post("/couriers", {
          code: data.code,
          title: data.title,
          description: data.description,
          contactPerson: data.contactPerson,
          contactNumber: data.contactNumber,
          adminAccountId: this.state.selectAccountId,
          isActive: data.isActive === "" ? false : data.isActive
        })
        .then(res => {
          this.props.history.push("/couriers/list");
        })
        .catch(err => {
          Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
          this.setState({ isLoading: false });
        });
    }
  };

  render() {
    const { handleSubmit } = this.props;
    const { showAutoComplete, autoCompleteResult, selectAccountId } = this.state;
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
              <FormInputField name="contactPerson" type="text" placeholder="نام مسئول واحد" />
              <FormInputField
                name="contactNumber"
                type="text"
                placeholder="شماره تماس مسئول واحد"
                maxLength="11"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  matchRegex: /^[0-9 || {InArabic}&&[^۰-۹]+$/,
                  maxLength: 11,
                  minLength: 11
                }}
                validationErrors={{
                  matchRegex: "شماره تماس را درست وارد نمایید.",
                  maxLength: "شماره تماس باید ۱۱ رقمی باشد.",
                  minLength: "شماره تماس باید ۱۱ رقمی باشد."
                }}
              />
              <div className="zent-form__controls" style={{ marginBottom: "10px" }}>
                <div className="zent-input-wrapper" style={{ height: "40px", maxHeight: "46px" }}>
                  <input
                    ref={searchInput => {
                      this.searchInput = searchInput;
                    }}
                    className="zent-input"
                    type="text"
                    placeholder="مدیر واحد"
                    onChange={e => this.searchForUser(e.target.value)}
                  />
                  {showAutoComplete && (
                    <div className="autocomplete-result">
                      {autoCompleteResult.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            this.searchInput.value = item.email;
                            this.setState({ selectAccountId: item.id, showAutoComplete: false });
                          }}
                        >
                          {item.email}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selectAccountId === null ? (
                  <p style={{ color: "#f44" }} className="zent-form__error-desc">
                    عنوان اجباری است.
                  </p>
                ) : null}
              </div>
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
