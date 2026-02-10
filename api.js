const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const db = new sqlite3.Database('./corp_data.db');

/**
 * @swagger
 * /api/v1/bff-internal-corp-api/employees:
 *   get:
 *     summary: Get all employees
 *     description: Returns a list of all employees.
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get('/employees', (req, res) => {
    db.all("SELECT * FROM employees", [], (err, rows) => {
        if (err) {
            res.status(500).json({"error":err.message});
            return;
        }
        res.json(rows);
    });
});

/**
 * @swagger
 * /api/v1/bff-internal-corp-api/employees/{id}:
 *   get:
 *     summary: Get a single employee by ID
 *     description: Returns all available information for a specific employee.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the employee to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A successful response with the employee's data.
 *       404:
 *         description: Employee not found.
 */
router.get('/employees/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT
            e.employeeId,
            e.name,
            p.productivityScore,
            t.tasksCompleted,
            d.daysInOffice,
            tw.averageHoursWorked
        FROM
            employees e
        LEFT JOIN productivity p ON e.employeeId = p.employeeId
        LEFT JOIN tasks t ON e.employeeId = t.employeeId
        LEFT JOIN days_in_office d ON e.employeeId = d.employeeId
        LEFT JOIN time_worked tw ON e.employeeId = tw.employeeId
        WHERE e.employeeId = ?
    `;

    db.get(sql, [id], (err, employee) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        if (!employee) {
            res.status(404).json({ "error": "Employee not found" });
            return;
        }
        db.all("SELECT activity, timestamp FROM activity WHERE employeeId = ?", [id], (err, activities) => {
            if (err) {
                res.status(500).json({ "error": err.message });
                return;
            }
            employee.activities = activities;
            res.json(employee);
        });
    });
});

/**
 * @swagger
 * /api/v1/bff-internal-corp-api/employees/productivity:
 *   get:
 *     summary: Get employee productivity scores
 *     description: Returns a list of employees with their productivity scores.
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get('/employees/productivity', (req, res) => {
    db.all("SELECT * FROM productivity", [], (err, rows) => {
        if (err) {
            res.status(500).json({"error":err.message});
            return;
        }
        res.json(rows);
    });
});

/**
 * @swagger
 * /api/v1/bff-internal-corp-api/employees/tasks-completed:
 *   get:
 *     summary: Get number of tasks completed by employees
 *     description: Returns the number of tasks completed by employees today.
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get('/employees/tasks-completed', (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) {
            res.status(500).json({"error":err.message});
            return;
        }
        res.json(rows);
    });
});

/**
 * @swagger
 * /api/v1/bff-internal-corp-api/employees/recent-activity:
 *   get:
 *     summary: Get recent employee activity
 *     description: Returns a list of recent activities for employees.
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get('/employees/recent-activity', (req, res) => {
    db.all("SELECT * FROM activity", [], (err, rows) => {
        if (err) {
            res.status(500).json({"error":err.message});
            return;
        }
        res.json(rows);
    });
});

/**
 * @swagger
 * /api/v1/bff-internal-corp-api/employees/days-in-office:
 *   get:
 *     summary: Get employee days in office
 *     description: Returns the number of days each employee has been in the office this month.
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get('/employees/days-in-office', (req, res) => {
    db.all("SELECT * FROM days_in_office", [], (err, rows) => {
        if (err) {
            res.status(500).json({"error":err.message});
            return;
        }
        res.json(rows);
    });
});

/**
 * @swagger
 * /api/v1/bff-internal-corp-api/employees/average-time-worked:
 *   get:
 *     summary: Get average time worked per day by employee
 *     description: Returns the average number of hours worked per day for each employee.
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get('/employees/average-time-worked', (req, res) => {
    db.all("SELECT * FROM time_worked", [], (err, rows) => {
        if (err) {
            res.status(500).json({"error":err.message});
            return;
        }
        res.json(rows);
    });
});

module.exports = router;