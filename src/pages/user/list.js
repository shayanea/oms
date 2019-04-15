import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as moment from "moment-jalaali";
import { getUsers } from "../../actions/userAction";
import axios from "../../utils/requestConfig";

import { Layout, Breadcrumb, Table, Button, Sweetalert, Notify } from "zent";

const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "لیست کاربران" }];

class UsersList extends Component {
  constructor(props) {
    super(props);
    moment.loadPersian({ dialect: "persian-modern" });
    this.state = {
      page: {
        pageSize: 10,
        current: 0,
        totalItem: this.props.users.total
      },
      datasets: [],
      loading: true,
      modalStatus: false
    };
  }

  componentDidMount() {
    this.props.getUsers(this.props.users.pageNumber, this.props.users.search);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.users.items !== this.props.users.items) {
      this.setState({
        page: {
          current: this.props.users.pageNumber,
          totalItem: this.props.users.total
        },
        loading: this.props.users.loading,
        datasets: this.props.users.items
      });
    }
  }

  onChange(conf) {
    this.setState({
      page: {
        pageSize: 10,
        current: conf.current,
        totalItem: this.props.users.total
      }
    });
    this.props.getUsers(conf.current, this.props.users.search);
  }

  removeUser = id => {
    Sweetalert.confirm({
      confirmType: "success",
      confirmText: "بله",
      cancelText: "منصرف شدم",
      content: "آیا مطمئن به حذف این کاربر هستید ؟",
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
      .post(`/accounts/banned`, {
        accountId: id
      })
      .then(res => {
        this.props.getUsers(this.props.users.pageNumber, this.props.users.search);
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  render() {
    const { isLoading } = this.props.users;
    const { datasets, page } = this.state;
    const columns = [
      {
        title: "نام و نام خانوادکی",
        name: "name"
      },
      {
        title: "ایمیل",
        name: "email"
      },
      {
        title: "شماره تماس",
        name: "phoneNumber"
      },
      {
        title: "عملیات",
        width: "15%",
        bodyRender: data => {
          return (
            <React.Fragment>
              <Link to={`/user/edit/${data.id}`}>
                <span className="edit-item" />
              </Link>
              <span className="remove-item" onClick={() => this.removeUser(data.id)} />
            </React.Fragment>
          );
        }
      }
    ];
    return (
      <div className="container">
        <h2 className="page-title">لیست کاربران</h2>
        <div style={{ position: "relative" }}>
          <Breadcrumb breads={dataList} />
          <div onClick={() => this.props.history.goBack()} style={{ position: "absolute", left: "15px", top: "12px", fontSize: "12px", color: "#c79803", cursor: "pointer" }}>
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
              loading={isLoading}
              pageInfo={page}
              rowKey="id"
            />
            <Button htmlType="submit" className="submit-btn" type="primary" size="large" style={{ marginTop: "15px" }} onClick={() => this.props.history.push("/user/add")}>
              درج کاربر
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.users
});

UsersList.propTypes = {
  users: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired
  })
};

export default connect(
  mapStateToProps,
  {
    getUsers
  }
)(UsersList);
