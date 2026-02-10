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

    return res.status(403).send('Internal only');

});

module.exports = router;
