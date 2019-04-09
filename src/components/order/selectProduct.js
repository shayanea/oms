import React, { Component } from "react";
import { Form, Button, Portal } from "zent";

const { createForm } = Form;

const WrappedPortal = Portal.withNonScrollable(Portal.withESCToClose(Portal));

class ProductModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 1,
      id: null
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.modalStatus && prevProps.modalStatus !== this.props.modalStatus) {
      setTimeout(() => {
        this.productInput.focus();
      }, 500);
    }
  }

  toEnglishDigits(string) {
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

  submit = data => {
    if (this.state.id !== null) {
      let result = this.props.products.find(item => item.id === this.state.id);
      this.props.onSelectProduct({
        id: this.state.id,
        name: result.title,
        number: this.state.number,
        price: result.price,
        total: result.price * Number(this.state.number)
      });
      this.setState({ number: 1 });
    }
  };

  render() {
    const { modalStatus, onToggleModal, handleSubmit } = this.props;
    const { number } = this.state;
    return (
      <WrappedPortal visible={modalStatus} onClickAway={onToggleModal} onClose={onToggleModal} className="layer" style={{ background: "rgba(0, 0, 0, 0.2)" }} useLayerForClickAway>
        <div className="add-custom__modal">
          <div className="add-custom__modal__overlay">
            <h2>افزودن کالا به سفارش</h2>
            <Form disableEnterSubmit={false} vertical onSubmit={handleSubmit(this.submit)}>
              <div className="zent-form__controls" style={{ marginBottom: "10px" }}>
                <div className="zent-input-wrapper" style={{ height: "40px", maxHeight: "46px" }}>
                  <select
                    ref={productInput => {
                      this.productInput = productInput;
                    }}
                    defaultValue=""
                    className="custome-select-input"
                    onChange={e => this.setState({ id: e.target.value })}
                  >
                    {this.props.products.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="zent-form__control-group">
                <label className="zent-form__control-label">
                  <em className="zent-form__required">*</em>
                  تعداد
                </label>
                <div className="zent-form__controls">
                  <div className="zent-input-wrapper">
                    <input
                      type="text"
                      className={"custom-input__date zent-input"}
                      defaultValue={number}
                      onChange={e => this.setState({ number: this.toEnglishDigits(e.target.value) })}
                      name="count"
                      min="1"
                      max="100"
                      placeholder="تعداد"
                      tabIndex="0"
                    />
                  </div>
                </div>
              </div>
              <Button tabIndex="0" htmlType="submit" className="submit-btn" type="primary" size="large">
                ثبت کالا
              </Button>
            </Form>
          </div>
        </div>
      </WrappedPortal>
    );
  }
}

const WrappedForm = createForm()(ProductModal);

export default WrappedForm;
