// console.time('t')
let drawChart;
let wait_on = 2;
chrome.runtime.sendMessage(location.href, function(response) {
	drawChart = `
Highcharts.stockChart('chart_container', {

	chart: {
        backgroundColor: 'rgba( 0, 0, 0, 0.2 )',
        style: {
        	fontFamily: '"Motiva Sans", sans-serif'
        }
    },

	title: {
	    text: document.getElementsByClassName('apphub_AppName')[0].textContent + ' Price History',
	    style: {
	    	color: '#FFFFFF'
	    }
	},

	series: [{
		name: 'Price',
	    data: ${response},
	    color: '#67c1f5',
	    step: true,
	    tooltip: {
	        valueDecimals: 2,
	        valuePrefix: '$'
	    }
	}],

	xAxis: {
		ordinal: false,
		labels: {
			style: {
				color: '#acb2b8',
				fontSize: '12px'
			}
		},
		lineColor: '#626366',
		tickColor: '#626366',
	},

	yAxis: {
		gridLineColor: '#626366',
		gridLineWidth: 0.5,
		labels: {
			style: {
				color: '#acb2b8',
				fontSize: '12px',
			},
			format: '$\{value\}',
		},
		offset: 25,
        tickLength: 25,
	},

	tooltip: {
		backgroundColor: '#000000',
		style: {
			color: '#67c1f5',
		},
		split: false,
		shared: true,
		useHTML: true,
	},

	navigator: {
        series: {
            type: 'area'
        },
    },

    rangeSelector: {
        buttonTheme: {
            fill: "rgba( 103, 193, 245, 0.2 )",
            style: {
                color: "#67c1f5",
            },
            states: {
                select: {
                    fill: "rgb(84, 165, 212)",
                    style: {
                        color: "#ffffff"
                    }
                }
            }
        },
        inputStyle: {
            backgroundColor: "rgba( 103, 193, 245, 0.2 )",
            color: "#acb2b8"
        },
        labelStyle: {
            color: "#acb2b8"
        },
        selected: 1,
        buttons: [{
            type: "month",
            count: 1,
            text: "1m"
        }, {
            type: "month",
            count: 3,
            text: "3m"
        }, {
            type: "month",
            count: 6,
            text: "6m"
        }, {
            type: "year",
            count: 1,
            text: "1y"
        }, {
            type: "year",
            count: 3,
            text: "3y"
        }, {
            type: "all",
            text: "All"
        }],
    },

    credits: {
    	href: 'https://isthereanydeal.com/',
    	text: 'IsThereAnyDeal.com',
    	style: {
			color: '#acb2b8',
		}
    },

});`
	drawChartCounter();
	// console.log(response[0]);
	// console.timeEnd('t');
});
const loc = document.getElementsByClassName('page_content')[2];
loc.insertAdjacentHTML('afterbegin', `
	<div class="steam_price_chart">
		<div id="chart_container" style="height: 400px; min-width: 310px"></div>
	</div>
	`);
const spcDiv = document.getElementsByClassName('steam_price_chart')[0];
const chart = document.getElementsByClassName('chart_container')[0];

function createScript(source, text, loc, option, promise) {
	let newScript = document.createElement('script');
	if (source) newScript.src = source;
	newScript.text = text;
	if (option === 'before') loc.insertBefore(newScript, chart);
	else if (option === 'after') loc.appendChild(newScript);
	if (promise) {
		return new Promise((res, rej) => {
			newScript.onload = function() {
				res();
			}
			newScript.onerror = rej;
		})
	};
}

const src1 = 'https://code.highcharts.com/stock/highstock.js';
createScript(src1, '', document.head, 'after', true)
	.then(drawChartCounter());
// const src2 = 'https://code.highcharts.com/stock/modules/data.js';
// createScript(src2, '', document.head, 'after', true)
// 	.then(drawChartCounter());
// const src3 = 'https://code.highcharts.com/stock/modules/exporting.js';
// createScript(src3, '', document.head, 'after', true)
// 	.then(drawChartCounter());
// const src4 = 'https://code.highcharts.com/stock/modules/export-data.js';
// createScript(src4, '', document.head, 'after', true)
// 	.then(drawChartCounter());

// createScript(src, '', document.head, 'after', true)
// 	.then(() => {
// 		createScript('', drawChart, spcDiv, 'after', false);
// 	});

function drawChartCounter() {
	wait_on--;
	if (wait_on == 0) {
		createScript('', drawChart, spcDiv, 'after', false);
	}
}