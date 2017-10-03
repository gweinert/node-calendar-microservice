import * as express from 'express';
const routes = require('./routes');

const app = express();
const PORT : string | number = process.env.PORT || 5000;

app.use( (req, res, next) => {
	// console.log(req.header);
	const origin = req.get('Origin');
	let allowedOrigin = 'http://localhost:3000';
	if (origin === 'http://thetinytattooshop.com' || origin === 'http://localhost:3000') {
		allowedOrigin = origin;
	}
	res.header('Access-Control-Allow-Origin', allowedOrigin);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	next();
});

app.use('/', routes);

app.listen(PORT);