import { day, getPage } from "./tool.mjs";

async function _codeforces(username) {
	let count = 25;
	let get = async (from) => {
		return JSON.parse(await getPage({
			url: `https://codeforces.com/api/user.status?handle=${username}&from=${from}&count=${count}`,
			method: 'GET',
		}));
	};
	let check = (content) => {
		return content.status == 'OK' && content.result.length > 0;
	};
	let list = [];
	for (let from = 1, content; check(content = await get(from)); from += count) {
		content = content.result;
		let paused = false;
		for (let submission of content) {
			if (submission.creationTimeSeconds * 1000 < day) {
				paused = true;
				break;
			}
			if (submission.verdict == 'OK') {
				let problem = submission.problem;
				let [id, name] = [(problem.contestId ? problem.contestId : 'acmsguru') + ' ' + problem.index, problem.name];
				list.push(`「Codeforces ${id}」${name}`);
			}
		}
		if (paused) {
			break;
		}
	}
	return list;
}

export {
	_codeforces,
}