const express = require("express");

const fs = require("fs");

const csv = require("csv-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");
const _ = require("lodash");

const { removeFile, normalizeRecord } = require("./utils");
const { generateCSVFromCSV } = require("./csvHandlers");

const app = express();

// enable files upload
app.use(
	fileUpload({
		createParentPath: true,
	})
);

//add other middleware
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
	res.status(200).send("Hello World");
});

app.post("/csv", async (req, res) => {
	const { atendente, pronome, message } = req.body;
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
						console.log("CSV file successfully processed");

						await generateCSVFromCSV(rows);

						removeFile(filePath);
					});
			});

			res.status(200).send({
				status: true,
				message: "File is uploaded",
				data: {
					name: originalCSV.name,
					mimetype: originalCSV.mimetype,
					size: originalCSV.size,
				},
			});
		}
	} catch (err) {
		res.status(500).send({ err });
	}
});

const port = process.env.PORT || 3005;

app.listen(port, () => console.log(`App is listening on port ${port}.`));
