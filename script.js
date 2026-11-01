const students = [
    {
        id: "g2/0619/16",
        name: "Ebrahim Muhye",
        username: "ebrahimmuhye23@gmail.com",
        password: "1234",
        department: "Computer Engineering",
        year: 4,
        semester: 1,
        courses: [
            { name: "Programming", mark: 85, credits: 3 },
            { name: "Data Structure", mark: 78, credits: 4 },
            { name: "Data Base", mark: 82, credits: 5 },
            { name: "Digital Logic", mark: 74, credits: 5 },
            { name: "VLSI", mark: 88, credits: 3 },
            { name: "Introduction of Communication", mark: 91, credits: 6 }
        ]
    }
];

const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-alert");
const dashboard = document.getElementById("dashboard");
const publicContent = document.getElementById("public-content");

let loggedInStudent = null;

function showLoginError(message) {
    loginError.textContent = message;
    loginError.classList.remove("d-none");
}

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const welcomeMessage = document.getElementById("welcome-message");
  
    const enteredUsername = usernameInput.value.trim().toLowerCase();
    const enteredPassword = passwordInput.value;

    const student = students.find(function (student) {
        return (
            student.username === enteredUsername &&
            student.password === enteredPassword
        );
    });

    if (!student) {
        showLoginError("Invalid username or password. Please try again.");
        return;
    }

    loggedInStudent = student;

    loginError.textContent = "";
    loginError.classList.add("d-none");

    loginForm.hidden = true;
    document.getElementById("site-navbar").hidden = true;
    publicContent.hidden = true;
    dashboard.hidden = false;

    welcomeMessage.textContent = `Welcome, ${loggedInStudent.name}!`;
    profileSection.hidden = true;
    gradesSection.hidden = true;
});

function getGrade(mark) {
    if (mark >= 85) return { letter: "A", points: 4.0 };
    if (mark >= 80) return { letter: "A-", points: 3.75 };
    if (mark >= 75) return { letter: "B+", points: 3.5 };
    if (mark >= 70) return { letter: "B", points: 3.0 };
    if (mark >= 65) return { letter: "B-", points: 2.75 };
    if (mark >= 60) return { letter: "C+", points: 2.5 };
    if (mark >= 50) return { letter: "C", points: 2.0 };
    if (mark >= 45) return { letter: "C-", points: 1.25 };
    if (mark >= 40) return { letter: "D", points: 1.0 };
    return { letter: "F", points: 0.0 };
}

function calculateGPA(courses) {
    let totalGradePoints = 0;
    let totalCredits = 0;

    for (const course of courses) {
        const grade = getGrade(course.mark);
        const creditHours = course.credits; // ትክክለኛውን የኮርስ ክሬዲት መጠቀም

        totalGradePoints += grade.points * creditHours;
        totalCredits += creditHours;
    }

    return totalCredits === 0 ? 0 : totalGradePoints / totalCredits;
}

const viewProfileButton = document.getElementById("view-profile");
const viewGradesButton = document.getElementById("view-grades");
const logoutButton = document.getElementById("logout");
const profileSection = document.getElementById("profile-section");
const gradesSection = document.getElementById("grades-section");
const profileContent = document.getElementById("profile-content");
const gradesContent = document.getElementById("grades-content");

viewProfileButton.addEventListener("click", function () {
    if (!loggedInStudent) return;

    const gpa = calculateGPA(loggedInStudent.courses);
    const status = gpa >= 2.0 ? "PASS" : "FAIL";

    const profileDetails = [
        ["Name", loggedInStudent.name],
        ["Student ID", loggedInStudent.id],
        ["Username", loggedInStudent.username],
        ["Department", loggedInStudent.department],
        ["Year", loggedInStudent.year],
        ["Semester", loggedInStudent.semester],
        ["GPA", gpa.toFixed(2)],
        ["Academic Status", status]
    ];

    profileContent.innerHTML = `
        ${profileDetails.map(function (detail) {
            return `
                <p>
                    <strong>${detail[0]}:</strong>${detail[1]}
                </p>
            `;
        }).join("")}
    `;

    profileSection.hidden = false;
    gradesSection.hidden = true;
});

viewGradesButton.addEventListener("click", function () {
    if (!loggedInStudent) return;

    const courses = loggedInStudent.courses;
    const gpa = calculateGPA(courses);
    const status = gpa >= 2.0 ? "PASS" : "FAIL";

    gradesContent.innerHTML = `
        <div class="table-responsive">
            <table class="grades-table table table-bordered">
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Mark</th>
                        <th>Letter Grade</th>
                        <th>Grade Points</th>
                        <th>Credits</th>
                    </tr>
                </thead>
                <tbody>
                    ${courses.map(function (course) {
                        const grade = getGrade(course.mark);
                        return `
                            <tr>
                                <td>${course.name}</td>
                                <td>${course.mark}/100</td>
                                <td>${grade.letter}</td>
                                <td>${grade.points.toFixed(2)}</td>
                                <td>${course.credits}</td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>

        <div class="grades-summary">
            <p>Semester GPA: ${gpa.toFixed(2)}</p>
            <p>Total Courses: ${courses.length}</p>
            <p class="${status === "PASS" ? "text-success" : "text-danger"}">
                Result: ${status}
            </p>
        </div>
    `;

    gradesSection.hidden = false;
    profileSection.hidden = true;
});

logoutButton.addEventListener("click", function () {
    loggedInStudent = null;
    dashboard.hidden = true;
    document.getElementById("site-navbar").hidden = false;
    publicContent.hidden = false;
    loginForm.hidden = false;
    loginForm.reset();

    profileSection.hidden = true;
    gradesSection.hidden = true;
    profileContent.innerHTML = "";
    gradesContent.innerHTML = "";

    loginError.textContent = "";
    loginError.classList.add("d-none");
});