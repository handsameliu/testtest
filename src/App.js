import React, { Component } from 'react';
import './App.css';
import Charts from './page/Charts';
import { getQueryVariable } from './utils/utils';

class App extends Component {
	render () {
		const props = this.props;
		const querys = getQueryVariable();
		console.log(querys);
		return (
			<div className="App">
				{
					querys && querys.token && querys.key ? (
						<Charts {...props} params={querys} />
					) : (<div>无权限访问！</div>)
				}
				
			</div>
		);
	}
}

export default App;
