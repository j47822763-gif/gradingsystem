const content = document.getElementById("content");

const SUBJECTS = [
    "English",
    "Mathematics",
    "Science",
    "Filipino",
    "Araling Panlipunan",
    "MAPEH"
];

let students = JSON.parse(localStorage.getItem("gt_students") || "[]");

function save() {
    localStorage.setItem("gt_students", JSON.stringify(students));
}

function modal(student = null) {

    const s = student || {
        studentId: "",
        name: "",
        gradeLevel: "Grade 7",
        section: "A",
        gender: "",
        schoolYear: "2026-2027"
    };

    document.body.insertAdjacentHTML("beforeend", `
        <div class="modal-backdrop show" id="studentModal">

            <div class="modal">

                <div class="modal-head">
                    <h3>${student ? "Edit Student" : "Add Student"}</h3>

                    <button
                        class="modal-close"
                        type="button"
                        onclick="closeModal()">
                        ×
                    </button>
                </div>

                <form id="studentForm">

                    <div class="modal-body">

                        <div class="grid-2">

                            <!-- Student ID -->
                            <div class="field">

                                <label>Student ID *</label>

                                <input
                                    name="studentId"
                                    value="${GT.esc(s.studentId)}"
                                    placeholder="e.g. 2026-0001"
                                    maxlength="30"
                                    required
                                >

                                <div
                                    id="studentIdError"
                                    class="form-error hidden"
                                    style="margin-top:7px;">
                                </div>

                            </div>

                            <!-- Full Name -->
                            <div class="field">

                                <label>Full Name *</label>

                                <input
                                    name="name"
                                    value="${GT.esc(s.name)}"
                                    placeholder="Enter full name"
                                    required
                                >

                            </div>

                            <!-- Grade Level -->
                            <div class="field">

                                <label>Grade Level *</label>

                                <select name="gradeLevel">

                                    ${
                                        [
                                            "Grade 7",
                                            "Grade 8",
                                            "Grade 9",
                                            "Grade 10",
                                            "Grade 11",
                                            "Grade 12"
                                        ]
                                        .map(x => `
                                            <option
                                                ${x === s.gradeLevel ? "selected" : ""}>
                                                ${x}
                                            </option>
                                        `)
                                        .join("")
                                    }

                                </select>

                            </div>

                            <!-- Section -->
                            <div class="field">

                                <label>Section *</label>

                                <input
                                    name="section"
                                    value="${GT.esc(s.section)}"
                                    placeholder="e.g. A"
                                    required
                                >

                            </div>

                            <!-- Gender -->
                            <div class="field">

                                <label>Gender</label>

                                <select name="gender">

                                    <option value="">Select</option>

                                    <option
                                        value="Male"
                                        ${s.gender === "Male" ? "selected" : ""}>
                                        Male
                                    </option>

                                    <option
                                        value="Female"
                                        ${s.gender === "Female" ? "selected" : ""}>
                                        Female
                                    </option>

                                </select>

                            </div>

                            <!-- School Year -->
                            <div class="field">

                                <label>School Year</label>

                                <input
                                    name="schoolYear"
                                    value="${GT.esc(s.schoolYear)}"
                                    placeholder="e.g. 2026-2027"
                                >

                            </div>

                        </div>

                    </div>

                    <div class="modal-foot">

                        <button
                            type="button"
                            class="btn btn-secondary"
                            onclick="closeModal()">
                            Cancel
                        </button>

                        <button
                            type="submit"
                            class="btn btn-primary">
                            Save Student
                        </button>

                    </div>

                </form>

            </div>

        </div>
    `);

    const form = document.getElementById("studentForm");

    const studentIdInput =
        form.querySelector('[name="studentId"]');

    const studentIdError =
        document.getElementById("studentIdError");


    /*
    |--------------------------------------------------------------------------
    | Student ID Validation While Typing
    |--------------------------------------------------------------------------
    */

    studentIdInput.addEventListener("input", () => {

        studentIdError.classList.add("hidden");
        studentIdError.textContent = "";

        studentIdInput.style.borderColor = "";

    });


    /*
    |--------------------------------------------------------------------------
    | Form Submit
    |--------------------------------------------------------------------------
    */

    form.onsubmit = e => {

        e.preventDefault();

        const f = new FormData(form);

        const data = Object.fromEntries(f.entries());


        /*
        |--------------------------------------------------------------------------
        | Normalize Student ID
        |--------------------------------------------------------------------------
        */

        const studentId =
            data.studentId
                .trim()
                .toUpperCase();


        /*
        |--------------------------------------------------------------------------
        | Check Empty Student ID
        |--------------------------------------------------------------------------
        */

        if (!studentId) {

            studentIdError.textContent =
                "Student ID is required.";

            studentIdError.classList.remove("hidden");

            studentIdInput.style.borderColor = "#c43b4b";

            studentIdInput.focus();

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Duplicate Student ID Validation
        |--------------------------------------------------------------------------
        |
        | When editing:
        | The current student's own ID is allowed.
        |
        | When adding:
        | Any existing matching ID is rejected.
        |
        */

        const duplicate = students.find(existingStudent => {

            const existingId =
                String(existingStudent.studentId || "")
                    .trim()
                    .toUpperCase();

            return (
                existingId === studentId &&
                (!student ||
                    existingStudent.uid !== student.uid)
            );

        });


        /*
        |--------------------------------------------------------------------------
        | Duplicate Found
        |--------------------------------------------------------------------------
        */

        if (duplicate) {

            studentIdError.textContent =
                `Student ID "${studentId}" is already registered. Please use a different Student ID.`;

            studentIdError.classList.remove("hidden");

            studentIdInput.style.borderColor = "#c43b4b";

            studentIdInput.focus();

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Clear Validation Error
        |--------------------------------------------------------------------------
        */

        studentIdError.classList.add("hidden");

        studentIdError.textContent = "";

        studentIdInput.style.borderColor = "";


        /*
        |--------------------------------------------------------------------------
        | Save Normalized Student ID
        |--------------------------------------------------------------------------
        */

        data.studentId = studentId;


        /*
        |--------------------------------------------------------------------------
        | Update Existing Student
        |--------------------------------------------------------------------------
        */

        if (student) {

            Object.assign(student, data);

        }

        /*
        |--------------------------------------------------------------------------
        | Add New Student
        |--------------------------------------------------------------------------
        */

        else {

            data.uid = crypto.randomUUID();

            data.subjects = SUBJECTS.map(name => ({
                name: name,
                q1: "",
                q2: "",
                q3: "",
                q4: "",
                final: ""
            }));

            students.push(data);

        }


        /*
        |--------------------------------------------------------------------------
        | Save
        |--------------------------------------------------------------------------
        */

        save();

        closeModal();

        render();

        window.GT.toast(
            student
                ? "Student updated successfully"
                : "Student added successfully"
        );

    };

}


window.closeModal = () => {

    document
        .getElementById("studentModal")
        ?.remove();

};


/*
|--------------------------------------------------------------------------
| Delete Student
|--------------------------------------------------------------------------
*/

function del(id) {

    const s = students.find(
        x => x.uid === id
    );

    if (!s) return;


    if (
        confirm(
            `Delete ${s.name}? This will also delete the student's grades.`
        )
    ) {

        students =
            students.filter(
                x => x.uid !== id
            );

        save();

        render();

        GT.toast("Student deleted");

    }

}


/*
|--------------------------------------------------------------------------
| Render Students
|--------------------------------------------------------------------------
*/

function render(filter = "") {

    content.innerHTML = `

        <div class="page-head">

            <div>

                <h2>Students</h2>

                <p>
                    Manage your student master list and academic profiles.
                </p>

            </div>

            <button
                class="btn btn-primary"
                onclick="modal()">
                ＋ Add Student
            </button>

        </div>


        <div class="toolbar">

            <input
                class="search"
                id="search"
                placeholder="Search by student ID or name..."
                value="${GT.esc(filter)}"
            >

            <select id="gradeFilter">

                <option value="">
                    All Grade Levels
                </option>

                ${
                    [
                        "Grade 7",
                        "Grade 8",
                        "Grade 9",
                        "Grade 10",
                        "Grade 11",
                        "Grade 12"
                    ]
                    .map(x => `
                        <option value="${x}">
                            ${x}
                        </option>
                    `)
                    .join("")
                }

            </select>

        </div>


        <div class="panel">

            <div class="table-wrap">

                <table>

                    <thead>

                        <tr>

                            <th>Student</th>
                            <th>Grade / Section</th>
                            <th>Gender</th>
                            <th>School Year</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody id="studentRows"></tbody>

                </table>

            </div>

        </div>

    `;


    const draw = () => {

        const q =
            document
                .getElementById("search")
                .value
                .toLowerCase();

        const gf =
            document
                .getElementById("gradeFilter")
                .value;


        const list =
            students.filter(s => {

                const studentName =
                    String(s.name || "")
                        .toLowerCase();

                const studentId =
                    String(s.studentId || "")
                        .toLowerCase();

                return (
                    (!q ||
                        studentName.includes(q) ||
                        studentId.includes(q)
                    ) &&
                    (!gf ||
                        s.gradeLevel === gf
                    )
                );

            });


        document.getElementById("studentRows").innerHTML =

            list.map(s => `

                <tr>

                    <td class="student-cell">

                        <strong>
                            ${GT.esc(s.name)}
                        </strong>

                        <span>
                            ${GT.esc(s.studentId)}
                        </span>

                    </td>


                    <td>
                        ${GT.esc(s.gradeLevel)}
                        -
                        ${GT.esc(s.section)}
                    </td>


                    <td>
                        ${GT.esc(s.gender || "—")}
                    </td>


                    <td>
                        ${GT.esc(s.schoolYear || "—")}
                    </td>


                    <td>

                        <div class="actions">

                            <button
                                class="icon-btn"
                                title="Edit"
                                onclick='modal(
                                    students.find(
                                        x => x.uid === "${s.uid}"
                                    )
                                )'>
                                ✎
                            </button>


                            <button
                                class="icon-btn"
                                title="Grades"
                                onclick='location.href =
                                    "grades.html?student=" +
                                    encodeURIComponent("${s.uid}")'>
                                ▤
                            </button>


                            <button
                                class="icon-btn"
                                title="Report"
                                onclick='location.href =
                                    "reports.html?student=" +
                                    encodeURIComponent("${s.uid}")'>
                                ▥
                            </button>


                            <button
                                class="icon-btn"
                                title="Delete"
                                onclick='del("${s.uid}")'>
                                ×
                            </button>

                        </div>

                    </td>

                </tr>

            `)
            .join("")

            ||

            `
                <tr>
                    <td
                        colspan="5"
                        class="empty">
                        No students found.
                    </td>
                </tr>
            `;

    };


    document
        .getElementById("search")
        .oninput = draw;

    document
        .getElementById("gradeFilter")
        .onchange = draw;

    draw();

}


render();
