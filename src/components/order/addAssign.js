import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Button, Portal } from "zent";

const { FormSelectField, createForm } = Form;

const WrappedPortal = Portal.withNonScrollable(Portal.withESCToClose(Portal));

class Modal extends Component {
	submit = data => {
		console.log(data);
		this.props.onSelectUser();
	};

	render() {
		const { modalStatus, onToggleModal, handleSubmit } = this.props;
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
						<h2>درج انتساب</h2>
						<Form
							disableEnterSubmit={false}
							vertical
							onSubmit={handleSubmit(this.submit)}
						>
							<FormSelectField
								name="user"
								placeholder="انتخاب کاربر"
								label="کاربر"
								data={[{ id: 0, title: "ندکس" }, { id: 1, title: "پایگان" }]}
								autoWidth
								optionValue="id"
								optionText="title"
								required
							/>
							<Button
								htmlType="submit"
								className="submit-btn"
								type="primary"
								size="large"
							>
								ثبت انتساب
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
