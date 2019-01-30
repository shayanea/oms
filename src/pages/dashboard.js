import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default class dashboard extends Component {
	// static propTypes = {
	// 	prop: PropTypes
	// };

	render() {
		return (
			<div className="container">
				<div className="report-item__container">
					<div className="report-items__container">
						<p className="report-items__title">تعداد کل سفارش‌ها</p>
						<span className="report-items__value">20</span>
					</div>
					<div className="report-items__container">
						<p className="report-items__title">سفارش‌های تحویل شده</p>
						<span className="report-items__value">10</span>
					</div>
					<div className="report-items__container">
						<p className="report-items__title">سفارش‌های کنسل شده</p>
						<span className="report-items__value">3</span>
					</div>
					<div className="report-items__container">
						<p className="report-items__title">تعداد کالا‌ها</p>
						<span className="report-items__value">100</span>
					</div>
				</div>
				<div className="action-item__container">
					<Link to="/order/add" className="action-items__container">
						<div className="action-items__cover" />
						<span className="action-items__title">ثبت سفارش</span>
					</Link>
					<Link to="/order/assign" className="action-items__container">
						<div className="action-items__cover" />
						<span className="action-items__title">انتصاب سفارش‌ها</span>
					</Link>
					<Link to="/" className="action-items__container">
						<div className="action-items__cover" />
						<span className="action-items__title">پیگیری سفارش</span>
					</Link>
					<Link to="/order/manage" className="action-items__container">
						<div className="action-items__cover" />
						<span className="action-items__title">مدیریت سفارش‌ها</span>
					</Link>
				</div>
				<div className="action-item__container">
					<Link to="/" className="action-items__container">
						<div className="action-items__cover" />
						<span className="action-items__title">ثبت کالا</span>
					</Link>
					<Link to="/" className="action-items__container">
						<div className="action-items__cover" />
						<span className="action-items__title">مدیریت کالا‌ها</span>
					</Link>
				</div>
				<div className="action-item__container">
					<Link to="/" className="action-items__container">
						<div className="action-items__cover" />
						<span className="action-items__title">ثبت واحد ارسال</span>
					</Link>
					<Link to="/" className="action-items__container">
						<div className="action-items__cover" />
						<span className="action-items__title">مدیریت واحد‌ها</span>
					</Link>
					<Link to="/" className="action-items__container">
						<div className="action-items__cover" />
						<span className="action-items__title">گزارش واحد‌ها</span>
					</Link>
				</div>
				<div className="action-item__container">
					<Link to="/" className="action-items__container">
						<div className="action-items__cover" />
						<span className="action-items__title">ثبت کاربر</span>
					</Link>
					<Link to="/" className="action-items__container">
						<div className="action-items__cover" />
						<span className="action-items__title">مدیریت کاربران</span>
					</Link>
				</div>
			</div>
		);
	}
}
