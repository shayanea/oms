import React, { Component } from "react";
import { Form, Button, Portal, Notify, Table } from "zent";
import axios from "../../utils/requestConfig";

const { FormInputField, createForm } = Form;

const WrappedPortal = Portal.withNonScrollable(Portal.withESCToClose(Portal));

class AdviserModal extends Component {
  state = {
    isLoading: false,
    datasets: [],
    page: {
      pageSize: 0,
      current: 0,
      totalItem: 1
    }
  };

  componentDidMount() {
    this.fetchAdvisers();
  }

  fetchAdvisers = () => {
    return axios
      .get(`/advisers/profiles`)
      .then(res => {
        this.setState({ datasets: res.data.data });
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      });
  };

  onChange(conf) {
    this.setState({
      page: {
        pageSize: 10,
        current: conf.current,
        totalItem: this.props.orders.size
      }
    });
    this.fetchAdvisers(conf.current);
  }

  submit = data => {
    this.setState({ isLoading: true });
    axios
      .post("/advisers", { firstName: data.firstName, lastName: data.lastName })
      .then(res => {
        let array = this.state.datasets.push(res.data.data);
        this.setState({ isLoading: false, array });
      })
      .catch(err => {
        Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
        this.setState({ isLoading: false });
      });
  };

  render() {
    const columns = [
      {
        title: "نام و نام خانوادگی",
        width: "50%",
        bodyRender: data => {
          return (
            <React.Fragment>
              {data.firstName} {data.lastName}
            </React.Fragment>
          );
        }
      },
      {
        title: "عملیات",
        width: "50%",
        bodyRender: data => {
          return <span className="select-item" onClick={() => this.props.onSelectAdviser(data)} />;
        }
      }
    ];
    const { modalStatus, onToggleModal, handleSubmit } = this.props;
    const { isLoading, datasets, page } = this.state;
    return (
      <WrappedPortal visible={modalStatus} onClickAway={onToggleModal} onClose={onToggleModal} className="layer" style={{ background: "rgba(0, 0, 0, 0.2)" }} useLayerForClickAway>
        <div className="add-custom__modal">
          <div className="add-custom__modal__overlay">
            <h2>افزودن کالا به سفارش</h2>
            <Form className={"adviserForm"} style={{ marginBottom: 15 }} disableEnterSubmit={false} vertical onSubmit={handleSubmit(this.submit)}>
              <FormInputField
                name="firstName"
                type="text"
                placeholder="نام"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  required: true
                }}
                validationErrors={{
                  required: " نام اجباری است."
                }}
              />
              <FormInputField
                name="lastName"
                type="text"
                placeholder="نام خانوادگی"
                validateOnChange={false}
                validateOnBlur={false}
                validations={{
                  required: true
                }}
                validationErrors={{
                  required: " نام خانوادگی اجباری است."
                }}
              />
              <Button htmlType="submit" className="submit-btn" type="primary" size="large" loading={isLoading}>
                ثبت مشاور
              </Button>
            </Form>
            <Table
              className={"adviser-tabel"}
              emptyLabel={"هیچ مشاوری در این لیست وجود ندارد."}
              columns={columns}
              datasets={datasets}
              onChange={this.onChange.bind(this)}
              getRowConf={this.getRowConf}
              pageInfo={page}
            />
          </div>
        </div>
      </WrappedPortal>
    );
  }
}

const WrappedForm = createForm()(AdviserModal);

export default WrappedForm;
