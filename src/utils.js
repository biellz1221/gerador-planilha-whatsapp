const fs = require("fs");
const { formatMessage } = require("./messageHandlers");

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
	let telefone, nome, pnome, link, message;

	telefone = `${row.ddi ? row.ddi : "55"}${row.ddd}${row.telefone}`;

	nome = row.nome
		.toLowerCase()
		.split(" ")
		.map((nome) => capitalizeFirst(nome))
		.join(" ");

	pnome = nome.split(" ")[0];

	message = formatMessage(row.message, {
		"[nome]": nome,
		"[pnome]": pnome,
		"[telefone]": telefone,
		"[pronome]": row.pronome,
		"[atendente]": row.atendente,
		"[email]": row.email,
	});

	link = generateWhatsappLink(telefone, message);

	return {
		nome,
		pnome,
		email: row.email,
		telefone,
		pronome: row.pronome,
		atendente: row.atendente,
		message,
		link,
	};
}

function normalizeHotmartRecord(row) {
	// console.log("HOTMART => ", row);

	// let telefone, nome, pnome, link, message;

	// telefone = `${row.ddi ? row.ddi : "55"}${row.ddd}${row.telefone}`;

	// nome = row.nome
	// 	.toLowerCase()
	// 	.split(" ")
	// 	.map((nome) => capitalizeFirst(nome))
	// 	.join(" ");

	// pnome = nome.split(" ")[0];

	// message = formatMessage(row.message, {
	// 	"[nome]": nome,
	// 	"[pnome]": pnome,
	// 	"[telefone]": telefone,
	// 	"[pronome]": row.pronome,
	// 	"[atendente]": row.atendente,
	// 	"[email]": row.email,
	// });

	// link = generateWhatsappLink(telefone, message);

	// return {
	// 	nome,
	// 	pnome,
	// 	email: row.email,
	// 	telefone,
	// 	pronome: row.pronome,
	// 	atendente: row.atendente,
	// 	message,
	// 	link,
	// };

	return row;
}

function generateWhatsappLink(phone, message) {
	console.log("encodedMSG => ", encodeURIComponent(message));

	return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}

module.exports = {
	removeFile,
	normalizeRecord,
	generateWhatsappLink,
	normalizeHotmartRecord,
};
