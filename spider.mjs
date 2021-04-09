import _ from 'lodash';
import config from './config.json';
import { _uoj, _bzoj } from './uoj.mjs';
import { _loj } from './loj.mjs';
import { _luogu } from './luogu.mjs';
import { _codeforces } from './codeforces.mjs';
import { _vjudge } from './vjudge.mjs';

const enable = config.enable;
const user = config.user[process.argv[2]];
;const onlineJudge = ['uoj', 'loj', 'luogu', 'bzoj', 'codeforces', 'vjudge'];

const spider = {
	uoj: _uoj,
	loj: _loj,
	luogu: _luogu,
	bzoj: _bzoj,
	codeforces: _codeforces,
	vjudge: _vjudge,
};

async function getList(user) {
	let list = {};
	for (let oj of onlineJudge) {
		list[oj] = [];
		if (enable[oj] && user.account[oj]) {
			console.log(`[LOG] fetching ${oj}...`);
			list[oj] = _.uniq(await spider[oj](user.account[oj]));
		}
	}
	console.log();
	console.log('User: ' + user.name);
	let statistics = [];
	for (let oj of onlineJudge) {
		if (list[oj].length > 0) {
			console.log(list[oj].join('\n'));
			statistics.push(oj + ' ' + list[oj].length);
		}
	}
	if (statistics.length == 0) {
		console.log('No problem. ' + (user.special ? user.special : ''));
	} else {
		console.log('Total: ' + statistics.join(' | '));
	}
}

if (user) {
	getList(user);
} else {
	console.log('Cannot find the user.');
}