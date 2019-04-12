import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import * as moment from "moment-jalaali";
import { getOrders } from "../../actions/orderActions";
import City from "../../assets/city.json";
import axios from "../../utils/requestConfig";
// import CurrencyInput from "react-currency-input";

import { Layout, Breadcrumb, SearchInput, Table, Form, Notify, Button, Sweetalert } from "zent";
import ProductModal from "../../components/order/selectProduct";
import Autocomplete from "../../components/order/autoComplete";

moment.loadPersian({ dialect: "persian-modern" });
const { createForm, FormInputField } = Form;
const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "ثبت سفارش" }];
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
    display: "۵۰.۰۰۰ ریال"
  },
  {
    value: 3,
    display: "۷۰.۰۰۰ ریال"
  },
  {
    value: 4,
    display: "۱۰۰.۰۰۰ ریال"
  },
  {
    value: 5,
    display: "۱۲۰.۰۰۰ ریال"
  },
  {
    value: 6,
    display: "۱۵۰.۰۰۰ ریال"
  },
  {
    value: 7,
    display: "۲۰۰.۰۰۰ ریال"
  },
  {
    value: 8,
    display: "۲۵۰.۰۰۰ ریال"
  },
  {
    value: 9,
    display: "۳۰۰.۰۰۰ ریال"
  }
];

