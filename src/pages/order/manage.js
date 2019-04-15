import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getAllOrders } from "../../actions/orderActions";
import * as moment from "moment-jalaali";
import axios from "../../utils/requestConfig";
import City from "../../assets/city.json";
import DatePicker from "../../components/order/datepicker";
import { saveAs } from "file-saver";

import { Layout, Breadcrumb, SearchInput, Table, Select, Notify, Sweetalert, Button } from "zent";
import ChangeStatus from "../../components/order/changeStatus";
import ViewOrder from "../../components/order/viewOrder";
import HistoryOrder from "../../components/order/historyOrder";

const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "مدیریت سفارش‌ها" }];

class OrderList extends Component {
  constructor(props) {
    super(props);
    moment.loadPersian({ dialect: "persian-modern" });
    this.userInfo = JSON.parse(localStorage.getItem("USER_INFO"));
    this.state = {
      page: {
        pageSize: 30,
        current: 0,
        totalItem: this.props.orders.total
      },
      dateObj: {
        day: Number(moment().jDate()),
        month: Number(moment().format("jMM")),
        year: Number(moment().jYear()),
        hour: moment().format("HH"),
        minute: moment().format("mm")
      },
      datasets: [],
      products: [],
      couriers: [],
      loading: true,
      isExcelLoading: false,
      searchText: "",
      modalStatus: false,
      courierStatus: false,
      selectedCityId: null,
      selectedProductId: null,
      selectedStatusId: null,
      selectedCourierId: null,
      courierId: "",
      selectedRowKeys: [],
      infoModalStatus: false,
      historyModalStatus: false,
      selectedItem: null,
      startDate: "",
      endDate: ""
    };
  }

  componentDidMount() {
    const hideCourier = this.props.location.search.match(/hide-courier=([^&]*)/);
    this.fetchProducts();
    if (hideCourier !== null && hideCourier[1] === "true") {
      this.setState({ courierStatus: true });
      axios.get(`/accounts/${this.userInfo.accountId}/couriers`).then(res => {
        let result = res.data.data.map(e => e.courierId).join(",");
        this.props.getAllOrders(
          this.props.orders.page,
          this.state.searchText,
          this.state.selectedCityId,
          this.state.selectedProductId,
          result,
          this.state.selectedStatusId,
          "",
          ""
        );
      });
    } else {
      this.fetchCouriers();
      this.props.getAllOrders(this.props.orders.page, this.props.orders.search, null, null, null, null, "", "");
    }
  }

