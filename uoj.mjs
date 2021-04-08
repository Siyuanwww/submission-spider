import { day, getPage } from "./tool.mjs";

async function _get(username, onlineJudgeUrl, onlineJudgeName) {
	let get = async (page) => {
		let content = await getPage({
			url: `${onlineJudgeUrl}/submissions?submitter=${username}&min_score=100&max_score=100&page=${page}`,
			method: 'GET',
		});
		content = content.substr(content.indexOf('<tbody>'));
		return content;
	};
	let check = (content, page) => {
		return !content.includes('<td colspan="233">无</td>') && (page == 1 || content.includes(`page=${page}\"`));
	}
	let list = [];
	for (let page = 1, content; check(content = await get(page), page); page++) {
		let paused = false;
		for (; content.includes('<a href="/problem/'); ) {
			let p = content.indexOf('<small>') + '<small>'.length;
			let q = content.indexOf('<\/small>', p);
			if (new Date(content.substr(p, q - p)).getTime() < day) {
				paused = true;
				break;
			}
			let s = content.indexOf('">#', content.indexOf('<a href="/problem/')) + '">#'.length;
			let t = content.indexOf('</a>', s);
			let problem = content.substr(s, t - s);
			let id = problem.match(/[0-9]*/).toString();
			let name = problem.substr(id.length + 2);
			list.push(`[${onlineJudgeName} ${id}] ${name}`);
			content = content.substr(q);
		}
		if (paused) {
			break;
		}
	}
	return list;
}
async function _uoj(username) {
	return _get(username, 'https://uoj.ac', 'UOJ');
}
async function _bzoj(username) {
	return _get(username, 'https://darkbzoj.tk', 'BZOJ');
}

export {
	_uoj,
	_bzoj,
}