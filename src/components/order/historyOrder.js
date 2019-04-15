import React, { Component } from "react";
import { Portal, Table, Button, Notify } from "zent";
import * as moment from "moment-jalaali";
import axios from "../../utils/requestConfig";

const WrappedPortal = Portal.withNonScrollable(Portal.withESCToClose(Portal));
const Statuses = [
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

class Modal extends Component {
  constructor(props) {
    super(props);
    moment.loadPersian({ dialect: "persian-modern" });
    this.state = {
      datasets: [],
      accounts: [],
      page: {
        pageSize: 30,
        current: 0
      }
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.historyModalStatus && this.props.historyModalStatus !== prevProps.historyModalStatus) {
      this.fetchOrderHistory(this.props.selectedItem.id);
    }
  }

  fetchOrderHistory = id => {
    axios
      .get(`/orders/${id}/histories`)
      .then(res => {
        this.setState({
          datasets: res.data.data,
          page: {
            pageSize: 30,
            current: 0
          }
        });
        this.fetchAccount(res.data.data);
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  fetchAccount = accounts => {
    let array = accounts.map(e => e.accountId).join(",");
    axios
      .get(`/accounts?Id=${array}&Id_op=in`)
      .then(res => {
        this.setState({ accounts: res.data.data });
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  findAccountName = id => {
    let result = this.state.accounts.find(item => item.id === id);
    return result ? result.name : "مدیر سیستم";
  };

  findStatusName = id => {
    let result = Statuses.find(item => item.id === Number(id));
    return result ? result.title : "---";
  };

  render() {
    const { historyModalStatus, onCloseModal } = this.props;
    const { datasets, page } = this.state;
    const columns = [
      {
        title: "شماره فاکتور",
        name: "orderId"
      },
      {
        title: "نام کاربر",
        name: "accountId",
        bodyRender: data => {
          return <React.Fragment>{this.findAccountName(data.accountId)}</React.Fragment>;
        }
      },
      {
        title: "یادداشت",
        name: "note"
      },
      {
        title: "وضعیت قبلی",
        name: "oldStatusId",
        width: "25%",
        bodyRender: data => {
          return <React.Fragment>{this.findStatusName(data.oldStatusId)}</React.Fragment>;
        }
      },
      {
        title: "وضعیت جدید",
        name: "newStatusId",
        width: "25%",
        bodyRender: data => {
          return <React.Fragment>{this.findStatusName(data.newStatusId)}</React.Fragment>;
        }
      },
      {
        title: "تاریخ ثبت",
        width: "25%",
        bodyRender: data => {
          return moment(data.creationDateTime)
            .local()
            .format("jDD jMMMM jYYYY - HH:mm");
        }
      }
    ];
    return (
      <WrappedPortal
        visible={historyModalStatus}
        onClickAway={onCloseModal}
        onClose={onCloseModal}
        className="layer"
        style={{ background: "rgba(0, 0, 0, 0.2)", zIndex: 100 }}
        useLayerForClickAway
      >
        <div className="add-custom__modal view-order__modal" style={{ minWidth: "80%", maxHeight: "80%", overflow: "auto" }}>
          <div className="add-custom__modal__overlay">
            <h2>تاریخچه سفارش</h2>
            <Table emptyLabel={"هیچ آیتمی در این لیست وجود ندارد."} columns={columns} datasets={datasets} pageInfo={page} rowKey="id" />
            <Button type="default" onClick={onCloseModal} className="zent-btn-default">
              بستن
            </Button>
          </div>
        </div>
      </WrappedPortal>
    );
  }
}

export default Modal;
