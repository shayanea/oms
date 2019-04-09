import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as moment from "moment-jalaali";
import { getNonAssignOrders } from "../../actions/orderActions";
import axios from "../../utils/requestConfig";
import City from "../../assets/city.json";
import { DatePicker } from "react-persian-datepicker";

import { Layout, Breadcrumb, SearchInput, Table, Button, Select, Notify } from "zent";
import AddAssign from "../../components/order/addAssign";
import ViewOrder from "../../components/order/viewOrder";

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
      datasets: this.props.orders.items,
      loading: true,
      searchText: "",
      selectedCityId: null,
      selectedRowKeys: [],
      products: [],
      selectedProductId: null,
      modalStatus: false,
      infoModalStatus: false,
      selectedItem: null,
      courierStatus: false,
      startDate: "",
      endDate: ""
    };
  }

  componentDidMount() {
    this.props.getNonAssignOrders(this.props.orders.page, this.props.orders.search, null, null, this.state.startDate, this.state.endDate);
    this.fetchProducts();
  }

  fetchProducts = () => {
    return axios
      .get(`/products`)
      .then(res => {
        this.setState({ products: res.data.data });
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
    this.props.getNonAssignOrders(conf.current, this.props.orders.search, this.state.selectedCityId, this.state.selectedProductId);
  }

  onSearchChange = evt => {
    this.setState({
      searchText: evt.target.value
    });
    if (evt.fromClearButton || evt.target.value === "") {
      this.props.getNonAssignOrders(this.props.orders.page, "", this.state.selectedCityId, this.state.selectedProductId);
    }
  };

  onPressEnter = () => {
    if (this.state.searchText !== "") this.props.getNonAssignOrders(this.props.orders.page, this.state.searchText, this.state.selectedCityId, this.state.selectedProductId);
  };

  selectProductHandler = (event, selected) => {
    this.setState({ selectedProductId: selected.value });
    this.props.getNonAssignOrders(this.props.orders.page, this.state.searchText, this.state.selectedCityId, selected.value);
  };

  selectCityHandler = (event, selected) => {
    this.setState({ selectedCityId: selected.value });
    this.props.getNonAssignOrders(this.props.orders.page, this.state.searchText, selected.value, this.state.selectedProductId);
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
    this.props.getNonAssignOrders(this.props.orders.page, this.state.searchText, this.state.selectedCityId, this.state.selectedProductId);
  };

  findCityById = id => {
    let result = City.find(item => item.id === id);
    return result ? result.fullName : "";
  };

  findProductById = id => {
    let product = this.state.products.find(item => item.id === id);
    return product ? product.title : "";
  };

  selectStartDate = value => {
    this.setState({ startDate: value });
    this.props.getNonAssignOrders(this.props.orders.page, this.state.searchText, this.state.selectedCityId, this.state.selectedProductId, value, this.state.endDate);
  };

  selectEndDate = value => {
    this.setState({ endDate: value });
    this.props.getNonAssignOrders(this.props.orders.page, this.state.searchText, this.state.selectedCityId, this.state.selectedProductId, this.state.startDate, value);
  };

  viewOrder = item => this.setState({ infoModalStatus: true, selectedItem: item });

  render() {
    const { searchText, datasets, page, selectedRowKeys, modalStatus, products, courierStatus, infoModalStatus, selectedItem, startDate, endDate } = this.state;
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
          <div onClick={() => this.props.history.goBack()} style={{ position: "absolute", left: "15px", top: "12px", fontSize: "12px", color: "#38f", cursor: "pointer" }}>
            بازگشت
          </div>
        </div>
        <Row className="grid-layout__container">
          <Col span={24}>
            <div className="control-contaianer">
              <div className="right-control">
                <Select
                  name="product"
                  placeholder="انتخاب کالا"
                  data={[{ id: null, title: "همه محصولات" }, ...products]}
                  autoWidth
                  optionValue="id"
                  optionText="title"
                  onChange={this.selectProductHandler}
                  searchPlaceholder="جستجو"
                  filter={(item, keyword) => item.value.indexOf(keyword) > -1}
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
                  filter={(item, keyword) => item.value.indexOf(keyword) > -1}
                />
                <DatePicker
                  calendarStyles={{
                    currentMonth: "currentMonth",
                    calendarContainer: "calendarContainer",
                    dayPickerContainer: "dayPickerContainer",
                    monthsList: "monthsList",
                    daysOfWeek: "daysOfWeek",
                    dayWrapper: "dayWrapper",
                    selected: "selected",
                    heading: "heading",
                    next: "next",
                    prev: "prev",
                    title: "title"
                  }}
                  className={"datepicker-input"}
                  onChange={value => this.selectStartDate(value)}
                  value={startDate}
                  placeholder="test"
                />
                <DatePicker
                  calendarStyles={{
                    currentMonth: "currentMonth",
                    calendarContainer: "calendarContainer",
                    dayPickerContainer: "dayPickerContainer",
                    monthsList: "monthsList",
                    daysOfWeek: "daysOfWeek",
                    dayWrapper: "dayWrapper",
                    selected: "selected",
                    heading: "heading",
                    next: "next",
                    prev: "prev",
                    title: "title"
                  }}
                  className={"datepicker-input"}
                  onChange={value => this.selectEndDate(value)}
                  value={endDate}
                />
              </div>
              <SearchInput value={searchText} onChange={this.onSearchChange} placeholder="جستجو" onPressEnter={this.onPressEnter} />
            </div>
            <Table
              emptyLabel={"هیچ آیتمی در این لیست وجود ندارد."}
              columns={columns}
              datasets={datasets}
              onChange={this.onChange.bind(this)}
              getRowConf={this.getRowConf}
              pageInfo={page}
              rowKey="id"
              selection={{
                selectedRowKeys: this.state.selectedRowKeys,
                needCrossPage: true,
                onSelect: (selectedRowKeys, selectedRows, currentRow) => {
                  self.onSelect(selectedRowKeys, selectedRows, currentRow);
                }
              }}
            />
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
