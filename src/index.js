const express = require("express");

const fs = require("fs");

const csv = require("csv-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");
const _ = require("lodash");
const { nanoid } = require("nanoid");
const findRemoveSync = require("find-remove");

const { removeFile, normalizeRecord } = require("./utils");
const { generateCSVFromCSV } = require("./csvHandlers");
const { generateXLSFromCSV } = require("./xlsHandlers");
const app = express();

// const staticFileMiddleware = express.static("/frontend/dist");

app.use(
	fileUpload({
		createParentPath: true,
	})
);

app.use(cors());
app.use(morgan("dev"));

app.use((req, res, next) => {
	//check and delete outputs older than 1 hour
	const result = findRemoveSync("/downloads", {
		age: { seconds: 3600 },
		extensions: [".csv", ".xlsx", ".xls"],
		limit: 100,
	});
	next();
});

app.use("/", express.static(__dirname + "/frontend/dist"));

// app.get("/", (req, res) => {
// 	res.status(200).sendFile("./frontend/dist/index.html");
// });

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/frontend/dist/index.html");
});

app.post("/csv", async (req, res) => {
	const { atendente, pronome, message } = req.body;

	const downloadsPath = `./downloads/${nanoid()}`;
	try {
		if (!req.files) {
			res.status(400).send({
				status: false,
				message: "No file uploaded",
			});
		} else {
			const originalCSV = req.files.csv;

			const filePath = `./temp/${originalCSV.name}`;

			const rows = [];

			await originalCSV.mv(filePath, async (err) => {
				if (err) {
					return res.status(500).send({ err: err });
				}

				fs.createReadStream(filePath)
					.pipe(csv())
					.on("data", (row) => {
						rows.push(
							normalizeRecord({
								...row,
								atendente,
								pronome,
								message,
							})
						);
					})
					.on("end", async () => {
						console.log(`CSV file ${originalCSV.name} successfully processed`);

						const csvPath = `${downloadsPath}-${originalCSV.name}`;

						await generateCSVFromCSV(rows, csvPath);

						removeFile(filePath);

						res.status(200).download(csvPath, (err) => {
							if (err) return res.status(500).send({ err });
						});
					});
			});

			// res.status(200).send({
			// 	status: true,
			// 	message: "File is uploaded",
			// 	data: {
			// 		name: originalCSV.name,
			// 		mimetype: originalCSV.mimetype,
			// 		size: originalCSV.size,
			// 	},
			// });
		}
	} catch (err) {
		res.status(500).send({ err });
	}
});

app.post("/xls", async (req, res) => {
	const { atendente, pronome, message } = req.body;

	const downloadsPath = `./downloads/${nanoid()}`;
	try {
		if (!req.files) {
			res.status(400).send({
				status: false,
				message: "No file uploaded",
			});
		} else {
			const originalCSV = req.files.csv;

			const filePath = `./temp/${originalCSV.name}`;

			const rows = [];

			await originalCSV.mv(filePath, async (err) => {
				if (err) {
					return res.status(500).send({ err: err });
				}

				fs.createReadStream(filePath)
					.pipe(csv())
					.on("data", (row) => {
						rows.push(
							normalizeRecord({
								...row,
								atendente,
								pronome,
								message,
							})
						);
					})
					.on("end", async () => {
						const xlsName = `${originalCSV.name.replace(".csv", ".xlsx")}`;
						const xlsPath = `${downloadsPath}-${xlsName}`;

						console.log(`CSV file ${originalCSV.name} successfully processed`);

						await generateXLSFromCSV(rows, xlsPath, () => {
							res
								.set({
									"X-FILE-NAME": xlsName,
									"Access-Control-Expose-Headers": "X-FILE-NAME",
								})
								.status(200)
								.download(xlsPath, (err) => {
									if (err) return res.status(500).send({ err });
								});
						});

						removeFile(filePath);
					});
			});
		}
	} catch (err) {
		res.status(500).send({ err });
	}
});

const port = 1337;

app.listen(port, () => console.log(`App is listening on port ${port}.`));
