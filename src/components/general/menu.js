import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class menu extends Component {
	getActiveMenu = url => {
		return url === this.props.history.pathname;
	};

	render() {
		const { toggle } = this.props;
		return (
			<div className={`menu-container ${toggle && "active"}`}>
				<ul>
					<li>
						<Link to="/" className={`${this.getActiveMenu("/") && "active"}`}>
							پیشخوان
						</Link>
					</li>
					<li>
						<Link
							to="/orders"
							className={`${this.getActiveMenu("/orders") && "active"}`}
						>
							مدیریت سفارش‌ها
						</Link>
					</li>
					<li>
						<Link
							to="/products"
							className={`${this.getActiveMenu("/products") && "active"}`}
						>
							مدیریت کالا‌ها
						</Link>
					</li>
					<li>
						<Link
							to="/users"
							className={`${this.getActiveMenu("/users") && "active"}`}
						>
							مدیریت کاربران
						</Link>
					</li>
					<li>
						<Link
							to="/units"
							className={`${this.getActiveMenu("/units") && "active"}`}
						>
							گزارش واحد‌ها
						</Link>
					</li>
				</ul>
			</div>
		);
	}
}
