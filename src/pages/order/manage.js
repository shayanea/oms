import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as moment from "moment-jalaali";
import { getAssignOrders } from "../../actions/orderActions";

import Data from "../../assets/manage.json";
import Data1 from "../../assets/product.json";
import Data2 from "../../assets/city.json";

import { Layout, Breadcrumb, SearchInput, Table, Select } from "zent";

const { Col, Row } = Layout;
const dataList = [
	{ name: "پیشخوان", href: "/" },
	{ name: "مدیریت و پیگیری سفارش‌ها" }
];

class AssingOrder extends Component {
	constructor(props) {
		super(props);
		moment.loadPersian({ dialect: "persian-modern" });
		this.state = {
			page: {
				pageSize: this.props.orders.size,
				current: 0,
				totalItem: this.props.orders.page
			},
			datasets: Data,
			loading: true,
			searchText: "",
			cityId: "",
			statusId: "",
			courierId: ""
		};
	}

	componentDidMount() {
		// this.props.getAssignOrders(
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
		if (evt.fromClearButton || evt.target.value === "")
			this.setState({ datasets: Data });
	};

	onPressEnter = () => {
		let result = this.state.datasets.filter(
			item =>
				item.fullName.includes(this.state.searchText.toLowerCase()) ||
				item.firstPhoneNumber.includes(this.state.searchText.toLowerCase())
		);
		return result ? this.setState({ datasets: result }) : null;
	};

	selectProductHandler = (event, selected) => {
		// this.setState({ productId: selected.value });
		// let result = this.state.datasets.filter(
		// 	item =>
		// 		item.fullName.includes(this.state.searchText.toLowerCase())
		// );
		// return result ? this.setState({ datasets: result }) : null;
	};

	selectCityHandler = (event, selected) => {
		this.setState({ cityId: selected.value });
		if (selected.value !== null) {
			let result = this.state.datasets.filter(item =>
				item.city.includes(selected.display.toLowerCase())
			);
			return result ? this.setState({ datasets: result }) : null;
		} else {
			return this.setState({ datasets: Data });
		}
	};

	selectStatusHandler = (event, selected) => {
		this.setState({ statusId: selected.value });
		if (selected.value !== "همه") {
			let result = this.state.datasets.filter(item =>
				item.status.includes(selected.title.toLowerCase())
			);
			return result ? this.setState({ datasets: result }) : null;
		} else {
			return this.setState({ datasets: Data });
		}
	};

	selectCourierHandler = (event, selected) => {
		this.setState({ courierId: selected.value });
		if (selected.value !== "همه") {
			let result = this.state.datasets.filter(item =>
				item.courier.includes(selected.title.toLowerCase())
			);
			return result ? this.setState({ datasets: result }) : null;
		} else {
			return this.setState({ datasets: Data });
		}
	};

	render() {
		const {
			searchText,
			datasets,
			page,
			cityId,
			courierId,
			statusId
		} = this.state;
		const columns = [
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
				title: "واحد ارسال",
				width: "20%",
				name: "courier"
			},
			{
				title: "وضهیت",
				width: "20%",
				name: "status"
			},
			{
				title: "تاریخ تغییر وضعیت",
				width: "20%",
				name: "changeStatusDate"
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
				title: "تاریخ ثبت",
				width: "25%",
				bodyRender: data => {
					return moment(data.dateTime)
						.local()
						.format("jDD jMMMM jYYYY - HH:mm");
				}
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
				width: "15%",
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
		return (
			<div className="container">
				<h2 className="page-title">مدیریت و پیگیری سفارش‌ها</h2>
				<Breadcrumb breads={dataList} />
				<Row className="grid-layout__container">
					<Col span={24}>
						<div className="control-contaianer">
							<div className="right-control">
								<Select
									name="status"
									value={statusId}
									placeholder="انتخاب وضعیت سفارش"
									data={[
										{ id: 0, title: "همه" },
										{ id: 1, title: "وصول شده" },
										{ id: 2, title: "کنسل شده" },
										{ id: 3, title: "صف ارسال" }
									]}
									autoWidth
									optionValue="id"
									optionText="title"
									onChange={this.selectStatusHandler}
								/>
								<Select
									name="courier"
									value={courierId}
									placeholder="انتخاب واحد ارسال"
									data={[
										{ id: 0, title: "همه" },
										{ id: 1, title: "پایگان" },
										{ id: 1, title: "ندکس" }
									]}
									autoWidth
									optionValue="id"
									optionText="title"
									onChange={this.selectCourierHandler}
								/>
								<Select
									name="product"
									placeholder="انتخاب کالا"
									data={Data1}
									autoWidth
									optionValue="id"
									optionText="title"
									onChange={this.selectProductHandler}
									searchPlaceholder="جستجو"
									filter={(item, keyword) => item.value.indexOf(keyword) > -1}
								/>
								<Select
									name="city"
									value={cityId}
									placeholder="انتخاب شهر یا استان."
									data={[{ value: null, display: "همه شهر‌ها" }, ...Data2]}
									autoWidth
									optionValue="value"
									optionText="display"
									onChange={this.selectCityHandler}
									searchPlaceholder="جستجو"
									filter={(item, keyword) => item.value.indexOf(keyword) > -1}
								/>
							</div>
							<SearchInput
								value={searchText}
								onChange={this.onSearchChange}
								placeholder="جستجو"
								onPressEnter={this.onPressEnter}
							/>
						</div>
						<Table
							emptyLabel={"هیچ آیتمی در این لیست وجود ندارد."}
							columns={columns}
							datasets={datasets}
							onChange={this.onChange.bind(this)}
							getRowConf={this.getRowConf}
							pageInfo={page}
							rowKey="orderId"
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	orders: state.orders
});

AssingOrder.propTypes = {
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
		getAssignOrders
	}
)(AssingOrder);
