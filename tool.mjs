import request from 'request';
const day = new Date(getDate()).getTime();
// const day = new Date('2021-1-1').getTime();

function getDate() {
	return new Date().toLocaleDateString();
}
function getTime() {
	return new Date().toTimeString().split(' ')[0];
}
function getStamp() {
	return Date.now();
}
function clone(x) {
	return JSON.parse(JSON.stringify(x));
}
function decodeHTML(str) {
	let trans = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '\"' };
	return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, (all, group1) => { return trans[group1]; });
}
async function getPage(options) {
	return await new Promise((resolve) => {
		options = clone(options);
		options.headers = options.headers || {};
		request(options, async (x, y, z) => {
			resolve(z);
		});
	});
}

export {
	day,
    getPage,
}