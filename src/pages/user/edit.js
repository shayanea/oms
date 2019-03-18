import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Button, Notify } from "zent";
import axios from "../../utils/requestConfig";

const { createForm, FormInputField, FormSelectField } = Form;
const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "ویرایش کاربر" }];

class EditUser extends Component {
  constructor() {
    super();
    this.userInfo = JSON.parse(localStorage.getItem("USER_INFO"));
    this.state = {
      isLoading: false,
      name: "",
      roleIds: ""
    };
  }

  componentDidMount() {
    this.fetchUserAndProfileById(this.props.match.params.id);
  }

  fetchUserProfile = () => {
    return axios.get(`/profiles?AccountId=${this.props.match.params.id}`);
  };

  fetchUserById = () => {
    return axios.get(`/accounts?id=${this.props.match.params.id}`);
  };

  fetchUserAndProfileById = () => {
    return Promise.all([this.fetchUserById(), this.fetchUserProfile()])
      .then(res => {
        this.setState({
          name: `${res[1].data.data[0].firstName} ${res[1].data.data[0].lastName}`,
          roleIds: res[0].data.data[0].roleIds[0]
        });
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
        this.setState({ hasLoaded: true });
      });
  };

  updateUserInfo = data => {
    return axios.put(`/accounts/${this.props.match.params.id}/profile`, {
      firstName: data.name
    });
  };

  updateUserRole = data => {
    return axios.put(`/accounts/${this.props.match.params.id}/roles`, {
      roleIds: [data.roleIds]
    });
  };

  submit = data => {
    this.setState({ isLoading: true });
    axios
      .put(`/accounts/${this.props.match.params.id}/roles`, {
        roleIds: [data.roleIds]
      })
      .then(res => {
        Notify.success("اطلاعات شما با موفقیت به روز رسانی گردید.", 5000);
        this.props.history.push("/user/list");
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
        this.setState({ isLoading: false });
      });
  };

  render() {
    const { handleSubmit } = this.props;
    const { name, roleIds } = this.state;
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
              {/* <FormInputField
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
                value={name}
              /> */}
              <FormSelectField
                name="roleIds"
                placeholder="انتخاب سطح دسترسی"
                label="سطح دسترسی"
                data={[
                  { id: 2, title: "سیستم مدیریت" },
                  { id: 4, title: "مدیر سفارشات" },
                  // { id: 8, title: "مشاور" },
                  { id: 16, title: "تایپیست" },
                  { id: 32, title: "مدیر واحد ارسال" },
                  { id: 64, title: "واحد ارسال" }
                ]}
                autoWidth
                optionValue="id"
                optionText="title"
                required
                value={roleIds}
              />
              <Button htmlType="submit" className="submit-btn" type="primary" size="large" loading={this.state.isLoading}>
                ویرایش کاربر
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const WrappedForm = createForm()(EditUser);

export default WrappedForm;
