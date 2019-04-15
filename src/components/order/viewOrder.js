import React, { Component } from "react";
import { Portal, Layout, Table, Button } from "zent";
import * as moment from "moment-jalaali";

const WrappedPortal = Portal.withNonScrollable(Portal.withESCToClose(Portal));
const { Col, Row } = Layout;
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

class Modal extends Component {
  constructor(props) {
    super(props);
    moment.loadPersian({ dialect: "persian-modern" });
    this.state = {
      item: null
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.infoModalStatus && this.props.infoModalStatus !== prevProps.infoModalStatus) {
      this.setState({ item: this.props.selectedItem });
    }
  }

  findProductName = id => {
    let result = this.props.products.find(item => item.id === id);
    return result ? result.title : "---";
  };

  findDeliveryTime = id => {
    let result = deliveryTimeObject.find(item => item.value === id);
    return result ? result.display : "---";
  };

  findCityById = id => {
    let result = this.props.City.find(item => item.id === id);
    return result ? result.fullName : "---";
  };

  findProductById = id => {
    let product = this.props.products.find(item => item.id === id);
    return product ? product.title : "---";
  };

  print = () => window.print();

  render() {
    const { infoModalStatus, onCloseModal, printable } = this.props;
    const { item } = this.state;
    const columns = [
      {
        title: "کالا",
        width: "25%",
        bodyRender: data => {
          return <React.Fragment>{this.findProductName(data.productId)}</React.Fragment>;
        }
      },
      {
        title: "تعداد",
        width: "25%",
        name: "count"
      },
      {
        title: "قیمت",
        width: "25%",
        bodyRender: data => {
          return <React.Fragment>{parseFloat(data.perUnitPrice).toLocaleString("fa")} ریال</React.Fragment>;
        }
      },
      {
        title: "مجموع",
        width: "25%",
        bodyRender: data => {
          return <React.Fragment>{parseFloat(data.perUnitPrice * data.count).toLocaleString("fa")} ریال</React.Fragment>;
        }
      }
    ];
    return (
      <WrappedPortal
        visible={infoModalStatus}
        onClickAway={onCloseModal}
        onClose={onCloseModal}
        className="layer"
        style={{ background: "rgba(0, 0, 0, 0.2)", zIndex: 100 }}
        useLayerForClickAway
      >
        <div className="add-custom__modal view-order__modal" style={{ minWidth: "750px" }}>
          <div className="add-custom__modal__overlay">
            <h2>مشخصات سفارش</h2>
            {item && (
              <React.Fragment>
                <Row>
                  <Col span={12}>
                    <label>نام</label>
                    <div className="value">{item.name}</div>
                  </Col>
                  <Col span={12}>
                    <label>استان و شهر</label>
                    <div className="value">{this.findCityById(item.cityId)}</div>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <label>شماره تماس 1</label>
                    <div className="value">{item.firstPhoneNumber}</div>
                  </Col>
                  <Col span={12}>
                    <label>شماره تماس 2</label>
                    <div className="value">{item.secondPhoneNumber}</div>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <label>آدرس</label>
                    <div className="value">{item.address}</div>
                  </Col>
                </Row>
                <Row style={{ borderBottom: "0px" }}>
                  <Col span={8}>
                    <label>زمان ارسال</label>
                    <div className="value">{this.findDeliveryTime(item.deliveryTimeId)}</div>
                  </Col>
                  <Col span={8}>
                    <label>تاریخ ارسال</label>
                    <div className="value">
                      {moment(item.deliveryDate)
                        .local()
                        .format("jDD jMMMM jYYYY")}
                    </div>
                  </Col>
                  <Col span={8}>
                    <label>هزینه ارسال</label>
                    <div className="value">{parseFloat(item.deliveryCost).toLocaleString("fa")} ریال</div>
                  </Col>
                </Row>
                <Row style={{ borderBottom: "0px" }}>
                  <Col span={24}>
                    <Table emptyLabel={"هیچ کالایی در این لیست وجود ندارد."} columns={columns} datasets={item.products} />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <label>تاریخ ثبت</label>
                    <div className="value">
                      {moment(item.creationDateTime)
                        .local()
                        .format("jDD jMMMM jYYYY - HH:mm")}
                    </div>
                  </Col>
                  <Col span={12}>
                    <label>مجموع</label>
                    <div className="value">{parseFloat(item.finalAmount).toLocaleString("fa")} ریال</div>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <label>تخفیف</label>
                    <div className="value">{parseFloat(item.discount).toLocaleString("fa")} ریال</div>
                  </Col>
                  <Col span={12}>
                    <div className="zent-form__control-group" style={{ fontSize: "12px", marginBottom: 0, marginTop: "20px" }}>
                      <input disabled readOnly type="checkbox" defaultChecked={item.hasHighPriority} /> ارسال فوری سفارش در الویت ارسال قرار گیرد
                    </div>
                  </Col>
                </Row>
              </React.Fragment>
            )}
            <Button type="default" onClick={onCloseModal} className="zent-btn-default">
              بستن
            </Button>
            {printable && (
              <Button type="primary" onClick={this.print}>
                پرینت
              </Button>
            )}
          </div>
        </div>
      </WrappedPortal>
    );
  }
}

export default Modal;
