import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as moment from "moment-jalaali";
import { getNonAssignOrders } from "../../actions/orderActions";
import axios from "../../utils/requestConfig";
import City from "../../assets/city.json";
import DatePicker from "../../components/order/datepicker";
import MultiSelect from "react-select";

import { Layout, Breadcrumb, SearchInput, Table, Button, Select, Notify } from "zent";
import AddAssign from "../../components/order/addAssign";
import ViewOrder from "../../components/order/viewOrder";
import HistoryOrder from "../../components/order/historyOrder";

const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "انتساب سفارش‌ها" }];

class AssingOrder extends Component {
  constructor(props) {
    super(props);
    moment.loadPersian({ dialect: "persian-modern" });
    this.state = {
      page: {
        pageSize: 30,
        current: 0,
        totalItem: this.props.orders.page
      },
      dateObj: {
        day: Number(moment().jDate()),
        month: Number(moment().format("jMM")),
        year: Number(moment().jYear()),
        hour: moment().format("HH"),
        minute: moment().format("mm")
      },
      datasets: this.props.orders.items,
      loading: true,
      searchText: "",
      selectedCityId: null,
      selectedRowKeys: [],
      products: [],
      productDropDown: [],
      selectedProductId: null,
      modalStatus: false,
      infoModalStatus: false,
      historyModalStatus: false,
      selectedItem: null,
      courierStatus: false,
      startDate: "",
      endDate: ""
    };
  }

  componentDidMount() {
    this.props.getNonAssignOrders(
      this.props.orders.page,
      this.props.orders.search,
      this.state.selectedCityId,
      this.state.selectedProductId,
      this.state.startDate,
      this.state.endDate
    );
    this.fetchProducts();
  }

  fetchProducts = () => {
    return axios
      .get(`/products`)
      .then(res => {
        let array = [];
        res.data.data.forEach(item => {
          array.push({ value: item.id, label: item.title });
        });
        this.setState({ products: res.data.data, productDropDown: array });
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
    this.props.getNonAssignOrders(conf.current, this.props.orders.search, this.state.selectedCityId, this.state.selectedProductId, this.state.startDate, this.state.endDate);
  }

  onSearchChange = evt => {
    this.setState({
      searchText: evt.target.value
    });
  };

  selectProductHandler = selectedProductId => this.setState({ selectedProductId });

  selectCityHandler = (event, selected) => {
    this.setState({ selectedCityId: selected.value });
  };

  onSelect(selectedRowKeys, selectedRows, currentRow) {
    this.setState({
      selectedRowKeys
    });
  }

  onToggleModal = () => this.setState({ modalStatus: !this.state.modalStatus });

  onSelectUser = () => {
    this.setState({
      selectedRowKeys: [],
      modalStatus: false
    });
    this.props.getNonAssignOrders(this.props.orders.page, this.state.searchText, this.state.selectedCityId, this.state.selectedProductId, this.state.startDate, this.state.endDate);
  };

  findCityById = id => {
    let result = City.find(item => item.id === id);
    return result ? result.fullName : "";
  };

  findProductById = id => {
    let product = this.state.products.find(item => item.id === id);
    return product ? product.title : "";
  };

  selectStartDate = dateObj => {
    let value = moment(`${dateObj.year}/${dateObj.month}/${dateObj.day} 00:00}`, "jYYYY/jM/jD HH:mm").format();
    this.setState({ startDate: value });
    if (this.state.endDate === "") {
      this.setState({
        endDate: moment()
          .add(1, "day")
          .startOf("day")
          .format()
      });
    }
  };

  selectEndDate = dateObj => {
    let value = moment(`${dateObj.year}/${dateObj.month}/${dateObj.day} 23:59}}`, "jYYYY/jM/jD HH:mm").format();
    this.setState({ endDate: value });
  };

  viewOrder = item => this.setState({ infoModalStatus: true, selectedItem: item });

  viewOrderHistory = item => this.setState({ historyModalStatus: true, selectedItem: item });

  filter = () => {
    this.props.getNonAssignOrders(1, this.state.searchText, this.state.selectedCityId, this.state.selectedProductId, this.state.startDate, this.state.endDate);
  };

  render() {
    const { isLoading } = this.props.orders;
    const {
      searchText,
      datasets,
      page,
      selectedRowKeys,
      modalStatus,
      products,
      courierStatus,
      infoModalStatus,
      historyModalStatus,
      selectedItem,
      dateObj,
      productDropDown
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
        title: "شماره تماس",
        name: "firstPhoneNumber"
      },
      {
        title: "کالا",
        bodyRender: data => {
          return this.findProductById(data.products[0].productId);
        }
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
              <span className="view-item" onClick={() => this.viewOrder(data)} />
              <span className="history-item" onClick={() => this.viewOrderHistory(data)} />
            </React.Fragment>
          );
        }
      }
    ];
    let self = this;
    return (
      <div className="container">
        <h2 className="page-title">انتساب سفارش‌ها</h2>
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
                <MultiSelect
                  classNamePrefix="zent-select-text"
                  value={this.state.selectedProductId}
                  onChange={this.selectProductHandler}
                  placeholder="انتخاب کالا"
                  isMulti
                  options={[{ value: null, label: "همه محصولات" }, ...productDropDown]}
                />
                <Select
                  name="city"
                  placeholder="انتخاب شهر یا استان"
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
            <div className="control-contaianer" style={{ marginTop: 30, justifyContent: "flex-start" }}>
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
              rowKey="id"
              loading={isLoading}
              selection={{
                selectedRowKeys: this.state.selectedRowKeys,
                needCrossPage: true,
                onSelect: (selectedRowKeys, selectedRows, currentRow) => {
                  self.onSelect(selectedRowKeys, selectedRows, currentRow);
                }
              }}
            />
            {!isLoading && datasets.length > 0 ? <div className="total-page__number">مجموع: {page.totalItem}</div> : null}
            {!courierStatus && (
              <Button
                htmlType="submit"
                className="submit-btn"
                type="primary"
                size="large"
                style={{ marginTop: "15px" }}
                disabled={!selectedRowKeys.length}
                onClick={this.onToggleModal}
              >
                انتساب به واحد ارسال
              </Button>
            )}
          </Col>
        </Row>
        <AddAssign courierStatus={courierStatus} modalStatus={modalStatus} onToggleModal={this.onToggleModal} onSelectUser={this.onSelectUser} selectedRowKeys={selectedRowKeys} />
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

AssingOrder.propTypes = {
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
    getNonAssignOrders
  }
)(AssingOrder);
