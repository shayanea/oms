import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as moment from "moment-jalaali";
import { getProducts } from "../../actions/productAction";
import axios from "../../utils/requestConfig";

import { Layout, Breadcrumb, Table, Sweetalert, Notify, Button } from "zent";

const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "لیست کالا" }];

class AssingOrder extends Component {
  constructor(props) {
    super(props);
    moment.loadPersian({ dialect: "persian-modern" });
    this.state = {
      page: {
        pageSize: 10,
        current: 0,
        totalItem: this.props.products.total
      },
      datasets: [],
      loading: true,
      modalStatus: false
    };
  }

  componentDidMount() {
    this.props.getProducts(this.props.products.pageNumber, this.props.products.search);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.products.items !== this.props.products.items) {
      this.setState({
        page: {
          pageSize: 10,
          current: this.props.products.pageNumber,
          totalItem: this.props.products.total
        },
        loading: this.props.products.loading,
        datasets: this.props.products.items
      });
      console.log(this.props.products.total);
    }
  }

  onChange(conf) {
    this.setState({
      page: {
        pageSize: 30,
        current: conf.current,
        totalItem: this.props.products.total
      }
    });
    this.props.getProducts(conf.current, this.props.products.search);
  }

  removeProduct = id => {
    Sweetalert.confirm({
      confirmType: "success",
      confirmText: "بله",
      cancelText: "منصرف شدم",
      content: "آیا مطمئن به حذف این کالا هستید ؟",
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
      .delete(`/products/${id}`)
      .then(res => {
        this.props.getProducts(this.props.products.pageNumber, this.props.products.search);
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  render() {
    const { datasets, page } = this.state;
    const columns = [
      {
        title: "عنوان",
        name: "title"
      },
      {
        title: "قیمت",
        name: "price",
        bodyRender: data => {
          return <React.Fragment>{parseFloat(data.price).toLocaleString("fa")} ریال</React.Fragment>;
        }
      },
      {
        title: "کد کالا",
        name: "code"
      },
      {
        title: "موجود",
        name: "isAvailable",
        bodyRender: data => {
          return data.isAvailable ? "موجود" : "نا موجود";
        }
      },
      {
        title: "عملیات",
        width: "15%",
        bodyRender: data => {
          return (
            <React.Fragment>
              <Link to={`/product/edit/${data.id}`}>
                <span className="edit-item" />
              </Link>
              <span className="remove-item" onClick={() => this.removeProduct(data.id)} />
            </React.Fragment>
          );
        }
      }
    ];
    return (
      <div className="container">
        <h2 className="page-title">لیست کالا</h2>
        <div style={{ position: "relative" }}>
          <Breadcrumb breads={dataList} />
          <div onClick={() => this.props.history.goBack()} style={{ position: "absolute", left: "15px", top: "12px", fontSize: "12px", color: "#38f", cursor: "pointer" }}>
            بازگشت
          </div>
        </div>
        <Row className="grid-layout__container">
          <Col span={24}>
            <Table
              emptyLabel={"هیچ آیتمی در این لیست وجود ندارد."}
              columns={columns}
              datasets={datasets}
              onChange={this.onChange.bind(this)}
              getRowConf={this.getRowConf}
              pageInfo={page}
              rowKey="id"
            />
            <Button htmlType="submit" className="submit-btn" type="primary" size="large" style={{ marginTop: "15px" }} onClick={() => this.props.history.push("/product/add")}>
              درج کالا
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  products: state.products
});

AssingOrder.propTypes = {
  products: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired
  })
};

export default connect(
  mapStateToProps,
  {
    getProducts
  }
)(AssingOrder);
