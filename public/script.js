console.log("script loaded");
function showUser() {
  document.getElementById("userPanel").style.display = "block";
  document.getElementById("adminPanel").style.display = "none";

  document.getElementById("userBtn").classList.add("active");
  document.getElementById("adminBtn").classList.remove("active");
  document.querySelector(".slider").style.left = "4px";
}

function showAdmin() {
  document.getElementById("userPanel").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";

  document.getElementById("adminBtn").classList.add("active");
  document.getElementById("userBtn").classList.remove("active");

  document.querySelector(".slider").style.left = "50%";
  loadComplaints();
}


function submitComplaint(){
    fetch("/complaints",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            title: document.getElementById("title").value,
            description: document.getElementById("description").value
        })
    }).then(res => res.json())
        .then(data => {
            document.getElementById("msg").innerText =
            `Complaint submitted successfully. Your Complaint ID is ${data.id}`;

            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("title").value = "";
            document.getElementById("description").value = "";
    })
}

function loadComplaints(){

    fetch("/complaints")
        .then(res =>res.json())
        .then(data => {
            const table=document.getElementById("complaintTable");
            if(!table) return;
            
            table.innerHTML = "";

            data.forEach(c=>{
                table.innerHTML+=`
                <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.email}</td>
                <td>${c.title}</td>
                <td>
                    <span class="status ${c.status}">
                        ${c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                    </td>
                     <td>${c.date}</td>

                    <td class="actions">
                        <button
                            class="resolve-btn"
                            type="button"
                            onclick="updateStatus(${c.id})">
                            Resolve
                        </button>

                        <button
                            class="delete-btn"
                            type="button"
                            onclick="deleteComplaint(${c.id}, this)">
                            Delete
                        </button>
                        </td>

                </tr>
                `;
            })
        })
}

function updateStatus(id){
    console.log("Resolve clicked for ID:", id);
    fetch(`/complaints/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({status: "resolved"})
    }).then(() => loadComplaints());
}

function deleteComplaint(id,btn) {
  console.log("Delete clicked for ID:", id);

  fetch(`/complaints/${id}`, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(data => {
     document.getElementById("adminMsg").innerText = data.message;
     btn.closest("tr").remove();
  })
  .catch(err => console.error(err));
}
