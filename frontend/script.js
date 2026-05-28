const API_URL = "http://localhost:5170/api/Leave";

function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "employee" && password === "123") {

        window.location.href = "dashboard.html";
    }

    else if (username === "admin" && password === "123") {

        window.location.href = "admin.html";
    }

    else {

        alert("Invalid Login");
    }
}

async function applyLeave() {

    const leaveData = {

        employeeName: document.getElementById("employeeName").value,

        leaveType: document.getElementById("leaveType").value,

        fromDate: document.getElementById("fromDate").value,

        toDate: document.getElementById("toDate").value,

        reason: document.getElementById("reason").value,

        status: "Pending"
    };

    // Validation
    if (
        !leaveData.employeeName ||
        !leaveData.fromDate ||
        !leaveData.toDate ||
        !leaveData.reason
    ) {

        alert("Please fill all fields");

        return;
    }

    try {

        const response = await fetch(`${API_URL}/apply`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(leaveData)
        });

        const data = await response.json();

        alert(data.message);

        // Clear Form
        document.getElementById("employeeName").value = "";
        document.getElementById("fromDate").value = "";
        document.getElementById("toDate").value = "";
        document.getElementById("reason").value = "";

        loadLeaves();

    }

    catch (error) {

        console.log(error);

        alert("Error applying leave");
    }
}

async function loadLeaves() {

    try {

        const response = await fetch(API_URL);

        const leaves = await response.json();

        // Dashboard Statistics
        const total = leaves.length;

        const approved = leaves.filter(
            l => l.status === "Approved"
        ).length;

        const pending = leaves.filter(
            l => l.status === "Pending"
        ).length;

        if (document.getElementById("totalLeaves")) {

            document.getElementById("totalLeaves").innerText = total;
        }

        if (document.getElementById("approvedLeaves")) {

            document.getElementById("approvedLeaves").innerText = approved;
        }

        if (document.getElementById("pendingLeaves")) {

            document.getElementById("pendingLeaves").innerText = pending;
        }

        // Employee Dashboard Table
        const table = document.getElementById("leaveTable");

        if (table) {

            table.innerHTML = "";

            leaves.forEach(leave => {

                table.innerHTML += `
                    <tr>
                        <td>${leave.employeeName}</td>
                        <td>${leave.leaveType}</td>
                        <td>${leave.status}</td>
                    </tr>
                `;
            });
        }

        // HR Admin Table
        const adminTable = document.getElementById("adminTable");

        if (adminTable) {

            adminTable.innerHTML = "";

            leaves.forEach(leave => {

                let actionButtons = "";

                if (leave.status === "Pending") {

                    actionButtons = `
                        <button 
                            class="btn btn-success btn-sm"
                            onclick="approveLeave(${leave.id})">
                            Approve
                        </button>

                        <button 
                            class="btn btn-danger btn-sm"
                            onclick="rejectLeave(${leave.id})">
                            Reject
                        </button>
                    `;
                }

                else {

                    actionButtons = `
                        <span class="badge bg-secondary">
                            Action Completed
                        </span>
                    `;
                }

                adminTable.innerHTML += `
                    <tr>
                        <td>${leave.employeeName}</td>
                        <td>${leave.leaveType}</td>
                        <td>${leave.status}</td>

                        <td>
                            ${actionButtons}
                        </td>
                    </tr>
                `;
            });
        }

    }

    catch (error) {

        console.log(error);
    }
}

async function approveLeave(id) {

    await fetch(`${API_URL}/approve/${id}`, {

        method: "PUT"
    });

    loadLeaves();
}

async function rejectLeave(id) {

    await fetch(`${API_URL}/reject/${id}`, {

        method: "PUT"
    });

    loadLeaves();
}

function logout() {

    window.location.href = "index.html";
}

// Auto Load Data
loadLeaves();

