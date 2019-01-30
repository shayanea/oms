import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Button, Portal } from "zent";

import Data1 from "../../assets/product.json";

const { FormSelectField, createForm } = Form;

const WrappedPortal = Portal.withNonScrollable(Portal.withESCToClose(Portal));

class Modal extends Component {
	state = {
		number: 1
	};

	submit = data => {
		let result = Data1.find(item => item.title === data.id);
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
			<WrappedPortal
				visible={modalStatus}
				onClickAway={onToggleModal}
				onClose={onToggleModal}
				className="layer"
				style={{ background: "rgba(0, 0, 0, 0.2)" }}
				useLayerForClickAway
			>
				<div className="add-custom__modal">
					<div className="add-custom__modal__overlay">
						<h2>افزودن محصول به سفارش</h2>
						<Form
							disableEnterSubmit={false}
							vertical
							onSubmit={handleSubmit(this.submit)}
						>
							<FormSelectField
								name="id"
								placeholder="انتخاب کالا"
								label="کالا"
								data={Data1}
								autoWidth
								optionValue="title"
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
											type="number"
											className={"custom-input__date zent-input"}
											defaultValue={number}
											onChange={e => this.setState({ number: e.target.value })}
											name="count"
											min="1"
											max="100"
											placeholder="تعداد"
										/>
									</div>
								</div>
							</div>
							<Button
								htmlType="submit"
								className="submit-btn"
								type="primary"
								size="large"
							>
								ثبت محصول
							</Button>
						</Form>
					</div>
				</div>
			</WrappedPortal>
		);
	}
}

const WrappedForm = createForm()(Modal);

export default WrappedForm;