class AddOrder extends Component {
  constructor(props) {
    super(props);
    this.handleProrityChange = this.handleProrityChange.bind(this);
    this.handlePaidChange = this.handlePaidChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.state = {
      year: moment().format("jYYYY"),
      month: moment().format("jM"),
      day: moment().format("jD"),
      page: {
        pageSize: 20,
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
      selectedCity: "",
      products: [],
      advisers: [],
      adviserId: null,
      deliveryTimeId: "1",
      deliveryCostId: "1",
      discount: 0,
      selectedProduct: [],
      pageNumber: 1,
      isLoading: false,
      hasHighPriority: false,
      isPaid: false
    };
  }

  componentDidMount() {
    this.props.getOrders(this.props.orders.page, this.props.orders.search);
    this.fetchProducts();
    this.fetchAdvisers();
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

  fetchAdvisers = () => {
    return axios
      .get(`/advisers`)
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
          pageSize: 20,
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

  toggleProductModal = () => {
    this.deliveryInput.focus();
    this.setState({ productModalStatus: !this.state.productModalStatus });
  };

  onSelectProduct = data => {
    this.deliveryInput.focus();
    this.setState({
      selectedProduct: [...this.state.selectedProduct, data],
      productModalStatus: false
    });
  };

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

  onSelectCity = name => {
    let result = City.find(item => item.fullName === name);
    return result && this.setState({ selectedCity: result.id });
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

  removeProduct = id => {
    let result = this.state.selectedProduct.filter(item => item.id !== id);
    this.setState({ selectedProduct: result });
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
        this.props.getOrders(this.props.orders.page, this.props.orders.search);
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  handleProrityChange({ target }) {
    if (target.checked) {
      target.removeAttribute("checked");
      this.setState({ hasHighPriority: true });
    } else {
      target.setAttribute("checked", true);
      this.setState({ hasHighPriority: false });
    }
  }

  handlePaidChange({ target }) {
    if (target.checked) {
      target.removeAttribute("checked");
      this.setState({ isPaid: true });
    } else {
      target.setAttribute("checked", true);
      this.setState({ isPaid: false });
    }
  }

  handlePriceChange(event, maskedvalue, floatvalue) {
    this.setState({ discount: this.toEnglishDigits(event.target.value) });
  }

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
          discount: this.toEnglishDigits(this.state.discount),
          name: data.name,
          cityId: this.state.selectedCity,
          postalCode: data.postalCode,
          address: data.address,
          firstPhoneNumber: this.toEnglishDigits(data.firstPhoneNumber),
          secondPhoneNumber: this.toEnglishDigits(data.secondPhoneNumber),
          deliveryTimeId: this.state.deliveryTimeId,
          deliveryDate: this.calculateDate(this.state.day, this.state.month, this.state.year),
          notes: data.notes,
          hasHighPriority: this.state.hasHighPriority,
          isPaid: this.state.isPaid,
          products: array
        })
        .then(res => {
          res.data.data["newObject"] = true;
          this.state.datasets.unshift(res.data.data);
          this.setState({
            isLoading: false,
            selectedProduct: [],
            selectedCity: "",
            datasets: this.state.datasets,
            discount: 0,
            deliveryTimeId: "1",
            hasHighPriority: false,
            deliveryCostId: "1"
          });
          this.props.zentForm.resetFieldsValue();
          this.advisersInput.focus();
        })
        .catch(err => {
          Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
          this.setState({ isLoading: false });
        });
    }
  };

  render() {
    const { handleSubmit } = this.props;
    const { year, month, day, searchText, page, datasets, selectedProduct, productModalStatus, products, advisers, isLoading, discount } = this.state;
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
          return <React.Fragment>{parseFloat(data.finalAmount).toLocaleString("fa")} ریال</React.Fragment>;
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
        name: "name"
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
          return <React.Fragment>{parseFloat(data.price).toLocaleString("fa")} ریال</React.Fragment>;
        }
      },
      {
        title: "مجموع",
        width: "25%",
        bodyRender: data => {
          return <React.Fragment>{parseFloat(data.total).toLocaleString("fa")} ریال</React.Fragment>;
        }
      },
      {
        title: "عملیات",
        width: "25%",
        bodyRender: data => {
          return <span className="remove-item" onClick={() => this.removeProduct(data.id)} />;
        }
      }
    ];
    return (
      <div className="container">
        <div style={{ position: "relative" }}>
          <Breadcrumb breads={dataList} />
          <div onClick={() => this.props.history.goBack()} style={{ position: "absolute", left: "15px", top: "12px", fontSize: "12px", color: "#38f", cursor: "pointer" }}>
            بازگشت
          </div>
        </div>
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
            <Form disableEnterSubmit={true} vertical className={"add-order__form"} onSubmit={handleSubmit(this.submit)}>
              <div className="zent-form__controls" style={{ marginBottom: "10px" }}>
                <div className="zent-input-wrapper" style={{ height: "40px", maxHeight: "46px" }}>
                  <select
                    ref={advisersInput => {
                      this.advisersInput = advisersInput;
                    }}
                    defaultValue=""
                    className="custome-select-input"
                    onChange={e => this.setState({ adviserId: e.target.value })}
                  >
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
              <Row style={{ display: "flex", flexDirection: "row" }}>
                <Col className="col-padding" span={12}>
                  <Autocomplete value={""} onSelectCity={this.onSelectCity} />
                </Col>
                <Col className="col-padding" span={12}>
                  <FormInputField name="postalCode" type="text" placeholder="کد پستی" />
                </Col>
              </Row>
              <Row style={{ display: "flex", flexDirection: "row" }}>
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
                <Col className="col-padding" span={12}>
                  <FormInputField
                    name="firstPhoneNumber"
                    type="text"
                    placeholder="شماره تماس ۱"
                    maxLength="11"
                    validateOnChange={false}
                    validateOnBlur={false}
                    validations={{
                      required: true,
                      matchRegex: /^[0-9 || {InArabic}&&[^۰-۹]+$/,
                      maxLength: 11,
                      minLength: 11
                    }}
                    validationErrors={{
                      required: " شماره تماس ۱ اجباری است.",
                      matchRegex: "شماره تماس را درست وارد نمایید.",
                      maxLength: "شماره تماس باید ۱۱ رقمی باشد.",
                      minLength: "شماره تماس باید ۱۱ رقمی باشد."
                    }}
                    required
                  />
                  <FormInputField
                    name="secondPhoneNumber"
                    type="text"
                    placeholder="شماره تماس ۲"
                    maxLength="11"
                    validateOnChange={false}
                    validateOnBlur={false}
                    validations={{
                      matchRegex: /^[0-9 || {InArabic}&&[^۰-۹]+$/,
                      maxLength: 11,
                      minLength: 11
                    }}
                    validationErrors={{
                      matchRegex: "شماره تماس را درست وارد نمایید.",
                      maxLength: "شماره تماس باید ۱۱ رقمی باشد.",
                      minLength: "شماره تماس باید ۱۱ رقمی باشد."
                    }}
                  />
                </Col>
              </Row>
              <Row style={{ display: "flex", flexDirection: "row" }}>
                <Col className="col-padding" span={12}>
                  <div className="zent-form__controls" style={{ marginBottom: "10px" }}>
                    <div className="zent-input-wrapper" style={{ height: "40px", maxHeight: "46px" }}>
                      <select value={this.state.deliveryTimeId} className="custome-select-input" onChange={e => this.setState({ deliveryTimeId: e.target.value })}>
                        {deliveryTimeObject.map(item => (
                          <option key={item.value} value={item.value}>
                            {item.display}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Col>
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
              </Row>
              <FormInputField name="notes" type="textarea" placeholder="توضیحات" />
              <div className="border-line" />
              <div className="product-list__header">
                <h2>کالا</h2>
                <Button tabIndex="0" className="add-new__product" type="primary" icon="plus" onClick={this.toggleProductModal}>
                  افزودن کالا
                </Button>
              </div>
              <Table emptyLabel={"هیچ کالای در این لیست وجود ندارد."} columns={columns2} datasets={selectedProduct} onChange={this.onProductChange.bind(this)} />
              <div className="product-list__footer">
                <span>مبلغ فاکتور</span>
                <div className="invoice-total">{parseFloat(this.calculateTotalPrice()).toLocaleString("fa")} ریال</div>
              </div>
              <Row style={{ display: "flex", flexDirection: "row" }}>
                <Col span={12} className="col-padding">
                  <div className="zent-form__controls" style={{ marginBottom: "10px" }}>
                    <div className="zent-input-wrapper" style={{ height: "40px", maxHeight: "46px" }}>
                      <select
                        ref={deliveryInput => {
                          this.deliveryInput = deliveryInput;
                        }}
                        value={this.state.deliveryCostId}
                        className="custome-select-input"
                        onChange={e => this.setState({ deliveryCostId: e.target.value })}
                      >
                        {deliveryCostObject.map(item => (
                          <option key={item.value} value={item.value}>
                            {item.display}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Col>
                <Col span={12} className="col-padding">
                  <div className="zent-form__control-group ">
                    <label className="zent-form__control-label" />
                    <div className="zent-form__controls">
                      <div className="zent-input-wrapper">
                        <input
                          onChange={e => {
                            this.setState({ discount: e.target.value });
                          }}
                          className="zent-input"
                          placeholder="تخفیف (ریال)"
                          value={discount}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="zent-form__control-group" style={{ fontSize: "12px" }}>
                <input tabIndex="0" type="checkbox" onClick={this.handleProrityChange} name="hasHighPriority" value={this.state.hasHighPriority} /> ارسال فوری سفارش در الویت ارسال
                قرار گیرد
              </div>
              <div className="zent-form__control-group" style={{ fontSize: "12px" }}>
                <input tabIndex="0" type="checkbox" onClick={this.handlePaidChange} name="isPaid" value={this.state.isPaid} /> تسویه شده است
              </div>
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
