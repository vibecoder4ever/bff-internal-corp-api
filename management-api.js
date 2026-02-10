const router = express.Router();

router.post('/update-data', (req, res) => {
    return res.status(403).send('Internal only');
});

module.exports = router;
