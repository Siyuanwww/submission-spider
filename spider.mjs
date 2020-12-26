import _ from 'lodash';
import config from './config.json';
import { _uoj, _bzoj } from "./uoj.mjs";
import { _loj } from "./loj.mjs";
import { _luogu } from "./luogu.mjs";
import { _codeforces } from "./codeforces.mjs";

const enable = config.enable;
const username = config.username;
const onlineJudge = ['UOJ', 'LOJ', 'Luogu', 'BZOJ', 'Codeforces'];
const user = process.argv.length > 2 ? process.argv[2] : '';

const getSubmission = {
	LOJ: _loj,
	UOJ: _uoj,
	Luogu: _luogu,
	BZOJ: _bzoj,
	Codeforces: _codeforces,
};

async function getList(username) {
	let list = {};
	for (let oj of onlineJudge) {
		if (enable[oj]) {
			list[oj] = [];
			if (username[oj]) {
				list[oj] = _.uniq(await getSubmission[oj](username[oj]));
			}
		}
	}
	let overview = [];
	for (let oj of onlineJudge) {
		if (enable[oj] && list[oj].length > 0) {
			console.log(list[oj].join('\n'));
			overview.push(oj + ' ' + list[oj].length);
		}
	}
	console.log(overview.length == 0 ? 'No problems.' : 'Total: ' + overview.join(' | '));
}

if (!username[user]) {
	console.log('Error!');
	process.exit(0);
}
getList(username[user]);