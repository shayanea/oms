import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as moment from "moment-jalaali";
import { getOrders } from "../../actions/orderActions";
import City from "../../assets/city.json";
import axios from "../../utils/requestConfig";

import { Layout, Breadcrumb, SearchInput, Table, Form, Notify, Button } from "zent";
import ProductModal from "../../components/order/selectProduct";

moment.loadPersian({ dialect: "persian-modern" });
const { createForm, FormInputField, FormSelectField, FormCheckboxField } = Form;
const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "ویرایش سفارش" }];

class AddOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().format("jYYYY"),
      month: moment().format("jM"),
      day: moment().format("jD"),
      page: {
        pageSize: 10,
        current: 0,
        totalItem: this.props.orders.total
      },
      datasets: [],
      loading: true,
      searchText: "",
      productModalStatus: false,
      selectedCity: null,
      products: [],
      advisers: [],
      selectedProduct: [],
      pageNumber: 1,
      isLoading: false,
      hasHighPriority: false,
      orderObject: {
        adviserId: null,
        deliveryCost: 0,
        totalProductPrices: 0,
        discount: 0,
        finalAmount: 0,
        name: "",
        postalCode: "",
        address: "",
        firstPhoneNumber: "",
        secondPhoneNumber: "",
        deliveryTimeId: null,
        deliveryDate: "",
        notes: "",
        hasHighPriority: false,
        courierId: null
      }
    };
  }

  componentDidMount() {
    this.props.getOrders(this.props.orders.page, this.props.orders.search);
    this.fetchProducts();
    this.fetchAdvisers();
    this.fetchOrderById(this.props.match.params.id);
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
        this.setState({
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
            hasHighPriority: res.data.data.hasHighPriority,
            deliveryCostId: res.data.data.deliveryCostId,
            discount: res.data.data.discount
          },
          day: Number(moment(res.data.data.deliveryDate).jDate()),
          month: Number(moment(res.data.data.deliveryDate).format("jMM")),
          year: Number(moment(res.data.data.deliveryDate).jYear()),
          selectedProduct: array,
          statusId: res.data.data.statusId
        });
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.orders.items !== this.props.orders.items) {
      this.setState({
        page: {
          pageSize: 10,
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

  onSearchChange = evt => {
    this.setState({
      searchText: evt.target.value
    });
  };

  onPressEnter = () => {};

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

  findCityById = id => {
    let result = City.find(item => item.id === id);
    return result ? result.fullName : "";
  };

  calculateDate = (day, month, year) => {
    return moment(`${year}/${month}/${day}}`, "jYYYY/jM/jD").format();
  };

  submit = data => {
    if (this.state.selectedProduct.length) {
      this.setState({ isLoading: true });
      let array = [];
      this.state.selectedProduct.forEach(item => {
        array.push({ productId: item.id, count: item.number });
      });
      axios
        .put(`/orders/${this.props.match.params.id}`, {
          adviserId: data.adviserId,
          deliveryCostId: data.deliveryCostId,
          discount: data.discount === "" ? 0 : data.discount,
          name: data.name,
          cityId: data.cityId,
          postalCode: data.postalCode,
          address: data.address,
          firstPhoneNumber: data.firstPhoneNumber,
          secondPhoneNumber: data.secondPhoneNumber,
          deliveryTimeId: data.deliveryTimeId,
          deliveryDate: this.calculateDate(this.state.day, this.state.month, this.state.year),
          notes: data.notes,
          hasHighPriority: this.state.hasHighPriority,
          products: array,
          statusId: this.state.statusId
        })
        .then(res => {
          this.setState({ isLoading: false, selectedProduct: [], selectedCity: null });
          this.props.zentForm.resetFieldsValue();
          this.props.getOrders(this.props.orders.page, this.props.orders.search);
        })
        .catch(err => {
          Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
          this.setState({ isLoading: false });
        });
    }
  };

  render() {
    const { handleSubmit } = this.props;
    const { year, month, day, searchText, page, datasets, selectedProduct, productModalStatus, products, advisers, isLoading, orderObject } = this.state;
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
              <span className="remove-item" onClick={() => this.removeUser(data.id)} />
              <span className="edit-item" />
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
          return <React.Fragment>{parseFloat(data.price * data.number).toLocaleString("fa")} تومان</React.Fragment>;
        }
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
              <FormSelectField
                name="adviserId"
                placeholder="مشاور"
                autoWidth
                data={advisers}
                optionValue="id"
                optionText="lastName"
                searchPlaceholder="جستجو"
                filter={(item, keyword) => item.lastName.indexOf(keyword) > -1}
                required
                validations={{ required: true }}
                validationErrors={{ required: "مشاور اجباری است." }}
                value={orderObject.adviserId}
              />
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
              <Row>
                <Col className="col-padding" span={12}>
                  <FormInputField name="postalCode" type="text" placeholder="کد پستی" value={orderObject.postalCode} />
                </Col>
                <Col className="col-padding" span={12}>
                  <FormSelectField
                    name="cityId"
                    placeholder="استان و شهرستان"
                    autoWidth
                    data={City}
                    optionValue="id"
                    optionText="fullName"
                    searchPlaceholder="جستجو"
                    onChange={item => this.setState({ selectedCity: item })}
                    filter={(item, keyword) => item.fullName.indexOf(keyword) > -1}
                    required
                    validations={{ required: true }}
                    validationErrors={{ required: "شهر یا استان اجباری است." }}
                    value={orderObject.cityId}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="col-padding" span={12}>
                  <FormInputField
                    name="firstPhoneNumber"
                    type="number"
                    placeholder="شماره تماس ۱"
                    validateOnChange={false}
                    validateOnBlur={false}
                    validations={{
                      required: true
                    }}
                    validationErrors={{
                      required: " شماره تماس ۱ اجباری است."
                    }}
                    value={orderObject.firstPhoneNumber}
                  />
                  <FormInputField name="secondPhoneNumber" type="number" placeholder="شماره تماس ۲" value={orderObject.secondPhoneNumber} />
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
                    value={orderObject.address}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="col-padding" span={12} style={{ display: "flex" }}>
                  <input
                    type="number"
                    className={"custom-input__date"}
                    // defaultValue={year}
                    name="year"
                    min="1397"
                    max="1405"
                    placeholder="سال"
                    onChange={e => this.setState({ year: e.target.value })}
                    value={year}
                  />
                  <input
                    type="number"
                    className={"custom-input__date"}
                    // defaultValue={month}
                    name="month"
                    min="1"
                    max="12"
                    placeholder="ماه"
                    onChange={e => this.setState({ month: e.target.value })}
                    value={month}
                  />
                  <input
                    type="number"
                    className={"custom-input__date"}
                    // defaultValue={day}
                    name="day"
                    min="1"
                    max="31"
                    placeholder="روز"
                    onChange={e => this.setState({ day: e.target.value })}
                    value={day}
                  />
                </Col>
                <Col className="col-padding" span={12}>
                  <FormSelectField
                    name="deliveryTimeId"
                    placeholder="بازه زمانی ارسال"
                    autoWidth
                    data={[
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
                    ]}
                    optionValue="value"
                    optionText="display"
                    required
                    validations={{ required: true }}
                    validationErrors={{
                      required: "بازه زمانی ارسال اجباری است."
                    }}
                    value={orderObject.deliveryTimeId}
                  />
                </Col>
              </Row>
              <FormInputField name="notes" type="textarea" placeholder="توضیحات" value={orderObject.notes} />
              <FormCheckboxField name="hasHighPriority" checked={orderObject.hasHighPriority} onChange={e => this.setState({ isActive: e.target.checked })}>
                ارسال فوری سفارش در الویت ارسال قرار گیرد
              </FormCheckboxField>
              <div className="border-line" />
              <div className="product-list__header">
                <h2>کالا</h2>
                <Button className="add-new__product" type="primary" icon="plus" onClick={this.toggleProductModal}>
                  افزودن کالا
                </Button>
              </div>
              <Table
                emptyLabel={"هیچ کالای در این لیست وجود ندارد."}
                columns={columns2}
                datasets={selectedProduct}
                onChange={this.onProductChange.bind(this)}
                getRowConf={this.getRowConf}
              />
              <div className="product-list__footer">
                <span>مبلغ فاکتور</span>
                <div className="invoice-total">{parseFloat(this.calculateTotalPrice()).toLocaleString("fa")} تومان</div>
              </div>
              <Row>
                <Col span={12} className="col-padding">
                  <FormInputField name="discount" type="text" placeholder="تخفیف" value={orderObject.discount} />
                </Col>
                <Col span={12} className="col-padding">
                  <FormSelectField
                    name="deliveryCostId"
                    label="هزینه حمل"
                    placeholder="هزینه حمل خود را انتخاب نمایید."
                    autoWidth
                    data={[
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
                    ]}
                    optionValue="value"
                    optionText="display"
                    required
                    validations={{ required: true }}
                    validationErrors={{
                      required: "هزینه حمل اجباری است."
                    }}
                    value={orderObject.deliveryCostId}
                  />
                </Col>
              </Row>
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
