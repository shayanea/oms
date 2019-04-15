import React, { Component } from "react";
import * as moment from "moment-jalaali";
import City from "../../assets/city.json";
import axios from "../../utils/requestConfig";

import { Layout, Breadcrumb, Table, Form, Notify, Button, Sweetalert } from "zent";
import ProductModal from "../../components/order/selectProduct";
import Autocomplete from "../../components/order/autoComplete";

moment.loadPersian({ dialect: "persian-modern" });
const { createForm, FormInputField } = Form;
const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "ویرایش سفارش" }];
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

class EditOrder extends Component {
  constructor(props) {
    super(props);
    this.handleProrityChange = this.handleProrityChange.bind(this);
    this.handlePaidChange = this.handlePaidChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.state = {
      year: moment().format("jYYYY"),
      month: moment().format("jM"),
      day: moment().format("jD"),
      loading: true,
      productModalStatus: false,
      selectedCityName: "",
      selectedCityId: null,
      products: [],
      advisers: [],
      selectedProduct: [],
      pageNumber: 1,
      isLoading: false,
      hasHighPriority: false,
      isPaid: false,
      orderObject: {
        adviserId: "",
        deliveryCost: 0,
        totalProductPrices: 0,
        discount: 0,
        finalAmount: 0,
        name: "",
        postalCode: "",
        address: "",
        firstPhoneNumber: "",
        secondPhoneNumber: "",
        deliveryTimeId: "",
        deliveryCostId: "",
        deliveryDate: "",
        notes: "",
        hasHighPriority: false,
        isPaid: false,
        courierId: null
      }
    };
  }

