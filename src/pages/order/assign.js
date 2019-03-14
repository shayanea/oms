import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as moment from "moment-jalaali";
import { getNonAssignOrders } from "../../actions/orderActions";
import axios from "../../utils/requestConfig";
import City from "../../assets/city.json";

import { Layout, Breadcrumb, SearchInput, Table, Button, Select, Notify } from "zent";
import AddAssign from "../../components/order/addAssign";

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
      modalStatus: false
    };
  }

  componentDidMount() {
    this.props.getNonAssignOrders(this.props.orders.page, this.props.orders.search);
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
    if (prevProps.orders.items !== this.props.orders.items) {
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

  render() {
    const { searchText, datasets, page, selectedRowKeys, modalStatus, products } = this.state;
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
              <span className="remove-item" onClick={() => this.removeUser(data.id)} />
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
        <h2 className="page-title">انتساب سفارش‌ها</h2>
        <Breadcrumb breads={dataList} />
        <Row className="grid-layout__container">
          <Col span={24}>
            <div className="control-contaianer">
              <div className="right-control">
                <Select
                  name="product"
                  placeholder="انتخاب کالا"
                  data={products}
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
              انتساب به واحد ارسال
            </Button>
          </Col>
        </Row>
        <AddAssign modalStatus={modalStatus} onToggleModal={this.onToggleModal} onSelectUser={this.onSelectUser} selectedRowKeys={selectedRowKeys} />
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
