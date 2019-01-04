const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;
	if (!email || !name || !password) { //Check that the user didn't enter empty strings for name, email, password. If either email, name, or password, ! will cause them to evaluate to true and execute this if statement
		return res.status(400).json('incorrect submission');
	}
	


	const hash = bcrypt.hashSync(password);
	// database.users.push({
	// 	id: '125',
	// 	name: name,
	// 	email: email,
	// 	entries: 0,
	// 	joined: new Date()
	// })
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
					})
					.then(user => {
						res.json(user[0]);
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('unable to register'))
}

module.exports = {
	handleRegister: handleRegister
};