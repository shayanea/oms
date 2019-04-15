import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as moment from "moment-jalaali";
import { getAssignOrders } from "../../actions/orderActions";
import axios from "../../utils/requestConfig";
import City from "../../assets/city.json";

import { Layout, Breadcrumb, SearchInput, Table, Select, Notify, Button } from "zent";
import ChangeStatus from "../../components/order/changeStatus";
import ViewOrder from "../../components/order/viewOrder";
import HistoryOrder from "../../components/order/historyOrder";

const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "پیگیری سفارش‌ها" }];

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
      couriers: [],
      loading: true,
      searchText: "",
      modalStatus: false,
      selectedCityId: null,
      selectedProductId: null,
      selectedCourierId: null,
      courierId: "",
      selectedRowKeys: [],
      infoModalStatus: false,
      historyModalStatus: false,
      selectedItem: null
    };
  }

  componentDidMount() {
    this.fetchCouriers();
    this.fetchProducts();
    this.props.getAssignOrders(this.props.orders.page, this.props.orders.search);
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
    this.props.getAssignOrders(conf.current, this.props.orders.search, this.state.selectedCityId, this.state.selectedProductId, this.state.selectedCourierId);
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
    return result ? result.title : "";
  };

  findCityById = id => {
    let result = City.find(item => item.id === id);
    return result ? result.fullName : "";
  };

  findProductById = id => {
    let product = this.state.products.find(item => item.id === id);
    return product ? product.title : "";
  };

  onToggleModal = () => this.setState({ modalStatus: !this.state.modalStatus });

  onChangeStatus = () => {
    this.setState({ modalStatus: false, selectedRowKeys: [] });
    this.props.getAssignOrders(this.props.orders.page, this.state.searchText, this.state.selectedCityId, this.state.selectedProductId, this.state.selectedCourierId);
  };

  viewOrder = item => this.setState({ infoModalStatus: true, selectedItem: item });

  viewOrderHistory = item => this.setState({ historyModalStatus: true, selectedItem: item });

  filter = () => {
    this.props.getAssignOrders(this.props.orders.page, this.state.searchText, this.state.selectedCityId, this.state.selectedProductId, this.state.selectedCourierI);
  };

  render() {
    const { isLoading } = this.props.orders;
    const { searchText, datasets, page, products, couriers, selectedRowKeys, modalStatus, infoModalStatus, historyModalStatus, selectedItem } = this.state;
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
        <h2 className="page-title">پیگیری سفارش‌ها</h2>
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
                  name="courier"
                  placeholder="انتخاب واحد ارسال"
                  data={[{ id: null, title: "همه واحد‌های ارسال" }, ...couriers]}
                  autoWidth
                  optionValue="id"
                  optionText="title"
                  onChange={this.selectCourierHandler}
                />
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
    getAssignOrders
  }
)(OrderList);
