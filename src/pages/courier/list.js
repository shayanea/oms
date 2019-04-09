import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getCourier } from "../../actions/courierAction";
import axios from "../../utils/requestConfig";

import { Layout, Breadcrumb, Table, Button, Sweetalert, Notify } from "zent";

const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "لیست واحد‌های ارسال" }];

class CourierList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: {
        pageSize: 10,
        current: 0,
        totalItem: this.props.courier.total
      },
      datasets: [],
      loading: true
    };
  }

  componentDidMount() {
    this.props.getCourier(this.props.courier.pageNumber, this.props.courier.search);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.courier.items !== this.props.courier.items) {
      this.setState({
        page: {
          current: this.props.courier.pageNumber,
          totalItem: this.props.courier.total
        },
        loading: this.props.courier.loading,
        datasets: this.props.courier.items,
        accounts: this.props.courier.accounts
      });
    }
  }

  onChange(conf) {
    this.setState({
      page: {
        pageSize: 10,
        current: conf.current,
        totalItem: this.props.courier.total
      }
    });
    this.props.getCourier(conf.current, this.props.courier.search);
  }

  removeCourier = id => {
    Sweetalert.confirm({
      confirmType: "success",
      confirmText: "بله",
      cancelText: "منصرف شدم",
      content: "آیا مطمیین به حذف این واحد ارسال هستید ؟",
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
      .delete(`/couriers/${id}`)
      .then(res => {
        this.props.getCourier(this.props.courier.pageNumber, this.props.courier.search);
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
        title: "کد",
        name: "code"
      },
      {
        title: "وضعیت فعالیت",
        bodyRender: data => {
          return data.isActive ? "فعال است" : "غیر فعال است";
        }
      },
      {
        title: "عملیات",
        width: "15%",
        bodyRender: data => {
          return (
            <React.Fragment>
              <span className="remove-item" onClick={() => this.removeCourier(data.id)} />
              <Link to={`/courier/edit/${data.id}`}>
                <span className="edit-item" />
              </Link>
            </React.Fragment>
          );
        }
      }
    ];
    return (
      <div className="container">
        <h2 className="page-title">لیست واحد‌های ارسال</h2>
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
            <Button htmlType="submit" className="submit-btn" type="primary" size="large" style={{ marginTop: "15px" }} onClick={() => this.props.history.push("/courier/add")}>
              درج واحد‌ ارسال
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  courier: state.courier
});

CourierList.propTypes = {
  courier: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired
  })
};

export default connect(
  mapStateToProps,
  {
    getCourier
  }
)(CourierList);
