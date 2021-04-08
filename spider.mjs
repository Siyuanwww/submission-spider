import _ from 'lodash';
import config from './config.json';
import { _uoj, _bzoj } from './uoj.mjs';
import { _loj } from './loj.mjs';
import { _luogu } from './luogu.mjs';
import { _codeforces } from './codeforces.mjs';
import { _vjudge } from './vjudge.mjs';

const enable = config.enable;
const usernameList = config.username;
const specialMessage = config.special;
const onlineJudge = ['UOJ', 'LOJ', 'Luogu', 'BZOJ', 'Codeforces', 'VJudge'];
const user = process.argv.length > 2 ? process.argv[2] : '';

const getSubmission = {
	LOJ: _loj,
	UOJ: _uoj,
	Luogu: _luogu,
	BZOJ: _bzoj,
	Codeforces: _codeforces,
	VJudge: _vjudge,
};

async function getList(user) {
	if (!usernameList[user]) {
		console.log('Error!');
		process.exit(0);
	}
	let username = usernameList[user];
	let list = {};
	for (let oj of onlineJudge) {
		if (enable[oj]) {
			list[oj] = [];
			if (username[oj]) {
				console.log(`[LOG] fetching ${oj}...`);
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
	if (overview.length == 0) {
		console.log(specialMessage[user] ? specialMessage[user] : "No problem.");
	} else {
		console.log('Total: ' + overview.join(' | '));
	}
}

getList(user);