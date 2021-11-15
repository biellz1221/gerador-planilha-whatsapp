const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvHeader = [
	{ id: "nome", title: "Nome" },
	{ id: "pnome", title: "PNome" },
	{ id: "email", title: "Email" },
	{ id: "telefone", title: "Telefone" },
	{ id: "pronome", title: "Pronome" },
	{ id: "atendente", title: "Atendente" },
	{ id: "message", title: "Mensagem" },
	{ id: "link", title: "LinkZap" },
];

async function generateCSVFromCSV(rows, csvPath) {
	const outputOptions = {
		path: csvPath,
		header: csvHeader,
	};

	const csvWriter = createCsvWriter(outputOptions);

	await csvWriter.writeRecords(rows);

	console.log("The CSV file was written successfully");
}

module.exports = {
	generateCSVFromCSV,
};