  fetchProducts = () => {
    axios
      .get(`/products`)
      .then(res => {
        this.setState({ products: res.data.data });
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  fetchCouriers = (array = null) => {
    let url = array === null ? `/couriers` : `/couriers?CourierId=${array}&CourierId_op=in`;
    axios
      .get(url)
      .then(res => {
        this.setState({ couriers: res.data.data });
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.orders.items.length !== this.props.orders.items.length) {
      this.setState({
        page: {
          pageSize: 30,
          current: this.props.orders.page,
          totalItem: this.props.orders.total
        },
        loading: this.props.orders.loading,
        datasets: this.props.orders.items
      });
    }
  }

  onChange(conf) {
    this.setState({
      page: {
        pageSize: 30,
        current: conf.current,
        totalItem: this.props.orders.total
      }
    });
    this.props.getAllOrders(
      conf.current,
      this.state.searchText,
      this.state.selectedCityId,
      this.state.selectedProductId,
      this.state.selectedCourierId,
      this.state.selectedStatusId,
      this.state.startDate,
      this.state.endDate
    );
  }

  onSearchChange = evt => {
    this.setState({
      searchText: evt.target.value
    });
  };

  selectProductHandler = (event, selected) => {
    this.setState({ selectedProductId: selected.value });
  };

  selectCityHandler = (event, selected) => {
    this.setState({ selectedCityId: selected.value });
  };

  selectCourierHandler = (event, selected) => {
    this.setState({ selectedCourierId: selected.value });
  };

  selectStatusHandler = (event, selected) => {
    this.setState({ selectedStatusId: selected.value });
  };

  onSelect(selectedRowKeys, selectedRows, currentRow) {
    this.setState({
      selectedRowKeys
    });
  }

  findStatusById = type => {
    switch (Number(type)) {
      case 101:
        return "ثبت شده";
      case 201:
        return "ارجاع به واحد ارسال";
      case 301:
        return "مرجوعی - عدم موجودی کالا";
      case 302:
        return "مرجوعی - خارج از محدوده";
      case 303:
        return "مرجوعی - تکمیل ظرفیت ارسال";
      case 304:
        return "مرجوعی - به درخواست فروشگاه";
      case 501:
        return "وصول شد";
      case 601:
        return "کنسلی - آدرس اشتباه";
      case 602:
        return "کنسلی - کنسلی تلفنی";
      case 603:
        return "کنسلی - عدم حضور مشتری";
      case 604:
        return "کنسلی - کالای معیوب";
      case 605:
        return "کنسلی - کنسلی حضوری";
      case 606:
        return "کنسلی - مشتری بعدا سفارش خواهد داد";
      default:
        return "";
    }
  };

  findCourierById = id => {
    let result = this.state.couriers.find(item => item.id === id);
    return result ? result.title : "----";
  };

  findCityById = id => {
    let result = City.find(item => item.id === id);
    return result ? result.fullName : "----";
  };

  findProductById = id => {
    let product = this.state.products.find(item => item.id === id);
    return product ? product.title : "";
  };

  removeOrder = id => {
    Sweetalert.confirm({
      confirmType: "success",
      confirmText: "بله",
      cancelText: "منصرف شدم",
      content: "آیا مطمئن به حذف این سفارش هستید ؟",
      title: "",
      className: "custom-sweetalert",
      maskClosable: true,
      parentComponent: this,
      onConfirm: () =>
        new Promise(resolve => {
          this.removeAction(id).then(() => {
            resolve();
          });
        })
    });
  };

  removeAction = id => {
    return axios
      .delete(`/orders/${id}`)
      .then(res => {
        this.props.getAllOrders(
          this.props.orders.page,
          this.state.searchText,
          this.state.selectedCityId,
          this.state.selectedProductId,
          this.state.selectedCourierId,
          this.state.selectedStatusId
        );
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  onToggleModal = () => this.setState({ modalStatus: !this.state.modalStatus });

  onChangeStatus = () => {
    this.setState({ modalStatus: false, selectedRowKeys: [] });
  };

  selectStartDate = dateObj => {
    let value = moment(`${dateObj.year}/${dateObj.month}/${dateObj.day} 00:00}`, "jYYYY/jM/jD HH:mm").format();
    this.setState({ startDate: value });
  };

  selectEndDate = dateObj => {
    let value = moment(`${dateObj.year}/${dateObj.month}/${dateObj.day} 23:59}}`, "jYYYY/jM/jD HH:mm").format();
    this.setState({ endDate: value });
  };

  exoprtExcel = () => {
    this.setState({ isExcelLoading: true });
    let searchQuery =
      this.state.searchText !== ""
        ? `&Address=${this.state.searchText}&Address_op=has&Address_combineOp=or&FirstPhoneNumber=${this.state.searchText}&FirstPhoneNumber_op=has&FirstPhoneNumber_combineOp=or`
        : "";
    let cityQuery = this.state.selectedCityId !== null ? `&CityId=${this.state.selectedCityId}&CityId_op=in&` : "";
    let productQuery = this.state.selectedProductId !== null ? `&ProductId=${this.state.selectedProductId}&ProductId_op=in&` : "";
    let courierQuery = this.state.selectedCourierId !== null ? `&CourierId=${this.state.selectedCourierId}&CourierId_op=in&` : "";
    let statusQuery = this.state.selectedStatusId !== null ? `&StatusId=${this.state.selectedStatusId}&StatusId_op=in&` : "";
    let dateQuery =
      this.state.startDate !== ""
        ? `&CreationDateTime=${encodeURIComponent(this.state.startDate)},${
            this.state.endDate === "" ? encodeURIComponent(this.state.startDate) : encodeURIComponent(this.state.endDate)
          }&CreationDateTime_op=between`
        : "";
    axios
      .get(`/orders?_sort=-CreationDateTime${cityQuery}${productQuery}${courierQuery}${statusQuery}${dateQuery}${searchQuery}`, {
        headers: { Accept: "application/xlsx" },
        responseType: "arraybuffer"
      })
      .then((res, status, headers) => {
        this.setState({ isExcelLoading: false });
        const blob = new Blob([res.data], {
          type: "application/xlsx"
        });
        saveAs(blob, `order_${moment().format("jDD jMMMM jYYYY - HH:mm")}.xlsx`);
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  viewOrder = item => this.setState({ infoModalStatus: true, selectedItem: item });

  viewOrderHistory = item => this.setState({ historyModalStatus: true, selectedItem: item });

  filter = () => {
    this.props.getAllOrders(
      this.props.orders.page,
      this.state.searchText,
      this.state.selectedCityId,
      this.state.selectedProductId,
      this.state.selectedCourierId,
      this.state.selectedStatusId,
      this.state.startDate,
      this.state.endDate
    );
  };

  render() {
    const { isLoading } = this.props.orders;
    const {
      searchText,
      datasets,
      page,
      products,
      couriers,
      selectedRowKeys,
      modalStatus,
      courierStatus,
      selectedItem,
      infoModalStatus,
      dateObj,
      historyModalStatus,
      isExcelLoading
    } = this.state;
    const columns = [
      {
        title: "شماره فاکتور",
        name: "id"
      },
      {
        title: "نام",
        name: "name"
      },
      {
        title: "واحد ارسال",
        bodyRender: data => {
          return this.findCourierById(data.courierId);
        }
      },
      {
        title: "کالا",
        bodyRender: data => {
          return this.findProductById(data.products[0].productId);
        }
      },
      {
        title: "وضعیت",
        bodyRender: data => {
          return this.findStatusById(data.statusId);
        }
      },
      {
        title: "تاریخ تغییر وضعیت",
        bodyRender: data => {
          return moment(data.modificationDateTime === null ? data.creationDateTime : data.modificationDateTime)
            .local()
            .format("jDD jMMMM jYYYY - HH:mm");
        }
      },
      {
        title: "شماره تماس",
        name: "firstPhoneNumber"
      },
      {
        title: "استان و شهر",
        bodyRender: data => {
          return this.findCityById(data.cityId);
        }
      },
      {
        title: "تاریخ ثبت",
        bodyRender: data => {
          return moment(data.creationDateTime)
            .local()
            .format("jDD jMMMM jYYYY - HH:mm");
        }
      },
      {
        title: "مجموع",
        bodyRender: data => {
          return <React.Fragment>{parseFloat(data.finalAmount).toLocaleString("fa")} ریال</React.Fragment>;
        }
      },
      {
        title: "عملیات",
        bodyRender: data => {
          return (
            <React.Fragment>
              <Link to={`/order/edit/${data.id}`}>
                <span className="edit-item" />
              </Link>
              <span className="view-item" onClick={() => this.viewOrder(data)} />
              <span className="history-item" onClick={() => this.viewOrderHistory(data)} />
              <span className="remove-item" onClick={() => this.removeOrder(data.id)} />
            </React.Fragment>
          );
        }
      }
    ];
    let self = this;
    return (
      <div className="container">
        <h2 className="page-title">مدیریت سفارش‌ها</h2>
        <div style={{ position: "relative" }}>
          <Breadcrumb breads={dataList} />
          <div onClick={() => this.props.history.goBack()} style={{ position: "absolute", left: "15px", top: "12px", fontSize: "12px", color: "#c79803", cursor: "pointer" }}>
            بازگشت
          </div>
        </div>
        <Row className="grid-layout__container">
          <Col span={24}>
            <div className="control-contaianer">
              <div className="right-control">
                <Select
                  name="status"
                  placeholder="انتخاب وضعیت سفارش"
                  data={[
                    { id: null, title: "همه" },
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
                  ]}
                  autoWidth
                  optionValue="id"
                  optionText="title"
                  onChange={this.selectStatusHandler}
                />
                {!courierStatus && (
                  <Select
                    name="courier"
                    placeholder="انتخاب واحد ارسال"
                    data={[{ id: null, title: "همه واحد‌های ارسال" }, ...couriers]}
                    autoWidth
                    optionValue="id"
                    optionText="title"
                    onChange={this.selectCourierHandler}
                  />
                )}
                <Select
                  name="product"
                  placeholder="انتخاب کالا"
                  data={[{ id: null, title: "همه محصولات" }, ...products]}
                  autoWidth
                  optionValue="id"
                  optionText="title"
                  onChange={this.selectProductHandler}
                  searchPlaceholder="جستجو"
                  filter={(item, keyword) => item.title.indexOf(keyword) > -1}
                  emptyText={"ایتمی پیدا نشد."}
                />
                <Select
                  name="city"
                  placeholder="انتخاب شهر یا استان."
                  data={[{ id: null, fullName: "همه شهر‌ها" }, ...City]}
                  autoWidth
                  optionValue="id"
                  optionText="fullName"
                  onChange={this.selectCityHandler}
                  searchPlaceholder="جستجو"
                  filter={(item, keyword) => item.fullName.indexOf(keyword) > -1}
                  emptyText={"ایتمی پیدا نشد."}
                />
              </div>
              <div style={{ display: "inline-flex", flexDirection: "row" }}>
                <SearchInput value={searchText} onChange={this.onSearchChange} placeholder="جستجو" />
                <Button type="primary" className="filter-btn" onClick={this.filter}>
                  اعمال فیلتر
                </Button>
              </div>
            </div>
            <div style={{ display: "flex", marginTop: 30 }}>
              <div style={{ position: "relative", marginLeft: 15 }}>
                <label className="datepicker-label">تاریخ شروع</label>
                <DatePicker
                  day={dateObj.day}
                  month={dateObj.month}
                  year={dateObj.year}
                  hour={dateObj.hour}
                  minute={dateObj.minute}
                  seconds={dateObj.seconds}
                  onUpdate={this.selectStartDate}
                  withoutHourAndMinute={false}
                />
              </div>
              <div style={{ position: "relative" }}>
                <label className="datepicker-label">تاریخ اتمام</label>
                <DatePicker
                  day={dateObj.day}
                  month={dateObj.month}
                  year={dateObj.year}
                  hour={dateObj.hour}
                  minute={dateObj.minute}
                  seconds={dateObj.seconds}
                  onUpdate={this.selectEndDate}
                  withoutHourAndMinute={false}
                />
              </div>
            </div>
            <Table
              emptyLabel={"هیچ آیتمی در این لیست وجود ندارد."}
              columns={columns}
              datasets={datasets}
              onChange={this.onChange.bind(this)}
              getRowConf={this.getRowConf}
              pageInfo={page}
              loading={isLoading}
              rowKey="id"
              selection={{
                selectedRowKeys: this.state.selectedRowKeys,
                needCrossPage: true,
                onSelect: (selectedRowKeys, selectedRows, currentRow) => {
                  self.onSelect(selectedRowKeys, selectedRows, currentRow);
                }
              }}
            />
            <Button
              htmlType="submit"
              className="submit-btn"
              type="primary"
              size="large"
              style={{ marginTop: "15px" }}
              disabled={!selectedRowKeys.length}
              onClick={this.onToggleModal}
            >
              تغییر وضعیت
            </Button>
            <Button
              htmlType="submit"
              className="submit-btn"
              type="primary"
              size="large"
              style={{ marginTop: "15px", marginRight: "15px" }}
              loading={isExcelLoading}
              onClick={this.exoprtExcel}
            >
              خروجی Excel
            </Button>
          </Col>
        </Row>
        <ChangeStatus modalStatus={modalStatus} onToggleModal={this.onToggleModal} onChangeStatus={this.onChangeStatus} selectedRowKeys={selectedRowKeys} />
        <ViewOrder
          infoModalStatus={infoModalStatus}
          selectedItem={selectedItem}
          onCloseModal={() => this.setState({ infoModalStatus: false, selectedItem: null })}
          City={City}
          products={products}
          printable
        />
        <HistoryOrder historyModalStatus={historyModalStatus} selectedItem={selectedItem} onCloseModal={() => this.setState({ historyModalStatus: false, selectedItem: null })} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  orders: state.orders
});

OrderList.propTypes = {
  orders: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    search: PropTypes.string.isRequired
  })
};

export default connect(
  mapStateToProps,
  {
    getAllOrders
  }
)(OrderList);
