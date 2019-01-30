import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as moment from "moment-jalaali";
import { getOrders } from "../../actions/orderActions";
import City from "../../assets/city.json";

import Data from "../../assets/assign.json";

import { Layout, Breadcrumb, SearchInput, Table, Form, Button } from "zent";
import Modal from "../../components/order/selectProduct";

moment.loadPersian({ dialect: "persian-modern" });
const { createForm, FormInputField, FormSelectField, FormCheckboxField } = Form;
const { Col, Row } = Layout;
const dataList = [{ name: "پیشخوان", href: "/" }, { name: "ثبت سفارش" }];

class AddOrder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			year: moment().format("jYYYY"),
			month: moment().format("jM"),
			day: moment().format("jD"),
			page: {
				pageSize: this.props.orders.size,
				current: 0,
				totalItem: this.props.orders.page
			},
			datasets: Data.reverse(),
			productPage: {
				pageSize: 0,
				current: 0,
				totalItem: 1
			},
			loading: true,
			searchText: "",
			modalStatus: false,
			selectedCity: null,
			selectedProduct: []
		};
	}

	componentDidMount() {
		// this.props.getOrders(
		// 	this.props.orders.size,
		// 	this.props.orders.page,
		// 	this.props.orders.search
		// );
	}

	componentDidUpdate(prevProps) {
		if (prevProps.orders.items !== this.props.orders.items) {
			this.setState({
				page: {
					current: this.props.orders.page,
					totalItem: this.props.orders.size
				},
				loading: this.props.orders.loading,
				datasets: Data
			});
		}
	}

	onChange(conf) {
		this.setState({
			page: {
				pageSize: 10,
				current: conf.current,
				totalItem: this.props.orders.size
			}
		});
		this.props.onPageUpdate(conf.current);
	}

	onSearchChange = evt => {
		this.setState({
			searchText: evt.target.value
		});
	};

	onPressEnter = () => {};

	toggleModal = () => this.setState({ modalStatus: !this.state.modalStatus });

	onSelectProduct = data =>
		this.setState({
			selectedProduct: [...this.state.selectedProduct, data],
			modalStatus: false
		});

	calculateTotalPrice = () => {
		if (this.state.selectedProduct.length) {
			let productTotalAmount = 0;
			this.state.selectedProduct.forEach(
				item => (productTotalAmount += item.total)
			);
			return productTotalAmount;
		}
		return 0;
	};

	submit = data => {
		if (this.state.selectedProduct.length) {
			let item = {
				orderId: this.state.datasets.length + 1,
				lastUpdateDateTime: "2019-01-24T13:45:29.547",
				fullName: data.fullname,
				firstPhoneNumber: data.firstPhoneNumber,
				totalAmount: this.calculateTotalPrice(),
				city: this.state.selectedCity
			};
			this.setState({
				datasets: [item, ...this.state.datasets],
				selectedProduct: [],
				selectedCity: null
			});
			this.props.zentForm.resetFieldsValue();
		}
	};

	render() {
		const { handleSubmit } = this.props;
		const {
			year,
			month,
			day,
			searchText,
			page,
			datasets,
			productPage,
			selectedProduct,
			modalStatus
		} = this.state;
		const columns1 = [
			{
				title: "شماره فاکتور",
				width: "15%",
				name: "orderId"
			},
			{
				title: "نام",
				width: "20%",
				name: "fullName"
			},
			{
				title: "شماره تماس",
				width: "15%",
				name: "firstPhoneNumber"
			},
			{
				title: "استان و شهر",
				width: "25%",
				name: "city"
			},
			{
				title: "مجموع",
				width: "20%",
				bodyRender: data => {
					return (
						<React.Fragment>
							{parseFloat(data.totalAmount).toLocaleString("fa")} تومان
						</React.Fragment>
					);
				}
			},
			{
				title: "عملیات",
				width: "10%",
				bodyRender: data => {
					return (
						<React.Fragment>
							<span className="remove-item" />
							<span className="edit-item" />
						</React.Fragment>
					);
				}
			}
		];
		const columns2 = [
			{
				title: "کالا",
				width: "25%",
				name: "id"
			},
			{
				title: "تعداد",
				width: "25%",
				name: "number"
			},
			{
				title: "قیمت",
				width: "25%",
				bodyRender: data => {
					return (
						<React.Fragment>
							{parseFloat(data.price).toLocaleString("fa")} تومان
						</React.Fragment>
					);
				}
			},
			{
				title: "مجموع",
				width: "25%",
				bodyRender: data => {
					return (
						<React.Fragment>
							{parseFloat(data.total).toLocaleString("fa")} تومان
						</React.Fragment>
					);
				}
			}
		];
		return (
			<div className="container">
				<Breadcrumb breads={dataList} />
				<Row className="grid-layout__container">
					<Col span={12} style={{ padding: "0 15px" }}>
						<SearchInput
							value={searchText}
							onChange={this.onSearchChange}
							placeholder="جستجو"
							onPressEnter={this.onPressEnter}
						/>
						<Table
							emptyLabel={"هیچ سفارشی در این لیست وجود ندارد."}
							columns={columns1}
							datasets={datasets}
							onChange={this.onChange.bind(this)}
							getRowConf={this.getRowConf}
							pageInfo={page}
							rowKey="id"
						/>
					</Col>
					<Col
						span={12}
						style={{
							padding: "15px",
							backgroundColor: "#fff",
							boxShadow: "0 2px 4px 0 #e3e9f3",
							borderRadius: 6
						}}
					>
						<Form
							disableEnterSubmit={false}
							vertical
							className={"add-order__form"}
							onSubmit={handleSubmit(this.submit)}
						>
							<FormInputField
								name="fullname"
								type="text"
								placeholder="نام و نام خانوادگی سفارش دهنده"
								validateOnChange={false}
								validateOnBlur={false}
								validations={{
									required: true
								}}
								validationErrors={{
									required: " نام و نام خانوادگی سفارش دهنده اجباری است."
								}}
							/>
							<Row>
								<Col className="col-padding" span={12}>
									<FormInputField
										name="postalCode"
										type="text"
										placeholder="کد پستی"
									/>
								</Col>
								<Col className="col-padding" span={12}>
									<FormSelectField
										name="city"
										placeholder="استان و شهرستان"
										autoWidth
										data={City}
										optionValue="value"
										optionText="display"
										searchPlaceholder="جستجو"
										onChange={item => this.setState({ selectedCity: item })}
										filter={(item, keyword) => item.value.indexOf(keyword) > -1}
										required
										validations={{ required: true }}
										validationErrors={{ required: "شهر یا استان اجباری است." }}
									/>
								</Col>
							</Row>
							<Row>
								<Col className="col-padding" span={12}>
									<FormInputField
										name="firstPhoneNumber"
										type="number"
										placeholder="شماره تماس ۱"
										validateOnChange={false}
										validateOnBlur={false}
										validations={{
											required: true
										}}
										validationErrors={{
											required: " شماره تماس ۱ اجباری است."
										}}
									/>
									<FormInputField
										name="secondPhoneNumber"
										type="number"
										placeholder="شماره تماس ۲"
									/>
								</Col>
								<Col className="col-padding" span={12}>
									<FormInputField
										name="description"
										type="textarea"
										placeholder="آدرس"
										style={{ height: "90px" }}
										validateOnChange={false}
										validateOnBlur={false}
										validations={{
											required: true
										}}
										validationErrors={{
											required: " آدرس اجباری است."
										}}
									/>
								</Col>
							</Row>
							<Row>
								<Col className="col-padding" span={12}>
									<input
										type="number"
										className={"custom-input__date"}
										defaultValue={year}
										name="year"
										min="1397"
										max="1405"
										placeholder="سال"
									/>
									<input
										type="number"
										className={"custom-input__date"}
										defaultValue={month}
										name="month"
										min="1"
										max="12"
										placeholder="ماه"
									/>
									<input
										type="number"
										className={"custom-input__date"}
										defaultValue={day}
										name="day"
										min="1"
										max="31"
										placeholder="روز"
									/>
								</Col>
								<Col className="col-padding" span={12}>
									<FormSelectField
										name="city"
										placeholder="بازه زمانی ارسال"
										autoWidth
										data={[
											{
												value: "0",
												display: "مهم نیست"
											},
											{
												value: "1",
												display: "ساعت ۹ تا ۱۲"
											},
											{
												value: "2",
												display: "ساعت ۱۲ تا ۱۵"
											},
											{
												value: "3",
												display: "ساعت ۱۵ تا ۱۸"
											},
											{
												value: "4",
												display: "ساعت ۱۸ تا ۲۱"
											}
										]}
										optionValue="value"
										optionText="display"
										required
										validations={{ required: true }}
										validationErrors={{
											required: "بازه زمانی ارسال اجباری است."
										}}
									/>
								</Col>
							</Row>
							<FormInputField
								name="description"
								type="textarea"
								placeholder="توضیحات"
							/>
							<FormCheckboxField name="fastShipping">
								ارسال فوری سفارش در الویت ارسال قرار گیرد
							</FormCheckboxField>
							<div className="border-line" />
							<div className="product-list__header">
								<h2>محصولات</h2>
								<Button
									className="add-new__product"
									type="primary"
									icon="plus"
									onClick={this.toggleModal}
								>
									افزودن محصول
								</Button>
							</div>
							<Table
								emptyLabel={"هیچ محصولی در این لیست وجود ندارد."}
								columns={columns2}
								datasets={selectedProduct}
								onChange={this.onChange.bind(this)}
								getRowConf={this.getRowConf}
								pageInfo={productPage}
							/>
							<div className="product-list__footer">
								<span>مبلغ فاکتور</span>
								<div className="invoice-total">
									{parseFloat(this.calculateTotalPrice()).toLocaleString("fa")}{" "}
									تومان
								</div>
							</div>
							<Row>
								<Col span={12} className="col-padding">
									<FormInputField
										name="discount"
										type="text"
										placeholder="تخفیف"
									/>
								</Col>
								<Col span={12} className="col-padding">
									<FormSelectField
										name="shippingPrice"
										label="هزینه حمل"
										placeholder="هزینه حمل خود ار انتخاب نمایید."
										autoWidth
										data={[
											{
												id: 5,
												value: "رایگان"
											},
											{
												id: 0,
												value: "3 هزار تومان"
											},
											{
												id: 1,
												value: "۱۰ هزار تومان"
											},
											{
												id: 2,
												value: "۱۵ هزار تومان"
											},
											{
												id: 3,
												value: "۳۰ هزار تومان"
											},
											{
												id: 4,
												value: "۵۰ هزار تومان"
											}
										]}
										optionValue="id"
										optionText="value"
										required
										validations={{ required: true }}
										validationErrors={{
											required: "هزینه حمل اجباری است."
										}}
									/>
								</Col>
							</Row>
							<Button
								htmlType="submit"
								className="submit-btn"
								type="primary"
								size="large"
							>
								ثبت سفارش
							</Button>
						</Form>
					</Col>
				</Row>
				<Modal
					onToggleModal={this.toggleModal}
					modalStatus={modalStatus}
					onSelectProduct={this.onSelectProduct}
				/>
			</div>
		);
	}
}

const WrappedForm = createForm()(AddOrder);

const mapStateToProps = state => ({
	orders: state.orders
});

WrappedForm.propTypes = {
	orders: PropTypes.shape({
		isLoading: PropTypes.bool.isRequired,
		items: PropTypes.array.isRequired,
		size: PropTypes.number.isRequired,
		page: PropTypes.number.isRequired,
		search: PropTypes.string.isRequired
	})
};

export default connect(
	mapStateToProps,
	{
		getOrders
	}
)(WrappedForm);
