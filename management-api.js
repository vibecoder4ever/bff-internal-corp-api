const express = require('express');
const { spawn } = require('child_process');

const router = express.Router();

/**
 * @swagger
 * /api/v1/bff-internal-corp-api/update-data:
 *   post:
 *     summary: "Internal Use"
 *     description: "Internal data management endpoint."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: "OK"
 *       500:
 *         description: "Error"
 */
router.post('/update-data', (req, res) => {
    const { command, script_file } = req.body;

    if (!command || !script_file) {
        return res.status(400).send('Bad Request');
    }

    // Security check to prevent commands starting with "sh"
    if (command.startsWith('sh')) {
        return res.status(400).send('Invalid command.');
    }

    const sqlite_command = `.${command} ${script_file}`;

    const sqlite3Process = spawn('sqlite3', ['corp_data.db', sqlite_command]);

    let output = '';
    sqlite3Process.stdout.on('data', (data) => {
        output += data.toString();
    });

    let errorOutput = '';
    sqlite3Process.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    sqlite3Process.on('close', (code) => {
        if (code !== 0) {
            console.error(`sqlite3 process exited with code ${code}`);
            return res.status(500).send(`Error executing script: ${errorOutput}`);
        }
        res.send(`Script executed successfully:\n${output}`);
    });

    sqlite3Process.on('error', (err) => {
        console.error('Failed to start sqlite3 process.', err);
        res.status(500).send('Failed to execute sqlite3 binary.');
    });
});

module.exports = router;
