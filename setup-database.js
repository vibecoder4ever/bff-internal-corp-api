const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./corp_data.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        process.exit(1);
    }
    console.log('Connected to the SQLite database for setup.');
});

// --- Data Arrays ---
const employeesData = [
  { "employeeId": 101, "name": "Alice" }, { "employeeId": 102, "name": "Bob" }, { "employeeId": 103, "name": "Charlie" },
  { "employeeId": 104, "name": "David" }, { "employeeId": 105, "name": "Eve" }, { "employeeId": 106, "name": "Frank" },
  { "employeeId": 107, "name": "Grace" }, { "employeeId": 108, "name": "Heidi" }, { "employeeId": 109, "name": "Ivan" },
  { "employeeId": 110, "name": "Judy" }, { "employeeId": 111, "name": "Mallory" }, { "employeeId": 112, "name": "Oscar" },
  { "employeeId": 113, "name": "Peggy" }, { "employeeId": 114, "name": "Rupert" }, { "employeeId": 115, "name": "Sybil" },
  { "employeeId": 116, "name": "Trent" }, { "employeeId": 117, "name": "Ulysses" }, { "employeeId": 118, "name": "Victor" },
  { "employeeId": 119, "name": "Walter" }, { "employeeId": 120, "name": "Wendy" }
];
const productivityData = [
  { "employeeId": 101, "productivityScore": 85 }, { "employeeId": 102, "productivityScore": 92 }, { "employeeId": 103, "productivityScore": 78 },
  { "employeeId": 104, "productivityScore": 88 }, { "employeeId": 105, "productivityScore": 95 }, { "employeeId": 106, "productivityScore": 81 },
  { "employeeId": 107, "productivityScore": 89 }, { "employeeId": 108, "productivityScore": 76 }, { "employeeId": 109, "productivityScore": 93 },
  { "employeeId": 110, "productivityScore": 84 }, { "employeeId": 111, "productivityScore": 90 }, { "employeeId": 112, "productivityScore": 87 },
  { "employeeId": 113, "productivityScore": 91 }, { "employeeId": 114, "productivityScore": 79 }, { "employeeId": 115, "productivityScore": 96 },
  { "employeeId": 116, "productivityScore": 82 }, { "employeeId": 117, "productivityScore": 94 }, { "employeeId": 118, "productivityScore": 80 },
  { "employeeId": 119, "productivityScore": 86 }, { "employeeId": 120, "productivityScore": 97 }
];
const tasksData = [
  { "employeeId": 101, "tasksCompleted": 15 }, { "employeeId": 102, "tasksCompleted": 18 }, { "employeeId": 103, "tasksCompleted": 12 },
  { "employeeId": 104, "tasksCompleted": 16 }, { "employeeId": 105, "tasksCompleted": 19 }, { "employeeId": 106, "tasksCompleted": 14 },
  { "employeeId": 107, "tasksCompleted": 17 }, { "employeeId": 108, "tasksCompleted": 11 }, { "employeeId": 109, "tasksCompleted": 18 },
  { "employeeId": 110, "tasksCompleted": 15 }, { "employeeId": 111, "tasksCompleted": 17 }, { "employeeId": 112, "tasksCompleted": 16 },
  { "employeeId": 113, "tasksCompleted": 18 }, { "employeeId": 114, "tasksCompleted": 13 }, { "employeeId": 115, "tasksCompleted": 20 },
  { "employeeId": 116, "tasksCompleted": 14 }, { "employeeId": 117, "tasksCompleted": 19 }, { "employeeId": 118, "tasksCompleted": 13 },
  { "employeeId": 119, "tasksCompleted": 16 }, { "employeeId": 120, "tasksCompleted": 20 }
];
const activityData = [
  { "employeeId": 101, "activity": "Logged in", "timestamp": "2026-02-09T10:00:00.000Z" }, { "employeeId": 102, "activity": "Updated a file", "timestamp": "2026-02-09T10:05:00.000Z" },
  { "employeeId": 103, "activity": "Attended a meeting", "timestamp": "2026-02-09T10:15:00.000Z" }, { "employeeId": 104, "activity": "Submitted a report", "timestamp": "2026-02-09T10:20:00.000Z" },
  { "employeeId": 105, "activity": "Logged in", "timestamp": "2026-02-09T10:25:00.000Z" }, { "employeeId": 106, "activity": "Updated a file", "timestamp": "2026-02-09T10:30:00.000Z" },
  { "employeeId": 107, "activity": "Attended a meeting", "timestamp": "2026-02-09T10:35:00.000Z" }, { "employeeId": 108, "activity": "Submitted a report", "timestamp": "2026-02-09T10:40:00.000Z" },
  { "employeeId": 109, "activity": "Logged in", "timestamp": "2026-02-09T10:45:00.000Z" }, { "employeeId": 110, "activity": "Updated a file", "timestamp": "2026-02-09T10:50:00.000Z" },
  { "employeeId": 111, "activity": "Attended a meeting", "timestamp": "2026-02-09T10:55:00.000Z" }, { "employeeId": 112, "activity": "Submitted a report", "timestamp": "2026-02-09T11:00:00.000Z" },
  { "employeeId": 113, "activity": "Logged in", "timestamp": "2026-02-09T11:05:00.000Z" }, { "employeeId": 114, "activity": "Updated a file", "timestamp": "2026-02-09T11:10:00.000Z" },
  { "employeeId": 115, "activity": "Attended a meeting", "timestamp": "2026-02-09T11:15:00.000Z" }, { "employeeId": 116, "activity": "Submitted a report", "timestamp": "2026-02-09T11:20:00.000Z" },
  { "employeeId": 117, "activity": "Logged in", "timestamp": "2026-02-09T11:25:00.000Z" }, { "employeeId": 118, "activity": "Updated a file", "timestamp": "2026-02-09T11:30:00.000Z" },
  { "employeeId": 119, "activity": "Attended a meeting", "timestamp": "2026-02-09T11:35:00.000Z" }, { "employeeId": 120, "activity": "Submitted a report", "timestamp": "2026-02-09T11:40:00.000Z" }
];
const daysInOfficeData = [
  { "employeeId": 101, "daysInOffice": 18 }, { "employeeId": 102, "daysInOffice": 20 }, { "employeeId": 103, "daysInOffice": 15 },
  { "employeeId": 104, "daysInOffice": 19 }, { "employeeId": 105, "daysInOffice": 20 }, { "employeeId": 106, "daysInOffice": 17 },
  { "employeeId": 107, "daysInOffice": 19 }, { "employeeId": 108, "daysInOffice": 14 }, { "employeeId": 109, "daysInOffice": 20 },
  { "employeeId": 110, "daysInOffice": 18 }, { "employeeId": 111, "daysInOffice": 19 }, { "employeeId": 112, "daysInOffice": 18 },
  { "employeeId": 113, "daysInOffice": 20 }, { "employeeId": 114, "daysInOffice": 16 }, { "employeeId": 115, "daysInOffice": 20 },
  { "employeeId": 116, "daysInOffice": 17 }, { "employeeId": 117, "daysInOffice": 20 }, { "employeeId": 118, "daysInOffice": 16 },
  { "employeeId": 119, "daysInOffice": 19 }, { "employeeId": 120, "daysInOffice": 20 }
];
const timeWorkedData = [
  { "employeeId": 101, "averageHoursWorked": 7.5 }, { "employeeId": 102, "averageHoursWorked": 8.2 }, { "employeeId": 103, "averageHoursWorked": 6.8 },
  { "employeeId": 104, "averageHoursWorked": 7.9 }, { "employeeId": 105, "averageHoursWorked": 8.5 }, { "employeeId": 106, "averageHoursWorked": 7.2 },
  { "employeeId": 107, "averageHoursWorked": 8.0 }, { "employeeId": 108, "averageHoursWorked": 6.5 }, { "employeeId": 109, "averageHoursWorked": 8.3 },
  { "employeeId": 110, "averageHoursWorked": 7.7 }, { "employeeId": 111, "averageHoursWorked": 8.1 }, { "employeeId": 112, "averageHoursWorked": 7.8 },
  { "employeeId": 113, "averageHoursWorked": 8.4 }, { "employeeId": 114, "averageHoursWorked": 7.0 }, { "employeeId": 115, "averageHoursWorked": 8.6 },
  { "employeeId": 116, "averageHoursWorked": 7.3 }, { "employeeId": 117, "averageHoursWorked": 8.7 }, { "employeeId": 118, "averageHoursWorked": 6.9 },
  { "employeeId": 119, "averageHoursWorked": 7.6 }, { "employeeId": 120, "averageHoursWorked": 8.8 }
];

