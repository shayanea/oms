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
    note: "",
    contactEmail: "",
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
          note: res.data.data[0].note,
          contactPerson: res.data.data[0].contactPerson,
          contactNumber: res.data.data[0].contactNumber,
          contactEmail: res.data.data[0].contactEmail,
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
    this.setState({ isLoading: true });
    axios
      .put(`/couriers/${this.props.match.params.id}`, {
        code: data.code,
        title: data.title,
        description: data.description,
        note: data.note,
        contactPerson: data.contactPerson,
        contactNumber: data.contactNumber,
        contactEmail: data.contactEmail,
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
    const { code, title, description, note, contactEmail, contactNumber, contactPerson, isActive, showAutoComplete, autoCompleteResult } = this.state;
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
              <FormInputField name="code" type="text" placeholder="کد" value={code} />
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
                value={title}
              />
              <FormInputField name="description" type="text" placeholder="توضیحات" value={description} />
              <FormInputField name="contactPerson" type="text" placeholder="نام مسئول واحد" value={contactPerson} />
              <FormInputField name="contactNumber" type="text" placeholder="شماره تماس مسئول واحد" value={contactNumber} />
              <FormInputField name="contactEmail" type="text" placeholder="ایمیل مسئول واحد" value={contactEmail} />
              <FormInputField name="note" type="text" placeholder="نوت" value={note} />
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
