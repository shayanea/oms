import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as moment from "moment-jalaali";
import { getAdvisers } from "../../actions/adviserAction";
import axios from "../../utils/requestConfig";

import { Layout, Breadcrumb, Table, Button, Sweetalert, Notify } from "zent";

const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "لیست مشاوران" }];

class AdviserList extends Component {
  constructor(props) {
    super(props);
    moment.loadPersian({ dialect: "persian-modern" });
    this.state = {
      page: {
        pageSize: 10,
        current: 0,
        totalItem: this.props.advisers.total
      },
      datasets: [],
      accounts: [],
      loading: true,
      modalStatus: false
    };
  }

  componentDidMount() {
    this.props.getAdvisers(this.props.advisers.pageNumber, this.props.advisers.search);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.advisers.items !== this.props.advisers.items) {
      this.setState({
        page: {
          current: this.props.advisers.pageNumber,
          totalItem: this.props.advisers.total
        },
        loading: this.props.advisers.loading,
        datasets: this.props.advisers.items,
        accounts: this.props.advisers.accounts
      });
    }
  }

  onChange(conf) {
    this.setState({
      page: {
        pageSize: 10,
        current: conf.current,
        totalItem: this.props.advisers.total
      }
    });
    this.props.getAdvisers(conf.current, this.props.advisers.search);
  }

  removeUser = id => {
    Sweetalert.confirm({
      confirmType: "success",
      confirmText: "بله",
      cancelText: "منصرف شدم",
      content: "آیا مطمیین به حذف این مشاور هستید ؟",
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
      .delete(`/advisers/${id}`, { roleIds: [] })
      .then(res => {
        this.props.getAdvisers(this.props.users.pageNumber, this.props.users.search);
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  render() {
    const { datasets, page } = this.state;
    const columns = [
      {
        title: "نام و نام خانوادگی",
        bodyRender: data => {
          return `${data.firstName} ${data.lastName}`;
        }
      },
      {
        title: "فعالیت",
        bodyRender: data => (data.isActive ? "فعال" : "غیر فعال")
      },
      {
        title: "عملیات",
        width: "15%",
        bodyRender: data => {
          return (
            <React.Fragment>
              <span className="remove-item" onClick={() => this.removeUser(data.id)} />
              <Link to={`/adviser/edit/${data.id}`}>
                <span className="edit-item" />
              </Link>
            </React.Fragment>
          );
        }
      }
    ];
    return (
      <div className="container">
        <h2 className="page-title">لیست مشاوران</h2>
        <Breadcrumb breads={dataList} />
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
            <Button htmlType="submit" className="submit-btn" type="primary" size="large" style={{ marginTop: "15px" }} onClick={() => this.props.history.push("/adviser/add")}>
              درج مشاور
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  advisers: state.advisers
});

AdviserList.propTypes = {
  advisers: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired
  })
};

export default connect(
  mapStateToProps,
  {
    getAdvisers
  }
)(AdviserList);
