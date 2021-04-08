import { day, getPage } from "./tool.mjs";
import config from "./config.json";
const cookie = config.cookie.vjudge;

async function _vjudge(username) {
	let get = async (start) => {
		return JSON.parse(await getPage({
			url: `https://vjudge.net/status/data/?draw=1&start=${start}&length=20&un=${username}&OJId=All&probNum=&res=1&language=&onlyFollowee=false`,
			headers: {
				cookie: `JSESSIONID=${cookie.JSESSIONID}`,
			},
			method: 'GET',
		}));
	};
	let check = (content) => {
		return content.data;
	};
	let list = [];
	for (let start = 0, content; check(content = await get(start)); start += 20) {
		content = content.data;
		let paused = false;
		for (let submission of content) {
			if (submission.time < day) {
				paused = true;
				break;
			}
			let oj = submission.oj;
			let id = submission.probNum;
			list.push(`[VJudge] ${oj} ${id}`);
		}
		if (paused) {
			break;
		}
	}
	return list;
}

export {
	_vjudge,
}