import { day, getPage } from "./tool.mjs";

async function _loj(username) {
	let get = async (maxId) => {
		return JSON.parse(await getPage({
			url: 'https://api.loj.ac.cn/api/submission/querySubmission',
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				locale: 'zh_CN',
				maxId: maxId,
				status: "Accepted",
				submitter: username,
				takeCount: 10,
			}),
		}));
	};
	let check = (content) => {
		return !content.error && content.submissions && content.submissions.length > 0;
	};
	let list = [];
	for (let maxId = 1000000000, content; check(content = await get(maxId), day); maxId = parseInt(content[content.length - 1].id) - 1) {
		content = content.submissions;
		let paused = false;
		for (let submission of content) {
			if (new Date(submission.submitTime).getTime() < day) {
				paused = true;
				break;
			}
			let id = submission.problem.displayId;
			let name = submission.problemTitle;
			list.push(`「LOJ ${id}」${name}`);
		}
		if (paused) {
			break;
		}
	}
	return list;
}

export {
	_loj,
}