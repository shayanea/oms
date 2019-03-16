import React, { Component } from "react";
import { Form, Button, Portal } from "zent";

const { FormSelectField, createForm } = Form;

const WrappedPortal = Portal.withNonScrollable(Portal.withESCToClose(Portal));

class ProductModal extends Component {
  state = {
    number: 1
  };

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
    let result = this.props.products.find(item => item.id === data.id);
    this.props.onSelectProduct({
      id: data.id,
      number: this.state.number,
      price: result.price,
      total: result.price * Number(this.state.number)
    });
    this.setState({ number: 1 });
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
              <FormSelectField
                name="id"
                placeholder="انتخاب کالا"
                label="کالا"
                data={this.props.products}
                autoWidth
                optionValue="id"
                optionText="title"
                searchPlaceholder="جستجو"
                filter={(item, keyword) => item.value.indexOf(keyword) > -1}
                required
                validations={{ required: true }}
                validationErrors={{
                  required: "انتخاب کالا اجباری است."
                }}
              />
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
                    />
                  </div>
                </div>
              </div>
              <Button htmlType="submit" className="submit-btn" type="primary" size="large">
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
