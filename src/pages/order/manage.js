import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getAllOrders } from "../../actions/orderActions";
import { json2excel, excel2json } from "js2excel";
import * as moment from "moment-jalaali";
import axios from "../../utils/requestConfig";
import City from "../../assets/city.json";

import { Layout, Breadcrumb, SearchInput, Table, Select, Notify, Sweetalert, Button } from "zent";
import ChangeStatus from "../../components/order/changeStatus";

const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "مدیریت سفارش‌ها" }];

class OrderList extends Component {
  constructor(props) {
    super(props);
    moment.loadPersian({ dialect: "persian-modern" });
    this.state = {
      page: {
        pageSize: 30,
        current: 0,
        totalItem: this.props.orders.total
      },
      datasets: [],
      products: [],
      couriers: [],
      orderProducts: [],
      loading: true,
      searchText: "",
      modalStatus: false,
      selectedCityId: null,
      selectedProductId: null,
      selectedStatusId: null,
      courierId: "",
      selectedRowKeys: []
    };
  }

  componentDidMount() {
    this.props.getAllOrders(this.props.orders.page, this.props.orders.search);
    this.fetchProducts();
    this.fetchCouriers();
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

  fetchCouriers = () => {
    return axios
      .get(`/couriers`)
      .then(res => {
        this.setState({ couriers: res.data.data });
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  fetchOrderProducts = () => {
    if (this.state.datasets.length > 0) {
      let result = this.state.datasets.map(e => e.id).join(",");
      return axios
        .get(`/orderproducts?OrderId=${result}&OrderId_op=in`)
        .then(res => {
          this.setState({ orderProducts: res.data.data });
        })
        .catch(err => {
          Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
        });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.orders.items.length !== this.props.orders.items.length) {
      this.setState(
        {
          page: {
            pageSize: 30,
            current: this.props.orders.page,
            totalItem: this.props.orders.total
          },
          loading: this.props.orders.loading,
          datasets: this.props.orders.items
        },
        this.fetchOrderProducts
      );
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
    this.props.getAllOrders(conf.current, this.props.orders.search);
  }

  onSearchChange = evt => {
    this.setState({
      searchText: evt.target.value
    });
    if (evt.fromClearButton || evt.target.value === "") {
      this.props.getAllOrders(this.props.orders.page, "", this.state.selectedCityId, this.state.selectedProductId, this.state.selectedCourierId);
    }
  };

  onPressEnter = () => {
    if (this.state.searchText !== "") this.props.getAllOrders(this.props.orders.page, "", this.state.selectedCityId, this.state.selectedProductId, this.state.selectedCourierId);
  };

  selectProductHandler = (event, selected) => {
    this.setState({ selectedProductId: selected.value });
    this.props.getAllOrders(this.props.orders.page, this.state.searchText, this.state.selectedCityId, selected.value, this.state.selectedCourierId);
  };

  selectCityHandler = (event, selected) => {
    this.setState({ selectedCityId: selected.value });
    this.props.getAllOrders(this.props.orders.page, this.state.searchText, selected.value, this.state.selectedProductId, this.state.selectedCourierId);
  };

  selectCourierHandler = (event, selected) => {
    this.setState({ selectedCourierId: selected.value });
    this.props.getAllOrders(this.props.orders.page, this.state.searchText, this.state.selectedCityId, this.state.selectedProductId, selected.value);
  };

  selectStatusHandler = (event, selected) => {
    this.setState({ selectedCourierId: selected.value });
    this.props.getAllOrders(
      this.props.orders.page,
      this.state.searchText,
      this.state.selectedCityId,
      this.state.selectedProductId,
      this.state.selectedCourierId,
      this.state.selectedStatusId
    );
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
      case 401:
        return "هماهنگی ارسال برای مشتری";
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
    let result = this.state.orderProducts.find(item => item.orderId === id);
    if (result) {
      let product = this.state.products.find(item => item.id === result.productId);
      return product ? product.title : "";
    }
    return null;
  };

  removeOrder = id => {
    Sweetalert.confirm({
      confirmType: "success",
      confirmText: "بله",
      cancelText: "منصرف شدم",
      content: "آیا مطمیین به حذف این سفارش هستید ؟",
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
    this.props.getAllOrders(this.props.orders.page, this.state.searchText, this.state.selectedCityId, this.state.selectedProductId, this.state.selectedStatusId);
  };

  exoprtExcel = () => {
    try {
      json2excel({
        data: this.state.datasets,
        name: "user-info-data"
        // formateDate: 'yyyy/mm/dd'
      });
    } catch (e) {
      console.error("export error");
    }
  };

  render() {
    const { searchText, datasets, page, products, couriers, selectedRowKeys, modalStatus } = this.state;
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
          return this.findProductById(data.id);
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
          return moment(data.lastUpdateDateTime)
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
          return <React.Fragment>{parseFloat(data.totalProductPrices).toLocaleString("fa")} تومان</React.Fragment>;
        }
      },
      {
        title: "عملیات",
        bodyRender: data => {
          return (
            <React.Fragment>
              <span className="remove-item" onClick={() => this.removeOrder(data.id)} />
              <Link to={`/order/edit/${data.id}`}>
                <span className="edit-item" />
              </Link>
            </React.Fragment>
          );
        }
      }
    ];
    let self = this;
    return (
      <div className="container">
        <h2 className="page-title">مدیریت سفارش‌ها</h2>
        <Breadcrumb breads={dataList} />
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
                  onChange={this.selectStatusHandler}
                />
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
                  filter={(item, keyword) => item.fullName.indexOf(keyword) > -1}
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
            <Button htmlType="submit" className="submit-btn" type="primary" size="large" style={{ marginTop: "15px", marginRight: "15px" }} onClick={this.exoprtExcel}>
              خروجی Excel
            </Button>
          </Col>
        </Row>
        <ChangeStatus modalStatus={modalStatus} onToggleModal={this.onToggleModal} onChangeStatus={this.onChangeStatus} selectedRowKeys={selectedRowKeys} />
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
