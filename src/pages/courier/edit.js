import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Button, Notify } from "zent";
import axios from "../../utils/requestConfig";

const { createForm, FormInputField, FormCheckboxField } = Form;
const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "ویرایش واحد ارسال" }];

class EditCourier extends Component {
  state = {
    isLoading: false,
    title: "",
    code: "",
    description: "",
    isActive: false,
    contactNumber: "",
    contactPerson: "",
    showAutoComplete: false,
    autoCompleteResult: [],
    hasLoaded: false
  };

  componentDidMount() {
    this.fetchCourierById(this.props.match.params.id);
  }

  fetchCourierById = () => {
    return axios
      .get(`/couriers?id=${this.props.match.params.id}`)
      .then(res => {
        this.setState({
          code: res.data.data[0].code,
          title: res.data.data[0].title,
          description: res.data.data[0].description,
          isActive: res.data.data[0].isActive,
          contactPerson: res.data.data[0].contactPerson,
          contactNumber: res.data.data[0].contactNumber,
          selectAccountId: res.data.data[0].adminAccountId,
          hasLoaded: true
        });
        this.findAdminAccountById(res.data.data[0].adminAccountId);
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
        this.setState({ hasLoaded: true });
      });
  };

  findAdminAccountById = id => {
    return axios.get(`accounts?id=${id}`).then(res => (this.searchInput.value = res.data.data[0].email));
  };

  searchForUser = data => {
    if (data.length > 3) {
      return axios
        .get(`/accounts?Email=${data}&Email_op=has&RoleFlags=32&RoleFlags_op=mask`)
        .then(res => {
          if (res.data.data.length > 0) this.setState({ autoCompleteResult: res.data.data, showAutoComplete: true });
        })
        .catch(err => this.setState({ showAutoComplete: false, autoCompleteResult: [] }));
    } else {
      this.setState({ autoCompleteResult: [], showAutoComplete: false });
    }
  };

  submit = data => {
    if (this.state.selectAccountId === null) {
      return Notify.error("ایمیل وارد شده برای مدیر واحد ارسال معتبر نسیت.", 5000);
    }
    this.setState({ isLoading: true });
    axios
      .put(`/couriers/${this.props.match.params.id}`, {
        code: data.code,
        title: data.title,
        description: data.description,
        contactPerson: data.contactPerson,
        contactNumber: data.contactNumber,
        adminAccountId: this.state.selectAccountId,
        isActive: data.isActive === "" ? false : data.isActive
      })
      .then(res => {
        Notify.success("اطلاعات واحد با موفقیت به روز رسانی گردید.", 5000);
        this.props.history.push("/couriers/list");
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
        this.setState({ isLoading: false });
      });
  };

  render() {
    const { handleSubmit } = this.props;
    const { code, title, contactNumber, contactPerson, isActive, showAutoComplete, autoCompleteResult } = this.state;
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
              <FormInputField name="code" type="text" label="کد" placeholder="کد" value={code} />
              <FormInputField
                name="title"
                type="text"
                label="عنوان"
                placeholder="عنوان"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  required: true
                }}
                validationErrors={{
                  required: " عنوان اجباری است."
                }}
                value={title}
                required
              />
              <FormInputField name="contactPerson" type="text" label="نام مسئول واحد" placeholder="نام مسئول واحد" value={contactPerson} />
              <FormInputField name="contactNumber" type="text" label="شماره تماس مسئول واحد" placeholder="شماره تماس مسئول واحد" value={contactNumber} />
              <div className="zent-form__control-group ">
                <label className="zent-form__control-label">
                  <em class="zent-form__required">*</em>مدیر واحد
                </label>
                <div className="zent-form__controls">
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
                </div>
              </div>
              <FormCheckboxField name="isActive" checked={isActive} onChange={e => this.setState({ isActive: e.target.checked })}>
                فعال
              </FormCheckboxField>
              <Button htmlType="submit" className="submit-btn" type="primary" size="large" loading={this.state.isLoading}>
                ویرایش واحد ارسال
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const WrappedForm = createForm()(EditCourier);

export default WrappedForm;
