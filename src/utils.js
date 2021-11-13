const fs = require("fs");

function removeFile(path) {
	fs.unlink(path, (err) => {
		if (!err) {
			return console.log(`${path} => File deleted successfully`);
		}
		return console.error(`There was an error deleting the file - ${path}`);
	});
}

function capitalizeFirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function normalizeRecord(row) {
	let telefone, nome, email, pnome, link, pronome, atendente, message;

	email = row.email;

	telefone = `${row.ddi ? row.ddi : "55"}${row.ddd}${row.telefone}`;

	nome = row.nome
		.toLowerCase()
		.split(" ")
		.map((nome) => capitalizeFirst(nome))
		.join(" ");

	pnome = nome.split(" ")[0];

	return {
		pnome,
		nome,
		email,
		telefone,
		pronome,
		atendente,
		link,
		message,
	};
}

function generateWhatsappLink(phone, message) {
	return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}

module.exports = {
	removeFile,
	normalizeRecord,
	generateWhatsappLink,
};
