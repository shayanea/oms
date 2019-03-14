import React, { Component } from "react";
import { Form, Button, Portal, Notify } from "zent";
import axios from "../../utils/requestConfig";

const { FormSelectField, createForm } = Form;

const WrappedPortal = Portal.withNonScrollable(Portal.withESCToClose(Portal));

class ChangeStatusModal extends Component {
  submit = data => {
    axios
      .put(`/orders/${data.couriers}/status`, {
        statusId: data.statusId
      })
      .then(res => {
        Notify.success("سفارش مورد نظر با موفقیت انتساب گردید.", 5000);
        this.props.onChangeStatus();
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  render() {
    const { modalStatus, onToggleModal, handleSubmit } = this.props;
    return (
      <WrappedPortal visible={modalStatus} onClickAway={onToggleModal} onClose={onToggleModal} className="layer" style={{ background: "rgba(0, 0, 0, 0.2)" }} useLayerForClickAway>
        <div className="add-custom__modal" style={{ minHeight: "450px" }}>
          <div className="add-custom__modal__overlay">
            <h2>درج انتساب</h2>
            <Form disableEnterSubmit={false} vertical onSubmit={handleSubmit(this.submit)}>
              <FormSelectField
                name="status"
                placeholder="انتخاب وضعیت"
                label="وضعیت"
                data={[
                  { id: null, title: "همه" },
                  { id: 101, title: "ثبت شده" },
                  { id: 201, title: "ارجاع به واحد ارسال" },
                  { id: 301, title: "مرجوعی - عدم موجودی کالا" },
                  { id: 302, title: "مرجوعی - خارج از محدوده" },
                  { id: 303, title: "مرجوعی - تکمیل ظرفیت ارسال" },
                  { id: 304, title: "مرجوعی - به درخواست فروشگاه" },
                  { id: 401, title: "هماهنگی ارسال برای مشتری" },
                  { id: 501, title: "وصول شد" },
                  { id: 601, title: "کنسلی - آدرس اشتباه" },
                  { id: 602, title: "کنسلی - کنسلی تلفنی" },
                  { id: 603, title: "کنسلی - عدم حضور مشتری" },
                  { id: 604, title: "کنسلی - کالای معیوب" },
                  { id: 605, title: "کنسلی - کنسلی حضوری" },
                  { id: 606, title: "کنسلی - مشتری بعدا سفارش خواهد داد" }
                ]}
                autoWidth
                optionValue="id"
                optionText="title"
                required
              />
              <Button htmlType="submit" className="submit-btn" type="primary" size="large">
                تغییر وضعیت
              </Button>
            </Form>
          </div>
        </div>
      </WrappedPortal>
    );
  }
}

const WrappedForm = createForm()(ChangeStatusModal);

export default WrappedForm;
