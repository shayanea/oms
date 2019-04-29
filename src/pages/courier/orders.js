import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as moment from "moment-jalaali";
import { getAssignOrders } from "../../actions/orderActions";
import axios from "../../utils/requestConfig";
import City from "../../assets/city.json";
import { saveAs } from "file-saver";
import MultiSelect from "react-select";

import { Layout, SearchInput, Table, Select, Notify, Button, Breadcrumb } from "zent";
import ChangeStatus from "../../components/order/changeStatus";
import ViewOrder from "../../components/order/viewOrder";

const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/couriers/dashboard" }, { name: "سفارش‌های جدید" }];

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
      datasets: [],
      products: [],
      productDropDown: [],
      loading: true,
      searchText: "",
      modalStatus: false,
      selectedCityId: null,
      selectedProductId: null,
      selectedCourierId: null,
      courierId: "",
      selectedRowKeys: [],
      infoModalStatus: false,
      selectedItem: null,
      isExcelLoading: false
    };
  }

  componentDidMount() {
    this.fetchProducts();
    this.props.getAssignOrders(this.props.orders.page, this.props.orders.search);
  }

  fetchProducts = () => {
    axios
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
    this.props.getAssignOrders(conf.current, this.props.orders.search, this.state.selectedCityId, this.state.selectedProductId, this.state.selectedCourierId);
  }

  onSearchChange = evt => {
    this.setState({
      searchText: evt.target.value
    });
    if (evt.fromClearButton || evt.target.value === "") {
      this.props.getAssignOrders(this.props.orders.page, "", this.state.selectedCityId, this.state.selectedProductId, this.state.selectedCourierId);
    }
  };

  onPressEnter = () => {
    if (this.state.searchText !== "")
      this.props.getAssignOrders(this.props.orders.page, this.state.searchText, this.state.selectedCityId, this.state.selectedProductId, this.state.selectedCourierId);
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

  findCityById = id => {
    let result = City.find(item => item.id === id);
    return result ? result.fullName : "---";
  };

  findProductById = id => {
    let product = this.state.products.find(item => item.id === id);
    return product ? product.title : "---";
  };

  onToggleModal = () => this.setState({ modalStatus: !this.state.modalStatus });

  onChangeStatus = () => {
    this.setState({ modalStatus: false, selectedRowKeys: [] });
    this.props.getAssignOrders(this.props.orders.page, this.state.searchText, this.state.selectedCityId, this.state.selectedProductId, this.state.selectedCourierId);
  };

  viewOrder = item => this.setState({ infoModalStatus: true, selectedItem: item });

  filter = () => {
    this.props.getAssignOrders(1, this.state.searchText, this.state.selectedCityId, this.state.selectedProductId, this.state.selectedCourierId);
  };

  exoprtExcel = () => {
    this.setState({ isExcelLoading: true });
    let searchQuery = this.state.searchText !== "" ? `&_searchParameters=name,FirstPhoneNumber,PostalCode,Address,Notes&_search=${this.state.searchText}` : "";
    let cityQuery = this.state.selectedCityId !== null ? `&CityId=${this.state.selectedCityId}&CityId_op=in&` : "";
    let productQuery = this.state.selectedProductId !== null ? `&ProductId=${this.state.selectedProductId}&ProductId_op=in&` : "";
    let courierQuery = this.state.selectedCourierId !== null ? `&CourierId=${this.state.selectedCourierId}&CourierId_op=in&` : "";
    axios
      .get(`/orders?_sort=-CreationDateTime&StatusId=201${cityQuery}${productQuery}${courierQuery}${searchQuery}`, {
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

  render() {
    const { searchText, datasets, page, products, selectedRowKeys, modalStatus, infoModalStatus, selectedItem, isExcelLoading, productDropDown } = this.state;
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
              <span className="view-item" onClick={() => this.viewOrder(data)} />
            </React.Fragment>
          );
        }
      }
    ];
    let self = this;
    return (
      <div className="container">
        <h2 className="page-title">سفارش‌های جدید</h2>
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
          printable={true}
        />
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
    getAssignOrders
  }
)(OrderList);