  componentDidMount() {
    this.fetchProducts();
    this.fetchAdvisers();
    this.fetchOrderById(this.props.match.params.id);
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
        this.setState({ advisers: res.data.data });
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  fetchOrderById = id => {
    return axios
      .get(`/orders/${id}`)
      .then(res => {
        let array = [];
        res.data.data.products.forEach(item => {
          array.push({ id: item.productId, number: item.count, price: item.perUnitPrice });
        });
        console.log(this.findCityIdByName(res.data.data.cityId));
        this.setState({
          loading: false,
          selectedCityId: res.data.data.cityId,
          selectedCityName: this.findCityIdByName(res.data.data.cityId),
          orderObject: {
            adviserId: res.data.data.adviserId,
            name: res.data.data.name,
            cityId: res.data.data.cityId,
            postalCode: res.data.data.postalCode,
            address: res.data.data.address,
            firstPhoneNumber: res.data.data.firstPhoneNumber,
            secondPhoneNumber: res.data.data.secondPhoneNumber,
            deliveryTimeId: res.data.data.deliveryTimeId,
            notes: res.data.data.notes,
            deliveryCostId: res.data.data.deliveryCostId,
            discount: res.data.data.discount
          },
          hasHighPriority: res.data.data.hasHighPriority,
          isPaid: res.data.data.isPaid,
          day: Number(moment(res.data.data.deliveryDate).jDate()),
          month: Number(moment(res.data.data.deliveryDate).format("jMM")),
          year: Number(moment(res.data.data.deliveryDate).jYear()),
          selectedProduct: array,
          statusId: res.data.data.statusId,
          discount: 0
        });
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
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
        totalItem: this.props.orders.total
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

  toggleProductModal = () => this.setState({ productModalStatus: !this.state.productModalStatus });

  onSelectProduct = data =>
    this.setState({
      selectedProduct: [...this.state.selectedProduct, data],
      productModalStatus: false
    });

  calculateTotalPrice = () => {
    if (this.state.selectedProduct.length) {
      let productTotalAmount = 0;
      this.state.selectedProduct.forEach(item => (productTotalAmount += item.number * item.price));
      return productTotalAmount;
    }
    return 0;
  };

  findProductName = id => {
    let result = this.state.products.find(item => item.id === id);
    return result ? result.title : "";
  };

  findCityIdByName = id => {
    let result = City.find(item => item.id === id);
    return result ? result.fullName : "";
  };

  onSelectCity = name => {
    let result = City.find(item => item.fullName === name);
    return result && this.setState({ selectedCityId: result.id, selectedCityName: name });
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
    this.setState({ discount: floatvalue });
  }

  submit = data => {
    if (this.state.selectedProduct.length) {
      this.setState({ isLoading: true });
      let array = [];
      this.state.selectedProduct.forEach(item => {
        array.push({ productId: item.id, count: item.number });
      });
      axios
        .put(`/orders/${this.props.match.params.id}`, {
          adviserId: this.state.orderObject.adviserId,
          deliveryCostId: this.state.orderObject.deliveryCostId,
          discount: this.toEnglishDigits(this.state.discount),
          name: data.name,
          cityId: this.state.selectedCityId,
          postalCode: data.postalCode,
          address: data.address,
          firstPhoneNumber: this.toEnglishDigits(data.firstPhoneNumber),
          secondPhoneNumber: this.toEnglishDigits(data.secondPhoneNumber),
          deliveryTimeId: this.state.orderObject.deliveryTimeId,
          deliveryDate: this.calculateDate(this.state.day, this.state.month, this.state.year),
          notes: data.notes,
          hasHighPriority: this.state.hasHighPriority,
          isPaid: this.state.isPaid,
          products: array,
          statusId: this.state.statusId
        })
        .then(res => {
          console.log("update");
          this.props.history.goBack();
        })
        .catch(err => {
          Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
          this.setState({ isLoading: false });
        });
    }
  };

  render() {
    const { handleSubmit } = this.props;
    const { year, month, day, selectedProduct, productModalStatus, products, advisers, isLoading, orderObject, selectedCityName } = this.state;
    const columns = [
      {
        title: "کالا",
        width: "25%",
        bodyRender: data => {
          return <React.Fragment>{this.findProductName(data.id)}</React.Fragment>;
        }
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
          return <React.Fragment>{parseFloat(data.price * data.number).toLocaleString("fa")} ریال</React.Fragment>;
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
          <Col
            span={24}
            style={{
              padding: "15px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 4px 0 #e3e9f3",
              borderRadius: 6
            }}
          >
            <Form disableEnterSubmit={true} vertical className={"add-order__form"} onSubmit={handleSubmit(this.submit)}>
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
                value={orderObject.name}
              />
              <div className="zent-form__controls" style={{ marginBottom: "10px" }}>
                <div className="zent-input-wrapper" style={{ height: "40px", maxHeight: "46px" }}>
                  <select
                    value={orderObject.adviserId}
                    className="custome-select-input"
                    onChange={e => this.setState({ orderObject: { ...orderObject, adviserId: e.target.value } })}
                  >
                    {advisers.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.firstName} {item.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Row style={{ display: "flex", flexDirection: "row" }}>
                <Col className="col-padding" span={12}>
                  <Autocomplete value={selectedCityName} onSelectCity={this.onSelectCity} />
                </Col>
                <Col className="col-padding" span={12}>
                  <FormInputField name="postalCode" type="text" placeholder="کد پستی" value={orderObject.postalCode} />
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
                    value={orderObject.address}
                  />
                </Col>
                <Col className="col-padding" span={12}>
                  <FormInputField
                    name="firstPhoneNumber"
                    type="text"
                    minlenght="11"
                    maxLength="11"
                    placeholder="شماره تماس ۱"
                    validateOnChange={false}
                    validateOnBlur={false}
                    validations={{
                      required: true,
                      matchRegex: /^[0-9 || {InArabic}&&[^۰-۹]+$/,
                      format(values, value) {
                        return value.length === 11;
                      }
                    }}
                    validationErrors={{
                      required: " شماره تماس ۱ اجباری است.",
                      matchRegex: "شماره تماس باید ۱۱ رقمی باشد."
                    }}
                    value={orderObject.firstPhoneNumber}
                  />
                  <FormInputField name="secondPhoneNumber" minlenght="11" maxLength="11" type="text" placeholder="شماره تماس ۲" value={orderObject.secondPhoneNumber} />
                </Col>
              </Row>
              <Row style={{ display: "flex", flexDirection: "row" }}>
                <Col className="col-padding" span={12}>
                  <div className="zent-form__controls" style={{ marginBottom: "10px" }}>
                    <div className="zent-input-wrapper" style={{ height: "40px", maxHeight: "46px" }}>
                      <select
                        value={orderObject.deliveryTimeId}
                        className="custome-select-input"
                        onChange={e => this.setState({ orderObject: { ...orderObject, deliveryTimeId: e.target.value } })}
                      >
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
                    // defaultValue={year}
                    name="year"
                    min="1397"
                    max="1405"
                    placeholder="سال"
                    onChange={e => this.setState({ year: this.toEnglishDigits(e.target.value) })}
                    value={year}
                  />
                  <input
                    type="text"
                    className={"custom-input__date"}
                    // defaultValue={month}
                    name="month"
                    min="1"
                    max="12"
                    placeholder="ماه"
                    onChange={e => this.setState({ month: this.toEnglishDigits(e.target.value) })}
                    value={month}
                  />
                  <input
                    type="text"
                    className={"custom-input__date"}
                    // defaultValue={day}
                    name="day"
                    min="1"
                    max="31"
                    placeholder="روز"
                    onChange={e => this.setState({ day: this.toEnglishDigits(e.target.value) })}
                    value={day}
                  />
                </Col>
              </Row>
              <FormInputField name="notes" type="textarea" placeholder="توضیحات" value={orderObject.notes} />
              <div className="border-line" />
              <div className="product-list__header">
                <h2>کالا</h2>
                <Button tabIndex="0" className="add-new__product" type="primary" icon="plus" onClick={this.toggleProductModal}>
                  افزودن کالا
                </Button>
              </div>
              <Table
                emptyLabel={"هیچ کالایی در این لیست وجود ندارد."}
                columns={columns}
                datasets={selectedProduct}
                onChange={this.onProductChange.bind(this)}
                getRowConf={this.getRowConf}
              />
              <div className="product-list__footer">
                <span>مبلغ فاکتور</span>
                <div className="invoice-total">{parseFloat(this.calculateTotalPrice()).toLocaleString("fa")} ریال</div>
              </div>
              <Row style={{ display: "flex", flexDirection: "row" }}>
                <Col span={12} className="col-padding">
                  <div className="zent-form__controls" style={{ marginBottom: "10px" }}>
                    <div className="zent-input-wrapper" style={{ height: "40px", maxHeight: "46px" }}>
                      <select
                        value={orderObject.deliveryCostId}
                        className="custome-select-input"
                        onChange={e => this.setState({ orderObject: { ...orderObject, deliveryCostId: e.target.value } })}
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
                          value={orderObject.discount}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <p>{this.state.hasHighPriority}</p>
              {!this.state.loading && (
                <React.Fragment>
                  <div className="zent-form__control-group" style={{ fontSize: "12px" }}>
                    <input
                      tabIndex="0"
                      type="checkbox"
                      defaultChecked={this.state.hasHighPriority}
                      onClick={this.handleProrityChange}
                      name="hasHighPriority"
                      value={this.state.hasHighPriority}
                    />
                    ارسال فوری سفارش در الویت ارسال قرار گیرد
                  </div>
                  <div className="zent-form__control-group" style={{ fontSize: "12px" }}>
                    <input tabIndex="0" type="checkbox" onClick={this.handlePaidChange} defaultChecked={this.state.isPaid} name="isPaid" value={this.state.isPaid} />
                    تسویه شده است
                  </div>
                </React.Fragment>
              )}
              <Button htmlType="submit" className="submit-btn" type="primary" size="large" loading={isLoading}>
                ویرایش سفارش
              </Button>
            </Form>
          </Col>
        </Row>
        <ProductModal onToggleModal={this.toggleProductModal} modalStatus={productModalStatus} onSelectProduct={this.onSelectProduct} products={products} />
      </div>
    );
  }
}

const WrappedForm = createForm()(EditOrder);

export default WrappedForm;
