import React, { Component } from "react";
import { Button, Portal, Notify, Input } from "zent";
import axios from "../../utils/requestConfig";

const WrappedPortal = Portal.withNonScrollable(Portal.withESCToClose(Portal));

let Statuses = [
  { id: null, title: "وضعیت را انتخاب کنید" },
  { id: 101, title: "ثبت شده" },
  { id: 201, title: "ارجاع به واحد ارسال" },
  { id: 301, title: "مرجوعی - عدم موجودی کالا" },
  { id: 302, title: "مرجوعی - خارج از محدوده" },
  { id: 303, title: "مرجوعی - تکمیل ظرفیت ارسال" },
  { id: 304, title: "مرجوعی - به درخواست فروشگاه" },
  { id: 501, title: "وصول شد" },
  { id: 601, title: "کنسلی - آدرس اشتباه" },
  { id: 602, title: "کنسلی - کنسلی تلفنی" },
  { id: 603, title: "کنسلی - عدم حضور مشتری" },
  { id: 604, title: "کنسلی - کالای معیوب" },
  { id: 605, title: "کنسلی - کنسلی حضوری" },
  { id: 606, title: "کنسلی - مشتری بعدا سفارش خواهد داد" }
];

class ChangeStatusModal extends Component {
  constructor() {
    super();
    this.userInfo = JSON.parse(localStorage.getItem("USER_INFO"));
    this.state = {
      statusId: null,
      note: ""
    };
  }

  componentDidMount() {
    if (this.userInfo.roleId === "32" || this.userInfo.roleId === "64") Statuses = Statuses.filter(item => item.id !== 201 && item.id !== 101);
  }

  onChange = e => {
    this.setState({ note: e.target.value });
  };

  submit = () => {
    if (this.state.statusId !== null) {
      axios
        .post(`/orders/statuses/${this.state.statusId}`, {
          orderIds: this.props.selectedRowKeys,
          note: this.state.note
        })
        .then(res => {
          Notify.success("سفارش مورد نظر با موفقیت انتساب گردید.", 5000);
          this.props.onChangeStatus();
        })
        .catch(err => {
          Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
        });
    }
  };

  render() {
    const { modalStatus, onToggleModal } = this.props;
    return (
      <WrappedPortal visible={modalStatus} onClickAway={onToggleModal} onClose={onToggleModal} className="layer" style={{ background: "rgba(0, 0, 0, 0.2)" }} useLayerForClickAway>
        <div className="add-custom__modal">
          <div className="add-custom__modal__overlay">
            <h2>درج انتساب</h2>
            <div className="zent-form__controls" style={{ marginBottom: "10px" }}>
              <div className="zent-input-wrapper" style={{ height: "40px", maxHeight: "46px" }}>
                <select defaultValue="" placeholder="انتخاب وضعیت" className="custome-select-input" onChange={e => this.setState({ statusId: e.target.value })}>
                  {Statuses.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Input onChange={this.onChange} type="textarea" style={{ marginBottom: "10px" }} />
            <Button htmlType="submit" className="submit-btn" type="primary" size="large" onClick={() => this.submit()}>
              تغییر وضعیت
            </Button>
          </div>
        </div>
      </WrappedPortal>
    );
  }
}

export default ChangeStatusModal;