db.serialize(() => {
    // Chain of table creation and population
    db.run(`CREATE TABLE IF NOT EXISTS employees (employeeId INTEGER PRIMARY KEY, name TEXT NOT NULL)`, handleErr)
      .run(`CREATE TABLE IF NOT EXISTS productivity (employeeId INTEGER PRIMARY KEY, productivityScore INTEGER, FOREIGN KEY (employeeId) REFERENCES employees(employeeId))`, handleErr)
      .run(`CREATE TABLE IF NOT EXISTS tasks (employeeId INTEGER PRIMARY KEY, tasksCompleted INTEGER, FOREIGN KEY (employeeId) REFERENCES employees(employeeId))`, handleErr)
      .run(`CREATE TABLE IF NOT EXISTS activity (activityId INTEGER PRIMARY KEY AUTOINCREMENT, employeeId INTEGER, activity TEXT, timestamp TEXT, FOREIGN KEY (employeeId) REFERENCES employees(employeeId))`, handleErr)
      .run(`CREATE TABLE IF NOT EXISTS days_in_office (employeeId INTEGER PRIMARY KEY, daysInOffice INTEGER, FOREIGN KEY (employeeId) REFERENCES employees(employeeId))`, handleErr)
      .run(`CREATE TABLE IF NOT EXISTS time_worked (employeeId INTEGER PRIMARY KEY, averageHoursWorked REAL, FOREIGN KEY (employeeId) REFERENCES employees(employeeId))`, handleErr, () => {
        // All tables created, now populate them
        console.log('All tables created or already exist.');
        
        const populateEmployees = db.prepare("INSERT INTO employees (employeeId, name) VALUES (?, ?)");
        employeesData.forEach(emp => populateEmployees.run(emp.employeeId, emp.name));
        populateEmployees.finalize(handleErr);

        const populateProductivity = db.prepare("INSERT INTO productivity (employeeId, productivityScore) VALUES (?, ?)");
        productivityData.forEach(item => populateProductivity.run(item.employeeId, item.productivityScore));
        populateProductivity.finalize(handleErr);

        const populateTasks = db.prepare("INSERT INTO tasks (employeeId, tasksCompleted) VALUES (?, ?)");
        tasksData.forEach(item => populateTasks.run(item.employeeId, item.tasksCompleted));
        populateTasks.finalize(handleErr);

        const populateActivity = db.prepare("INSERT INTO activity (employeeId, activity, timestamp) VALUES (?, ?, ?)");
        activityData.forEach(item => populateActivity.run(item.employeeId, item.activity, item.timestamp));
        populateActivity.finalize(handleErr);

        const populateDaysInOffice = db.prepare("INSERT INTO days_in_office (employeeId, daysInOffice) VALUES (?, ?)");
        daysInOfficeData.forEach(item => populateDaysInOffice.run(item.employeeId, item.daysInOffice));
        populateDaysInOffice.finalize(handleErr);

        const populateTimeWorked = db.prepare("INSERT INTO time_worked (employeeId, averageHoursWorked) VALUES (?, ?)");
        timeWorkedData.forEach(item => populateTimeWorked.run(item.employeeId, item.averageHoursWorked));
        
        // Finalize the last statement and then close the DB in its callback
        populateTimeWorked.finalize((err) => {
            if (err) return console.error('Error finalizing last statement:', err.message);
            console.log('All tables populated.');
            
            db.close((err) => {
                if (err) return console.error('Error closing database', err.message);
                console.log('Database connection closed successfully.');
            });
        });
      });
});

function handleErr(err) {
    if (err) console.error('Database operation failed:', err.message);
}
