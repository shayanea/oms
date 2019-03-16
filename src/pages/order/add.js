import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import * as moment from "moment-jalaali";
import { getOrders } from "../../actions/orderActions";
import City from "../../assets/city.json";
import axios from "../../utils/requestConfig";

import { Layout, Breadcrumb, SearchInput, Table, Form, Notify, Button, Sweetalert } from "zent";
import ProductModal from "../../components/order/selectProduct";

moment.loadPersian({ dialect: "persian-modern" });
const { createForm, FormInputField, FormCheckboxField } = Form;
const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "ثبت سفارش" }];

class AddOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().format("jYYYY"),
      month: moment().format("jM"),
      day: moment().format("jD"),
      page: {
        pageSize: this.props.orders.size,
        current: 0,
        totalItem: this.props.orders.page
      },
      datasets: [],
      productPage: {
        pageSize: 0,
        current: 0,
        totalItem: 1
      },
      loading: true,
      searchText: "",
      productModalStatus: false,
      selectedCity: null,
      products: [],
      advisers: [],
      adviserId: null,
      deliveryTimeId: "1",
      deliveryCostId: "1",
      selectedProduct: [],
      pageNumber: 1,
      isLoading: false,
      showAutoComplete: false,
      autoCompleteResult: []
    };
  }

  componentDidMount() {
    this.props.getOrders(this.props.orders.page, this.props.orders.search);
    this.fetchProducts();
    this.fetchAdvisers();
  }

  fetchProducts = (page = 1) => {
    return axios
      .get(`/products?_pageNumber=${page}&_pageSize=5`)
      .then(res => {
        this.setState({ products: res.data.data });
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  fetchAdvisers = (page = 1) => {
    return axios
      .get(`/advisers?_pageNumber=${page}&_pageSize=5`)
      .then(res => {
        this.setState({ advisers: res.data.data, adviserId: res.data.data[0].id });
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.orders.items !== this.props.orders.items) {
      this.setState({
        page: {
          current: this.props.orders.page,
          totalItem: this.props.orders.size
        },
        loading: this.props.orders.loading,
        datasets: this.props.orders.items
      });
    }

    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchOrderById(this.props.match.params.id);
    }
  }

  searchForCity = data => {
    if (data.length > 3) {
      return axios
        .get(`cities?Name=${data}&Name_op=has`)
        .then(res => {
          this.setState({ autoCompleteResult: res.data.data, showAutoComplete: true });
        })
        .catch(err => this.setState({ showAutoComplete: false, autoCompleteResult: [] }));
    }
  };

  toEnglishDigits(string) {
    string = typeof string === "number" ? JSON.stringify(string) : string;
    var e = "۰".charCodeAt(0);
    string = string.replace(/[۰-۹]/g, function(t) {
      return t.charCodeAt(0) - e;
    });
    e = "٠".charCodeAt(0);
    string = string.replace(/[٠-٩]/g, function(t) {
      return t.charCodeAt(0) - e;
    });
    return string;
  }

  onChange(conf) {
    this.setState({
      page: {
        pageSize: 10,
        current: conf.current,
        totalItem: this.props.orders.size
      }
    });
    this.props.getOrders(conf.current, this.props.orders.search);
  }

  onProductChange(conf) {
    this.setState({
      page: {
        pageSize: 10,
        current: conf.current,
        totalItem: this.props.orders.size
      }
    });
    this.props.fetchProducts(conf.current);
  }

  onSearchChange = evt => {
    this.setState({
      searchText: evt.target.value
    });
  };

  onPressEnter = () => {
    this.props.getOrders(this.props.orders.page, this.state.searchText);
  };

  toggleProductModal = () => this.setState({ productModalStatus: !this.state.productModalStatus });

  onSelectProduct = data =>
    this.setState({
      selectedProduct: [...this.state.selectedProduct, data],
      productModalStatus: false
    });

  calculateTotalPrice = () => {
    if (this.state.selectedProduct.length) {
      let productTotalAmount = 0;
      this.state.selectedProduct.forEach(item => (productTotalAmount += item.total));
      return productTotalAmount;
    }
    return 0;
  };

  findCityById = id => {
    let result = City.find(item => item.id === id);
    return result ? result.fullName : "";
  };

  calculateDate = (day, month, year) => {
    return moment(`${year}/${month}/${day}}`, "jYYYY/jM/jD").format();
  };

  getRowConf(data, index) {
    return {
      canSelect: 0,
      rowClass: data.newObject ? `new-row` : ``
    };
  }

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
        this.props.getOrders(this.props.orders.page, this.props.orders.search);
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  submit = data => {
    if (this.state.selectedProduct.length && this.state.adviserId !== null && this.state.deliveryTimeId !== null && this.state.deliveryCostId !== null) {
      this.setState({ isLoading: true });
      let array = [];
      this.state.selectedProduct.forEach(item => {
        array.push({ productId: item.id, count: item.number });
      });
      axios
        .post("/orders", {
          adviserId: this.state.adviserId,
          deliveryCostId: this.state.deliveryCostId,
          discount: data.discount === "" ? 0 : this.toEnglishDigits(data.discount),
          name: data.name,
          cityId: this.state.selectedCity,
          postalCode: data.postalCode,
          address: data.address,
          firstPhoneNumber: this.toEnglishDigits(data.firstPhoneNumber),
          secondPhoneNumber: this.toEnglishDigits(data.secondPhoneNumber),
          deliveryTimeId: this.state.deliveryTimeId,
          deliveryDate: this.calculateDate(this.state.day, this.state.month, this.state.year),
          notes: data.notes,
          hasHighPriority: data.hasHighPriority === "" || data.hasHighPriority === false ? false : true,
          products: array
        })
        .then(res => {
          res.data.data["newObject"] = true;
          this.state.datasets.Unshift(res.data.data);
          this.setState({ isLoading: false, selectedProduct: [], selectedCity: null, datasets: this.state.datasets });
          this.props.zentForm.resetFieldsValue();
        })
        .catch(err => {
          Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
          this.setState({ isLoading: false });
        });
    }
  };

  render() {
    const { handleSubmit } = this.props;
    const { year, month, day, searchText, page, datasets, selectedProduct, productModalStatus, products, advisers, isLoading, showAutoComplete, autoCompleteResult } = this.state;
    const columns1 = [
      {
        title: "شماره فاکتور",
        width: "15%",
        name: "id"
      },
      {
        title: "نام",
        width: "20%",
        name: "name"
      },
      {
        title: "شماره تماس",
        width: "15%",
        name: "firstPhoneNumber"
      },
      {
        title: "استان و شهر",
        width: "25%",
        bodyRender: data => {
          return this.findCityById(data.cityId);
        }
      },
      {
        title: "مجموع",
        width: "20%",
        bodyRender: data => {
          return <React.Fragment>{parseFloat(data.totalProductPrices).toLocaleString("fa")} تومان</React.Fragment>;
        }
      },
      {
        title: "عملیات",
        width: "10%",
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
    const columns2 = [
      {
        title: "کالا",
        width: "25%",
        name: "id"
      },
      {
        title: "تعداد",
        width: "25%",
        name: "number"
      },
      {
        title: "قیمت",
        width: "25%",
        bodyRender: data => {
          return <React.Fragment>{parseFloat(data.price).toLocaleString("fa")} تومان</React.Fragment>;
        }
      },
      {
        title: "مجموع",
        width: "25%",
        bodyRender: data => {
          return <React.Fragment>{parseFloat(data.total).toLocaleString("fa")} تومان</React.Fragment>;
        }
      }
    ];
    const deliveryTimeObject = [
      {
        value: "1",
        display: "مهم نیست"
      },
      {
        value: "2",
        display: "ساعت ۹ تا ۱۲"
      },
      {
        value: "3",
        display: "ساعت ۱۲ تا ۱۵"
      },
      {
        value: "4",
        display: "ساعت ۱۵ تا ۱۸"
      },
      {
        value: "5",
        display: "ساعت ۱۸ تا ۲۱"
      }
    ];
    const deliveryCostObject = [
      {
        value: 1,
        display: "رایگان"
      },
      {
        value: 2,
        display: "3 هزار تومان"
      },
      {
        value: 3,
        display: "۱۰ هزار تومان"
      },
      {
        value: 4,
        display: "۱۵ هزار تومان"
      },
      {
        value: 5,
        display: "۳۰ هزار تومان"
      },
      {
        value: 6,
        display: "۵۰ هزار تومان"
      }
    ];
    return (
      <div className="container">
        <Breadcrumb breads={dataList} />
        <Row className="grid-layout__container">
          <Col span={12} style={{ padding: "0 15px" }}>
            <SearchInput value={searchText} onChange={this.onSearchChange} placeholder="جستجو" onPressEnter={this.onPressEnter} />
            <Table
              emptyLabel={"هیچ آیتمی در این لیست وجود ندارد."}
              columns={columns1}
              datasets={datasets}
              onChange={this.onChange.bind(this)}
              getRowConf={this.getRowConf}
              pageInfo={page}
              rowKey="id"
            />
          </Col>
          <Col
            span={12}
            style={{
              padding: "15px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 4px 0 #e3e9f3",
              borderRadius: 6
            }}
          >
            <Form disableEnterSubmit={false} vertical className={"add-order__form"} onSubmit={handleSubmit(this.submit)}>
              <div className="zent-form__controls" style={{ marginBottom: "10px" }}>
                <div className="zent-input-wrapper" style={{ height: "40px", maxHeight: "46px" }}>
                  <select autoFocus defaultValue="" className="custome-select-input" onChange={e => this.setState({ adviserId: e.target.value })}>
                    {advisers.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.firstName} {item.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <FormInputField
                name="name"
                type="text"
                placeholder="نام و نام خانوادگی سفارش دهنده"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  required: true
                }}
                validationErrors={{
                  required: " نام و نام خانوادگی سفارش دهنده اجباری است."
                }}
              />
              <Row>
                <Col className="col-padding" span={12}>
                  <FormInputField name="postalCode" type="text" placeholder="کد پستی" />
                </Col>
                <Col className="col-padding" span={12}>
                  <div className="zent-form__controls" style={{ marginBottom: "10px" }}>
                    <div className="zent-input-wrapper" style={{ height: "40px", maxHeight: "46px" }}>
                      <input
                        ref={searchInput => {
                          this.searchInput = searchInput;
                        }}
                        className="zent-input"
                        type="text"
                        placeholder="استان و شهرستان"
                        onChange={e => this.searchForCity(e.target.value)}
                      />
                      {showAutoComplete && (
                        <div className="autocomplete-result">
                          {autoCompleteResult.map(item => (
                            <div
                              key={item.id}
                              onClick={() => {
                                this.searchInput.value = item.fullName;
                                this.setState({ selectedCity: item.id, showAutoComplete: false });
                              }}
                            >
                              {item.fullName}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="col-padding" span={12}>
                  <FormInputField
                    name="firstPhoneNumber"
                    type="text"
                    placeholder="شماره تماس ۱"
                    validateOnChange={false}
                    validateOnBlur={false}
                    validations={{
                      required: true
                    }}
                    validationErrors={{
                      required: " شماره تماس ۱ اجباری است."
                    }}
                  />
                  <FormInputField name="secondPhoneNumber" type="text" placeholder="شماره تماس ۲" />
                </Col>
                <Col className="col-padding" span={12}>
                  <FormInputField
                    name="address"
                    type="textarea"
                    placeholder="آدرس"
                    style={{ height: "90px" }}
                    validateOnChange={false}
                    validateOnBlur={false}
                    validations={{
                      required: true
                    }}
                    validationErrors={{
                      required: " آدرس اجباری است."
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="col-padding" span={12} style={{ display: "flex" }}>
                  <input
                    type="text"
                    className={"custom-input__date"}
                    defaultValue={year}
                    name="year"
                    min="1397"
                    max="1405"
                    placeholder="سال"
                    onChange={e => this.setState({ year: this.toEnglishDigits(e.target.value) })}
                  />
                  <input
                    type="text"
                    className={"custom-input__date"}
                    defaultValue={month}
                    name="month"
                    min="1"
                    max="12"
                    placeholder="ماه"
                    onChange={e => this.setState({ month: this.toEnglishDigits(e.target.value) })}
                  />
                  <input
                    type="text"
                    className={"custom-input__date"}
                    defaultValue={day}
                    name="day"
                    min="1"
                    max="31"
                    placeholder="روز"
                    onChange={e => this.setState({ day: this.toEnglishDigits(e.target.value) })}
                  />
                </Col>
                <Col className="col-padding" span={12}>
                  <div className="zent-form__controls" style={{ marginBottom: "10px" }}>
                    <div className="zent-input-wrapper" style={{ height: "40px", maxHeight: "46px" }}>
                      <select defaultValue="" className="custome-select-input" onChange={e => this.setState({ deliveryTimeId: e.target.value })}>
                        {deliveryTimeObject.map(item => (
                          <option key={item.value} value={item.value}>
                            {item.display}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Col>
              </Row>
              <FormInputField name="notes" type="textarea" placeholder="توضیحات" />
              <div className="border-line" />
              <div className="product-list__header">
                <h2>کالا</h2>
                <Button className="add-new__product" type="primary" icon="plus" onClick={this.toggleProductModal}>
                  افزودن کالا
                </Button>
              </div>
              <Table emptyLabel={"هیچ کالای در این لیست وجود ندارد."} columns={columns2} datasets={selectedProduct} onChange={this.onProductChange.bind(this)} />
              <div className="product-list__footer">
                <span>مبلغ فاکتور</span>
                <div className="invoice-total">{parseFloat(this.calculateTotalPrice()).toLocaleString("fa")} تومان</div>
              </div>
              <Row>
                <Col span={12} className="col-padding">
                  <FormInputField name="discount" type="text" placeholder="تخفیف" />
                </Col>
                <Col span={12} className="col-padding">
                  <div className="zent-form__controls" style={{ marginBottom: "10px" }}>
                    <div className="zent-input-wrapper" style={{ height: "40px", maxHeight: "46px" }}>
                      <select defaultValue="" className="custome-select-input" onChange={e => this.setState({ deliveryCostId: e.target.value })}>
                        {deliveryCostObject.map(item => (
                          <option key={item.value} value={item.value}>
                            {item.display}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Col>
              </Row>
              <FormCheckboxField name="hasHighPriority">ارسال فوری سفارش در الویت ارسال قرار گیرد</FormCheckboxField>
              <Button htmlType="submit" className="submit-btn" type="primary" size="large" loading={isLoading}>
                ثبت سفارش
              </Button>
            </Form>
          </Col>
        </Row>
        <ProductModal onToggleModal={this.toggleProductModal} modalStatus={productModalStatus} onSelectProduct={this.onSelectProduct} products={products} />
      </div>
    );
  }
}

const WrappedForm = createForm()(AddOrder);

const mapStateToProps = state => ({
  orders: state.orders
});

WrappedForm.propTypes = {
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
    getOrders
  }
)(WrappedForm);
