import React, { Component } from "react";
import { Form, Button, Portal, Notify } from "zent";
import axios from "../../utils/requestConfig";

const { FormSelectField, createForm } = Form;

const WrappedPortal = Portal.withNonScrollable(Portal.withESCToClose(Portal));

class Modal extends Component {
  state = {
    couriers: []
  };

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = () => {
    return axios
      .get(`/couriers`)
      .then(res => {
        this.setState({ couriers: res.data.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  submit = data => {
    axios
      .put(`/couriers/${data.couriers}/orders`, {
        orderIds: this.props.selectedRowKeys
      })
      .then(res => {
        Notify.success("سفارش مورد نظر با موفقیت انتساب گردید.", 5000);
        this.props.onSelectUser();
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  render() {
    const { modalStatus, onToggleModal, handleSubmit } = this.props;
    const { couriers } = this.state;
    return (
      <WrappedPortal visible={modalStatus} onClickAway={onToggleModal} onClose={onToggleModal} className="layer" style={{ background: "rgba(0, 0, 0, 0.2)" }} useLayerForClickAway>
        <div className="add-custom__modal">
          <div className="add-custom__modal__overlay">
            <h2>درج انتساب</h2>
            <Form disableEnterSubmit={false} vertical onSubmit={handleSubmit(this.submit)}>
              <FormSelectField name="couriers" placeholder="انتخاب کاربر" label="کاربر" data={couriers} autoWidth optionValue="id" optionText="title" required />
              <Button htmlType="submit" className="submit-btn" type="primary" size="large">
                ثبت انتساب
              </Button>
            </Form>
          </div>
        </div>
      </WrappedPortal>
    );
  }
}

const WrappedForm = createForm()(Modal);

export default WrappedForm;
