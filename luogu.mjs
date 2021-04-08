import { day, getPage } from "./tool.mjs";
import config from "./config.json";
const cookie = config.cookie.luogu;

async function _luogu(username) {
	let get = async (page) => {
		let content = await getPage({
			url: `https://www.luogu.com.cn/record/list?user=${username}&page=${page}`,
			method: 'GET',
			headers: {
				cookie: `__client_id=${cookie.__client_id}; _uid=${cookie._uid}`,
			},
		});
		content = content.substr(content.indexOf('JSON.parse(decodeURIComponent('));
		content = content.substr(0, content.indexOf('window._feConfigVersion'));
		return eval(content);
	};
	let check = (content) => {
		return content.code == 200 && content.currentData.records.result.length > 0;
	};
	let list = [];
	for (let content, page = 1; check(content = await get(page)); page++) {
		content = content.currentData.records.result;
		let paused = false;
		for (let submission of content) {
			if (submission.submitTime * 1000 < day) {
				paused = true;
				break;
			}
			if (submission.status == 12) {
				let problem = submission.problem;
				let id = problem.pid;
				let name = problem.title;
				list.push(`[Luogu ${id}] ${name}`);
			}
		}
		if (paused) {
			break;
		}
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 500);
		});
	}
	return list;
}

export {
	_luogu,
}